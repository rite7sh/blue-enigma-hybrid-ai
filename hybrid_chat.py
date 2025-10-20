import json
from typing import List, Dict, Any
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from neo4j import GraphDatabase
from dotenv import load_dotenv
import config

# Load environment variables
load_dotenv()

EMBED_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"
TOP_K = 5

INDEX_NAME = config.PINECONE_INDEX_NAME

client = OpenAI(api_key=config.OPENAI_API_KEY)
pc = Pinecone(api_key=config.PINECONE_API_KEY)

# Ensure Pinecone index exists
if INDEX_NAME not in pc.list_indexes().names():
    print(f"[INFO] Creating managed index: {INDEX_NAME}")
    pc.create_index(
        name=INDEX_NAME,
        dimension=config.PINECONE_VECTOR_DIM,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=config.PINECONE_ENV),
    )

index = pc.Index(INDEX_NAME)
driver = GraphDatabase.driver(config.NEO4J_URI, auth=(config.NEO4J_USER, config.NEO4J_PASSWORD))


def embed_text(text: str) -> List[float]:
    try:
        response = client.embeddings.create(model=EMBED_MODEL, input=[text])
        return response.data[0].embedding
    except Exception as e:
        print(f"[ERROR] Embedding failed: {e}")
        return [0.0] * 1536


def pinecone_query(query_text: str, top_k: int = TOP_K) -> List[Dict[str, Any]]:
    vector = embed_text(query_text)
    response = index.query(vector=vector, top_k=top_k, include_metadata=True)
    matches = response.get("matches", [])
    print(f"[DEBUG] Pinecone results fetched: {len(matches)}")
    return matches


def fetch_graph_context(node_ids: List[str], depth: int = 1) -> List[Dict[str, Any]]:
    facts = []
    with driver.session() as session:
        for node_id in node_ids:
            query = (
                "MATCH (n:Entity {id:$nid})-[r]-(m:Entity) "
                "RETURN type(r) AS rel, m.id AS id, m.name AS name, "
                "m.description AS description "
                "LIMIT 10"
            )
            records = session.run(query, nid=node_id)
            for r in records:
                facts.append({
                    "source": node_id,
                    "rel": r["rel"],
                    "target_id": r["id"],
                    "target_name": r["name"],
                    "target_desc": (r["description"] or "")[:300]
                })
    print(f"[DEBUG] Graph facts fetched: {len(facts)}")
    return facts


def build_prompt(user_query: str, pinecone_matches: List[Dict], graph_facts: List[Dict]) -> List[Dict]:
    system_message = (
        "You are a helpful and professional travel assistant. "
        "Use both semantic search results and graph relationships "
        "to answer the user's question concisely and informatively. "
        "Mention relevant attractions, locations, and provide 2–3 itinerary tips where possible."
    )

    vector_context = [
        f"- id: {m.get('id')}, name: {m.get('metadata', {}).get('name', '')}, "
        f"type: {m.get('metadata', {}).get('type', '')}, city: {m.get('metadata', {}).get('city', '')}"
        for m in pinecone_matches
    ]

    graph_context = [
        f"- ({f['source']}) -[{f['rel']}]-> ({f['target_id']}) {f['target_name']}: {f['target_desc']}"
        for f in graph_facts
    ]

    return [
        {"role": "system", "content": system_message},
        {"role": "user", "content":
            f"User query: {user_query}\n\n"
            f"Top semantic matches:\n{chr(10).join(vector_context)}\n\n"
            f"Graph facts:\n{chr(10).join(graph_context)}\n\n"
            f"Now, based on all the above context, craft your best possible travel advice."}
    ]


def call_chat(prompt_messages: List[Dict]) -> str:
    try:
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=prompt_messages,
            max_tokens=600,
            temperature=0.4
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[ERROR] Chat model failed: {e}")
        return "Sorry, I couldn't generate a response due to an internal error."


def get_hybrid_answer(user_query: str) -> Dict[str, Any]:
    try:
        pinecone_matches = pinecone_query(user_query, top_k=TOP_K)
        node_ids = [m.get("id") for m in pinecone_matches if m.get("id")]
        graph_facts = fetch_graph_context(node_ids)
        prompt = build_prompt(user_query, pinecone_matches, graph_facts)
        answer = call_chat(prompt)

        safe_matches = [
            {"id": m.get("id"), "score": m.get("score"), "metadata": m.get("metadata", {})}
            for m in pinecone_matches
        ]

        return {
            "query": user_query,
            "answer": answer,
            "matches": safe_matches,
            "graph_facts": graph_facts or []
        }

    except Exception as e:
        print(f"[ERROR] get_hybrid_answer failed: {e}")
        return {
            "query": user_query,
            "answer": "An unexpected error occurred while generating the answer.",
            "matches": [],
            "graph_facts": []
        }


if __name__ == "__main__":
    print("Hybrid Travel Assistant CLI")
    while True:
        user_input = input("\nAsk your travel question (or 'exit'): ").strip()
        if user_input.lower() in ("exit", "quit"):
            break
        result = get_hybrid_answer(user_input)
        print("\n=== Assistant Answer ===\n")
        print(result["answer"])
        print("\n--- Debug Info ---")
        print(f"Matches: {len(result['matches'])}, Graph facts: {len(result['graph_facts'])}")
