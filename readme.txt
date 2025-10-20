# Blue Enigma - Hybrid AI Travel Assistant

This project implements a hybrid AI travel assistant that combines semantic retrieval, graph reasoning, and generative responses.  
It leverages **Pinecone**, **Neo4j**, and **OpenAI GPT models** to deliver context-aware travel planning assistance through an interactive chat interface.

---

## Overview

The system unifies three layers of intelligence:

1. **Semantic Retrieval (Pinecone):** Finds contextually relevant travel data using vector embeddings.
2. **Graph Reasoning (Neo4j):** Explores entity relationships such as destinations, activities, and accommodations.
3. **Generative Synthesis (OpenAI GPT):** Combines the retrieved context to generate a personalized response.

It features a **FastAPI backend** for hybrid reasoning and a **React + Tailwind frontend** with real-time streaming chat.

---

## Features

- Hybrid AI reasoning pipeline (Neo4j + Pinecone + OpenAI)
- Real-time text streaming responses using Server-Sent Events (SSE)
- Markdown rendering with `marked.js`
- Modern UI built with Tailwind CSS and Framer Motion
- Graph visualization endpoint for Neo4j data
- Modular, extensible architecture

---

## Tech Stack

**Backend**
- FastAPI
- Python 3.10+
- Pinecone
- Neo4j
- OpenAI API

**Frontend**
- React (Vite)
- Tailwind CSS
- Marked.js
- Framer Motion

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/blue-enigma-ai.git
cd blue-enigma-ai

2. Backend Setup

-Create and activate a virtual environment: python -m venv .venv
source .venv/bin/activate  
# Windows: .venv\Scripts\activate

-Install dependencies: pip install -r requirements.txt

-Create a config.py file in the backend directory: OPENAI_API_KEY = "your_openai_api_key"
PINECONE_API_KEY = "your_pinecone_api_key"
PINECONE_INDEX_NAME = "your_index_name"
PINECONE_VECTOR_DIM = 1536
NEO4J_URI = "neo4j+s://your_neo4j_instance_uri"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "your_neo4j_password"

-Run the backend: uvicorn api:app --reload
Backend runs at:
http://127.0.0.1:8000

3. Frontend Setup

Navigate to the frontend folder: cd blue-enigma-frontend
npm install
npm run dev

| Endpoint       | Method | Description                               |
| -------------- | ------ | ----------------------------------------- |
| `/chat`        | POST   | Standard response (non-streaming)         |
| `/chat/stream` | POST   | Token-based streaming response            |
| `/graph`       | GET    | Generates and returns graph visualization |


Folder Structure

blue-enigma/
├── api.py
├── hybrid_chat.py
├── visualize_graph.py
├── config.py
├── requirements.txt
├── README.md
├── blue-enigma-frontend/
│   ├── src/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── data/ (optional)



