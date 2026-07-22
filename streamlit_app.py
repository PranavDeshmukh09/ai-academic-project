import streamlit as st
import requests
import json

# --- CONFIGURATION ---
API_URL = "http://localhost:8000"
st.set_page_config(layout="wide", page_title="AI Academic Mentor", page_icon="🎓")

# --- INITIALIZE SESSION STATE ---
if "messages" not in st.session_state:
    st.session_state.messages = []
if "project_id" not in st.session_state:
    st.session_state.project_id = 1
if "latest_insight" not in st.session_state:
    st.session_state.latest_insight = None

# --- LEFT SIDEBAR (Controls & Uploads) ---
with st.sidebar:
    st.title("⚙️ Mentor Controls")
    
    # 1. Project Identity
    st.subheader("Authentication")
    st.session_state.project_id = st.number_input("Project ID", value=st.session_state.project_id, step=1)
    
    if st.button("Initialize Project", type="primary"):
        with st.spinner("Initializing Project & Generating Documents..."):
            try:
                res = requests.post(f"{API_URL}/initialize", json={"project_id": st.session_state.project_id})
                if res.status_code == 200:
                    st.success("Project Initialized!")
                else:
                    st.error(f"Initialization Failed: {res.text}")
            except Exception as e:
                st.error(f"Connection Error: {str(e)}")

    if st.button("Clear Chat History"):
        st.session_state.messages = []
        st.session_state.latest_insight = None
        st.rerun()

    st.divider()

    # 2. Document Upload (RAG)
    st.subheader("📄 Upload Context (RAG)")
    uploaded_file = st.file_uploader("Upload Rubric/Code (PDF)", type=["pdf"])
    file_description = st.text_input("File Description", placeholder="e.g. Final Year Project Rubric")
    
    if st.button("Upload to Cloud"):
        if uploaded_file and file_description:
            with st.spinner("Chunking & Uploading to Pinecone..."):
                try:
                    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")}
                    data = {"project_id": st.session_state.project_id, "description": file_description}
                    
                    response = requests.post(f"{API_URL}/upload", files=files, data=data)
                    
                    if response.status_code == 200:
                        st.success(response.json().get("message", "Uploaded successfully!"))
                    else:
                        st.error(f"Failed: {response.text}")
                except Exception as e:
                    st.error(f"Connection Error: {str(e)}")
        else:
            st.warning("Please provide both a file and a description.")


# --- MAIN LAYOUT (3-Pane Style) ---
# We use a 70/30 split to fake a "Right Sidebar" for insights
chat_col, insight_col = st.columns([6, 4], gap="large")

# --- CENTER PANE: CHAT INTERFACE ---
with chat_col:
    st.title("🎓 AI Academic Mentor")
    # Initialize Greeting if empty
    if not st.session_state.messages:
        greeting = "Hello! 👋 I am your AI Academic Mentor.\n\nI am ready to help you with your project. You can ask me for tech stack recommendations, architecture advice, or upload rubrics on the left!"
        st.session_state.messages.append({"role": "assistant", "content": greeting})

    # Render previous messages
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            
    # Chat Input
    if prompt := st.chat_input("Ask for project advice, code reviews, or grading rubrics..."):
        # Append User Message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
            
        # Call FastAPI Backend
        with st.chat_message("assistant"):
            with st.spinner("Consulting AI Mentor..."):
                try:
                    payload = {
                        "project_id": st.session_state.project_id,
                        "message": prompt
                    }
                    response = requests.post(f"{API_URL}/chat", json=payload)
                    
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Extract the dedicated chat reply
                        raw_reply = data.get("chat_reply", "{}")
                        try:
                            # Attempt to parse the structured JSON from the LLM
                            parsed_reply = json.loads(raw_reply)
                            chat_text = parsed_reply.get("reply", "I have updated your documentation. Check the insights panel!")
                        except json.JSONDecodeError:
                            # Fallback if LLM didn't return perfect JSON
                            chat_text = raw_reply
                            
                        st.markdown(chat_text)
                        
                        # Save the full data payload for the Right Pane
                        st.session_state.latest_insight = data
                        
                        # Append Assistant Message
                        st.session_state.messages.append({"role": "assistant", "content": chat_text})
                    else:
                        st.error(f"API Error: {response.text}")
                except Exception as e:
                    st.error(f"Failed to connect to backend: {str(e)}")


# --- RIGHT PANE: DOCUMENTATION & INSIGHTS ---
with insight_col:
    st.subheader("📊 System Insights")
    
    if st.session_state.latest_insight:
        data = st.session_state.latest_insight
        
        st.info("Live data from Multi-Agent system:")
        
        tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
            "💻 Tech", "📈 Skills", "📝 Eval", "📅 Plan", "⚠️ Risk", "📚 Docs"
        ])
        
        with tab1:
            st.markdown(data.get("tech_stack") or "No tech stack generated yet.")
        with tab2:
            st.markdown(data.get("skill_report") or "No skill analysis available.")
        with tab3:
            st.markdown(data.get("project_evaluation") or "No evaluation available.")
        with tab4:
            st.markdown(data.get("project_plan") or "No plan generated.")
        with tab5:
            st.markdown(data.get("risk_analysis") or "No risks identified.")
        with tab6:
            st.markdown(data.get("final_documentation") or "No documentation drafted.")
            
    else:
        st.caption("Initialize a project or start a conversation to see live agent insights appear here.")
