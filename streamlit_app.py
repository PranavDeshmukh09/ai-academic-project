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
if "faculty_view" not in st.session_state:
    st.session_state.faculty_view = False

# --- LEFT SIDEBAR (Controls & Uploads) ---
with st.sidebar:
    st.title("⚙️ Mentor Controls")
    
    st.session_state.faculty_view = st.toggle("👨‍🏫 Switch to Faculty View", value=st.session_state.faculty_view)
    st.divider()
    
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

# --- FACULTY DASHBOARD VIEW ---
if st.session_state.faculty_view:
    st.title("👨‍🏫 Faculty Monitoring Dashboard")
    st.markdown("Overview of all student projects and their real-time health metrics.")
    
    with st.spinner("Fetching data from backend..."):
        try:
            res = requests.get(f"{API_URL}/faculty/dashboard")
            if res.status_code == 200:
                dashboard_data = res.json()
                projects = dashboard_data.get("projects", [])
                
                if not projects:
                    st.info("No projects found in the database.")
                else:
                    import pandas as pd
                    df = pd.DataFrame(projects)
                    
                    # Display metrics
                    st.metric("Total Active Projects", len(projects))
                    
                    # Display dataframe
                    st.dataframe(df, use_container_width=True)
                    
                    # Export button
                    export_res = requests.get(f"{API_URL}/faculty/dashboard/export")
                    if export_res.status_code == 200:
                        st.download_button(
                            label="📥 Download CSV Report",
                            data=export_res.content,
                            file_name="faculty_dashboard_export.csv",
                            mime="text/csv"
                        )
            else:
                st.error("Failed to load dashboard data.")
        except Exception as e:
            st.error(f"Connection Error: {e}")
            
    st.stop()  # Stop rendering the student view below

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

    # Show all agent outputs in organized tabs
    tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10 = st.tabs([
        "📈 Skills", "📝 Evaluation", "📅 Plan", "💻 Tech Stack", "⚠️ Risks", "🤝 Mentor", "📚 Final Docs", "🔄 Progress", "📅 Check-in", "📄 Gen Docs"
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
        
    with tab8:
        st.subheader("🔄 Submit Progress Update")
        progress_text = st.text_area("What did you accomplish this week?", placeholder="e.g. I finished setting up the database and wrote the API endpoints.")
        if st.button("Submit Update & Adjust Plan", type="primary"):
            if progress_text:
                with st.spinner("Adjusting project plan..."):
                    try:
                        res = requests.post(f"{API_URL}/progress_update", json={"project_id": st.session_state.project_id, "update_text": progress_text})
                        if res.status_code == 200:
                            st.success("Plan updated successfully! Check the '📅 Plan' tab.")
                            st.session_state.latest_insight["project_plan"] = res.json().get("project_plan")
                            st.rerun()
                        else:
                            st.error(f"Error: {res.text}")
                    except Exception as e:
                        st.error(f"Connection Error: {e}")
            else:
                st.warning("Please enter your progress update.")

    with tab9:
        st.subheader("📅 Weekly Check-in")
        if st.button("Run Weekly Check-in", type="primary"):
            with st.spinner("Mentor is reviewing your progress..."):
                try:
                    res = requests.post(f"{API_URL}/check_in", json={"project_id": st.session_state.project_id})
                    if res.status_code == 200:
                        report = res.json().get("check_in_report", "")
                        st.session_state.latest_insight["check_in_report"] = report
                        st.rerun()
                    else:
                        st.error(f"Error: {res.text}")
                except Exception as e:
                    st.error(f"Connection Error: {e}")
        
        if st.session_state.latest_insight.get("check_in_report"):
            raw_report = st.session_state.latest_insight["check_in_report"]
            try:
                parsed_report = json.loads(raw_report)
                display_text = parsed_report.get("student_feedback", raw_report)
            except:
                display_text = raw_report
            st.markdown(display_text)
            
    with tab10:
        st.subheader("📄 On-Demand Document Generation")
        doc_type = st.selectbox("Select Document Type", ["Synopsis", "Methodology", "Progress Report", "Final Thesis Outline"])
        if st.button("Generate Document", type="primary"):
            with st.spinner(f"Generating {doc_type}..."):
                try:
                    res = requests.post(f"{API_URL}/generate_document", json={"project_id": st.session_state.project_id, "doc_type": doc_type})
                    if res.status_code == 200:
                        doc = res.json().get("generated_document", "")
                        st.session_state.latest_insight["generated_document"] = doc
                        st.rerun()
                    else:
                        st.error(f"Error: {res.text}")
                except Exception as e:
                    st.error(f"Connection Error: {e}")
                    
        if st.session_state.latest_insight.get("generated_document"):
            st.markdown("### Generated Document")
            st.markdown(st.session_state.latest_insight["generated_document"])
            st.download_button("Download Markdown", st.session_state.latest_insight["generated_document"], file_name=f"{doc_type.lower().replace(' ', '_')}.md")

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

