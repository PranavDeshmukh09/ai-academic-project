import os 
import uuid
from pypdf import PdfReader
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

# Use Pinecone Serverless Inference instead of local HuggingFace/Torch models
class PineconeInferenceEmbeddings:
    def __init__(self, pc_client, model_name="llama-text-embed-v2", dimension=384):
        self.pc = pc_client
        self.model_name = model_name
        self.dimension = dimension

    def embed_documents(self, texts: list) -> list:
        if not texts:
            return []
        
        all_embeddings = []
        # Batch requests to Pinecone Inference API to handle limits safely
        batch_size = 32
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            res = self.pc.inference.embed(
                model=self.model_name,
                inputs=batch,
                parameters={"input_type": "passage", "dimension": self.dimension}
            )
            all_embeddings.extend([emb.values for emb in res])
        return all_embeddings

    def embed_query(self, query: str) -> list:
        res = self.pc.inference.embed(
            model=self.model_name,
            inputs=[query],
            parameters={"input_type": "query", "dimension": self.dimension}
        )
        return res[0].values

embeddings = PineconeInferenceEmbeddings(pc)

def split_text(text: str, chunk_size: int = 1000, chunk_overlap: int = 100) -> list:
    # Quick utility to split text into chunks based on character length, aligning to paragraphs
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""
    
    for paragraph in paragraphs:
        if len(current_chunk) + len(paragraph) + 2 > chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
            if len(paragraph) > chunk_size:
                # If paragraph itself is too large, split it with overlap
                start = 0
                while start < len(paragraph):
                    end = start + chunk_size
                    chunks.append(paragraph[start:end].strip())
                    start += chunk_size - chunk_overlap
                current_chunk = ""
            else:
                current_chunk = paragraph
        else:
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph
                
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def ingest_document(file_path: str, project_id: int):
    # Load PDF text directly using pypdf to avoid langchain_community loading local libraries
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            full_text += page_text + "\n"
            
    splits = split_text(full_text)
    if not splits:
        return 0
        
    # Embed using Pinecone Serverless Inference API
    vector_list = embeddings.embed_documents(splits)
    
    vectors_to_upsert = []
    for chunk_text, vector in zip(splits, vector_list):
        vectors_to_upsert.append({
            "id": str(uuid.uuid4()),
            "values": vector,
            "metadata": {"project_id": project_id, "text": chunk_text}
        })
        
    index.upsert(vectors=vectors_to_upsert)
    return len(splits)

def ingest_text(text: str, project_id: int):
    if isinstance(text, list):
        text = "\n".join([str(t) for t in text])
        
    splits = split_text(text)
    if not splits:
        return 0

    vector_list = embeddings.embed_documents(splits)

    vectors_to_upsert = []
    for chunk_text, vector in zip(splits, vector_list):
        vectors_to_upsert.append({
            "id": str(uuid.uuid4()),
            "values": vector,
            "metadata": {"project_id": project_id, "text": chunk_text}
        })

    index.upsert(vectors=vectors_to_upsert)
    return len(splits)

def retrive_documents(project_id: int, query: str, top_k: int = 3) -> str:
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