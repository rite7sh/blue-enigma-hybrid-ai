from pinecone import Pinecone
from neo4j import GraphDatabase
import config

print("🔍 Checking Pinecone...")
try:
    pc = Pinecone(api_key=config.PINECONE_API_KEY)
    index = pc.Index(config.PINECONE_INDEX_NAME)
    stats = index.describe_index_stats()
    print(f"✅ Pinecone connected — {stats['total_vector_count']} vectors found.")
except Exception as e:
    print("❌ Pinecone connection failed:", e)

print("\n🔍 Checking Neo4j...")
try:
    driver = GraphDatabase.driver(config.NEO4J_URI, auth=(config.NEO4J_USER, config.NEO4J_PASSWORD))
    with driver.session() as session:
        count = session.run("MATCH (n) RETURN count(n) AS count").single()["count"]
    print(f"✅ Neo4j connected — {count} nodes found.")
except Exception as e:
    print("❌ Neo4j connection failed:", e)
