import json
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import config
from hybrid_chat import (
    get_hybrid_answer,
    pinecone_query,
    fetch_graph_context,
    build_prompt,
)
from visualize_graph import generate_graph_html

# -----------------------------------------------------
# App Initialization
# -----------------------------------------------------
app = FastAPI(
    title="Blue Enigma AI Travel API",
    description="Hybrid AI Travel Assistant using Pinecone + Neo4j + OpenAI",
    version="1.1.2",
)

# -----------------------------------------------------
# CORS Setup
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Models
# -----------------------------------------------------
class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    query: str
    answer: str
    matches: list
    graph_facts: list


class GraphResponse(BaseModel):
    graph_url: str


# -----------------------------------------------------
# Clients
# -----------------------------------------------------
client = OpenAI(api_key=config.OPENAI_API_KEY)

# -----------------------------------------------------
# Regular Chat Endpoint
# -----------------------------------------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """Returns the full AI answer in one go (non-streaming)."""
    try:
        if not req.query.strip():
            raise HTTPException(status_code=400, detail="Query text cannot be empty.")
        response = get_hybrid_answer(req.query)
        return response
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# -----------------------------------------------------
# Streaming Chat Endpoint
# -----------------------------------------------------
@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """Stream OpenAI's response token-by-token using SSE."""
    try:
        if not req.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        pinecone_matches = pinecone_query(req.query)
        node_ids = [m.get("id") for m in pinecone_matches if m.get("id")]
        graph_facts = fetch_graph_context(node_ids)
        prompt = build_prompt(req.query, pinecone_matches, graph_facts)

        def stream_response():
            try:
                stream = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=prompt,
                    max_tokens=700,
                    temperature=0.4,
                    stream=True,
                )
                for chunk in stream:
                    delta = getattr(chunk.choices[0].delta, "content", None)
                    if delta:
                        yield f"data: {json.dumps({'token': delta})}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                print(f"[STREAM ERROR]: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingResponse(stream_response(), media_type="text/event-stream")

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Streaming error: {str(e)}")


# -----------------------------------------------------
# Graph Endpoint
# -----------------------------------------------------
@app.get("/graph", response_model=GraphResponse)
async def graph_endpoint():
    """Generate graph visualization HTML."""
    try:
        path = generate_graph_html()
        return {"graph_url": path}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Graph visualization error: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "🌍 Blue Enigma AI Travel API is live!",
        "endpoints": {
            "Chat": "/chat (POST)",
            "Chat Stream": "/chat/stream (POST)",
            "Graph": "/graph (GET)",
        },
        "version": "1.1.2",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
