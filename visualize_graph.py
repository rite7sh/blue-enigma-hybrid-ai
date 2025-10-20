from neo4j import GraphDatabase
from pyvis.network import Network
from dotenv import load_dotenv
import os
import config

# Load environment variables
load_dotenv()

NEO_BATCH = 500
driver = GraphDatabase.driver(config.NEO4J_URI, auth=(config.NEO4J_USER, config.NEO4J_PASSWORD))


def fetch_subgraph(tx, limit=500):
    q = (
        "MATCH (a:Entity)-[r]->(b:Entity) "
        "RETURN a.id AS a_id, labels(a) AS a_labels, a.name AS a_name, "
        "b.id AS b_id, labels(b) AS b_labels, b.name AS b_name, type(r) AS rel "
        "LIMIT $limit"
    )
    return list(tx.run(q, limit=limit))


def build_pyvis(rows, output_html="static/graph.html"):
    os.makedirs("static", exist_ok=True)
    net = Network(height="900px", width="100%", notebook=False, directed=True)
    net.barnes_hut()

    for rec in rows:
        a_id = rec["a_id"]
        b_id = rec["b_id"]
        a_name = rec["a_name"] or a_id
        b_name = rec["b_name"] or b_id
        a_labels = rec["a_labels"]
        b_labels = rec["b_labels"]
        rel = rec["rel"]

        net.add_node(a_id, label=f"{a_name}\n({','.join(a_labels)})", title=a_name, color="#0077b6")
        net.add_node(b_id, label=f"{b_name}\n({','.join(b_labels)})", title=b_name, color="#00b4d8")
        net.add_edge(a_id, b_id, title=rel)

    net.save_graph(output_html)
    print(f"[INFO] Graph visualization saved to {output_html}")
    return os.path.abspath(output_html)


def generate_graph_html(limit=NEO_BATCH):
    with driver.session() as session:
        rows = session.execute_read(fetch_subgraph, limit=limit)
    return build_pyvis(rows)


if __name__ == "__main__":
    path = generate_graph_html()
    print(f"[INFO] Visualization ready at: {path}")
