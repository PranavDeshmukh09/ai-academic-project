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
if "initialized" not in st.session_state:
    st.session_state.initialized = False

# --- LEFT SIDEBAR (Controls & Uploads) ---
with st.sidebar:
    st.title("⚙️ Mentor Controls")
    
    # 1. Project Identity
    st.subheader("🔑 Project Setup")
    st.session_state.project_id = st.number_input("Project ID", value=st.session_state.project_id, step=1)
    
    if st.button("🚀 Initialize Project", type="primary", use_container_width=True):
        with st.spinner("Running 7-Agent Pipeline... This may take a minute."):
            try:
                res = requests.post(
                    f"{API_URL}/initialize",
                    json={"project_id": st.session_state.project_id},
                    timeout=300
                )
                if res.status_code == 200:
                    data = res.json()
                    st.session_state.latest_insight = data
                    st.session_state.initialized = True
                    st.success("✅ All 7 agents completed!")
                    st.rerun()
                else:
                    st.error(f"Initialization Failed: {res.text}")
            except Exception as e:
                st.error(f"Connection Error: {str(e)}")

    if st.button("🗑️ Clear Chat & Reset", use_container_width=True):
        st.session_state.messages = []
        st.session_state.latest_insight = None
        st.session_state.initialized = False
        st.rerun()

    st.divider()

    # 2. Document Upload (RAG)
    st.subheader("📄 Upload Context (RAG)")
    uploaded_file = st.file_uploader("Upload Rubric/Code (PDF)", type=["pdf"])
    file_description = st.text_input("File Description", placeholder="e.g. Final Year Project Rubric")
    
    if st.button("Upload to Cloud", use_container_width=True):
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


# =============================================
# MAIN CONTENT AREA
# =============================================

# --- STATE 1: NOT INITIALIZED YET → Show welcome screen ---
if not st.session_state.initialized:
    st.title("🎓 AI Academic Mentor")
    st.markdown("---")
    st.info("👈 Enter your **Project ID** in the sidebar and click **Initialize Project** to begin. The AI pipeline will generate your complete project analysis.")
    
    st.markdown("""
    ### What happens when you initialize?
    The system runs **7 specialized AI agents** in sequence:
    
    | # | Agent | What it does |
    |---|-------|-------------|
    | 1 | 📈 **Skill Assessment** | Evaluates your technical skills |
    | 2 | 📝 **Project Evaluation** | Analyzes feasibility of your idea |
    | 3 | 📅 **Project Planning** | Creates milestones & timeline |
    | 4 | 💻 **Tech Stack** | Recommends technologies |
    | 5 | ⚠️ **Risk Analysis** | Identifies potential risks |
    | 6 | 🤝 **Mentor Advice** | Personalized guidance |
    | 7 | 📚 **Documentation** | Compiles everything together |
    """)

# --- STATE 2: INITIALIZED → Show pipeline results + chat ---
else:
    data = st.session_state.latest_insight

    # ---- TOP SECTION: PIPELINE RESULTS (Always visible) ----
    st.title("🎓 AI Academic Mentor — Project Dashboard")
    st.success(f"✅ Project **{st.session_state.project_id}** initialized successfully! All agent outputs are below.")
    st.markdown("---")

    # Show all 7 agent outputs in organized tabs
    tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
        "📈 Skills", "📝 Evaluation", "📅 Plan", "💻 Tech Stack", "⚠️ Risks", "🤝 Mentor", "📚 Final Docs"
    ])
    
    with tab1:
        st.subheader("📈 Skill Assessment Report")
        st.markdown(data.get("skill_report") or "_No skill report generated._")
    with tab2:
        st.subheader("📝 Project Evaluation")
        st.markdown(data.get("project_evaluation") or "_No evaluation generated._")
    with tab3:
        st.subheader("📅 Project Plan & Timeline")
        st.markdown(data.get("project_plan") or "_No plan generated._")
    with tab4:
        st.subheader("💻 Technology Stack Recommendations")
        st.markdown(data.get("tech_stack") or "_No tech stack generated._")
    with tab5:
        st.subheader("⚠️ Risk Analysis")
        st.markdown(data.get("risk_analysis") or "_No risk analysis generated._")
    with tab6:
        st.subheader("🤝 Mentor Advice")
        st.markdown(data.get("mentor_advice") or "_No mentor advice generated._")
    with tab7:
        st.subheader("📚 Final Documentation")
        st.markdown(data.get("final_documentation") or "_No documentation generated._")
    
    # ---- BOTTOM SECTION: CHAT INTERFACE ----
    st.markdown("---")
    st.subheader("💬 Chat with your AI Mentor")
    st.caption("Ask follow-up questions about your project plan, request changes, or get clarifications.")

    # Initialize chat greeting
    if not st.session_state.messages:
        greeting = "Your project has been analyzed! 🎉 I've reviewed your skills, evaluated your project idea, created a plan, recommended technologies, and identified risks.\n\nFeel free to ask me anything — for example:\n- *\"Can you explain the tech stack choice?\"*\n- *\"What if I want to use React instead?\"*\n- *\"How should I start week 1?\"*"
        st.session_state.messages.append({"role": "assistant", "content": greeting})

    # Render previous messages
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            
    # Chat Input
    if prompt := st.chat_input("Ask about your project plan, tech stack, risks..."):
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
                        resp_data = response.json()
                        
                        # Extract the chat reply
                        raw_reply = resp_data.get("chat_reply", "{}")
                        try:
                            parsed_reply = json.loads(raw_reply)
                            chat_text = parsed_reply.get("reply", "I have updated your documentation. Check the tabs above!")
                        except json.JSONDecodeError:
                            chat_text = raw_reply
                            
                        st.markdown(chat_text)
                        
                        # Append Assistant Message
                        st.session_state.messages.append({"role": "assistant", "content": chat_text})
                    else:
                        st.error(f"API Error: {response.text}")
                except Exception as e:
                    st.error(f"Failed to connect to backend: {str(e)}")

