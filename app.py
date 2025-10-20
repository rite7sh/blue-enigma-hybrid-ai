import streamlit as st
from hybrid_chat import pinecone_query, fetch_graph_context, build_prompt, call_chat, TOP_K
import webbrowser

# -----------------------------
# Page Config
# -----------------------------
st.set_page_config(
    page_title="Triply | AI Travel Assistant",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# -----------------------------
# Custom CSS
# -----------------------------
st.markdown("""
    <style>
    body {
        background: linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%);
        font-family: 'Segoe UI', sans-serif;
        color: #2e2e2e;
    }
    .chat-container {
        max-width: 800px;
        margin: auto;
        background: #ffffff;
        border-radius: 20px;
        padding: 20px 30px;
        box-shadow: 0 4px 25px rgba(0,0,0,0.08);
    }
    .user-bubble {
        background-color: #DCF8C6;
        padding: 12px 18px;
        border-radius: 15px 15px 0 15px;
        margin-bottom: 10px;
        text-align: right;
        float: right;
        clear: both;
    }
    .bot-bubble {
        background-color: #f1f0f0;
        padding: 12px 18px;
        border-radius: 15px 15px 15px 0;
        margin-bottom: 10px;
        text-align: left;
        float: left;
        clear: both;
    }
    .title {
        font-size: 36px;
        font-weight: 700;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 5px;
        color: #00796b;
    }
    .subtitle {
        text-align: center;
        color: #666;
        font-size: 16px;
        margin-bottom: 40px;
    }
    .footer {
        text-align: center;
        font-size: 13px;
        margin-top: 30px;
        color: #999;
    }
    </style>
""", unsafe_allow_html=True)

# -----------------------------
# Header
# -----------------------------
st.markdown("<div class='title'>Triply AI</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Your smart hybrid travel planner 🌍✨</div>", unsafe_allow_html=True)

# -----------------------------
# Chat Session
# -----------------------------
if "messages" not in st.session_state:
    st.session_state["messages"] = []

# Chat display
st.markdown("<div class='chat-container'>", unsafe_allow_html=True)
for msg in st.session_state.messages:
    if msg["role"] == "user":
        st.markdown(f"<div class='user-bubble'>{msg['content']}</div>", unsafe_allow_html=True)
    else:
        st.markdown(f"<div class='bot-bubble'>{msg['content']}</div>", unsafe_allow_html=True)
st.markdown("</div>", unsafe_allow_html=True)

# -----------------------------
# Input box
# -----------------------------
query = st.chat_input("Ask me about destinations, itineraries, or attractions...")

if query:
    st.session_state.messages.append({"role": "user", "content": query})

    with st.spinner("Planning your trip... 🌴"):
        matches = pinecone_query(query, top_k=TOP_K)
        match_ids = [m["id"] for m in matches]
        graph_facts = fetch_graph_context(match_ids)
        prompt = build_prompt(query, matches, graph_facts)
        answer = call_chat(prompt)

    st.session_state.messages.append({"role": "assistant", "content": answer})
    st.experimental_rerun()

# -----------------------------
# Sidebar / Graph Viewer
# -----------------------------
with st.sidebar:
    st.header("🔍 Knowledge Graph")
    st.write("Visualize how destinations and attractions are connected in Neo4j.")
    if st.button("Open Graph Visualization"):
        webbrowser.open_new_tab("neo4j_viz.html")

# -----------------------------
# Footer
# -----------------------------
st.markdown("<div class='footer'>© 2025 Triply AI | Built with ❤️ using Streamlit, Pinecone & Neo4j</div>", unsafe_allow_html=True)
