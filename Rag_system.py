import os 
import uuid
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def ingest_document(file_path:str, project_id:int):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)    
    
    texts = [chunk.page_content for chunk in splits]
    
    # 1. Embed using our local HuggingFace model
    vector_list = embeddings.embed_documents(texts)
    
    # 2. Package into Pinecone format
    vectors_to_upsert = []
    for text, vector in zip(texts, vector_list):
        vectors_to_upsert.append({
            "id": str(uuid.uuid4()),
            "values": vector,
            "metadata": {"project_id": project_id, "text": text}
        })
        
    # 3. Upsert natively using Pinecone Client
    index.upsert(vectors=vectors_to_upsert)
    
    return len(splits)

def ingest_text(text:str, project_id:int):
    # "this function is responsible for spliting raw text embed it and then push it to pinecone under the project id for llm use"
    if isinstance(text, list):
        text = "\n".join([str(t) for t in text])
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_text(text)
    if not splits:
        return 0

    vector_list = embeddings.embed_documents(splits)

    vectors_to_upsert = []
    for chunk_text, vector in zip(splits, vector_list):
        vectors_to_upsert.append({
            "id":str(uuid.uuid4()),
            "values":vector,
            "metadata":{"project_id":project_id, "text": chunk_text}
        })

    index.upsert(vectors=vectors_to_upsert)
    return len(splits)

def retrive_documents(project_id: int, query:str, top_k: int = 3) -> str:
    query_vector = embeddings.embed_query(query)
    
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        filter={"project_id": project_id},
        include_metadata=True
    )
    
    if not results.matches:
        return "No relevant documents found."    
        
    return "\n\n...\n\n".join([match.metadata["text"] for match in results.matches])