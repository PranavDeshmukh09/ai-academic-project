# Security & Data Governance Policy

The **AI Academic Project Mentor** platform implements defense-in-depth security standards to protect student academic intellectual property, user authentication credentials, and database integrity.

---

## 1. Security Architecture & Threat Mitigation

| Security Domain | Implemented Controls |
| :--- | :--- |
| **Authentication & Sessions** | Industry-standard JWT (JSON Web Tokens) with HMAC-SHA256 signing; 24-hour expiration token lifetime; secure bearer authorization headers. |
| **Password Storage** | Bcrypt cryptographic adaptive hashing with automatic salt generation (cost factor: 12). Plaintext passwords are never stored or logged. |
| **API Transport Security** | Strict CORS policy allowing only authorized client origins; input validation through Pydantic schemas rejecting unvalidated payloads. |
| **Data Isolation** | Relational data isolated per `student_id`; Pinecone vector embeddings partitioned using dedicated `project_{id}` namespaces. |
| **Secret Management** | Environment variables isolated via `.env` and `python-dotenv`. Zero hardcoding of API tokens or database URLs. |
| **LLM Prompt Injection Defense** | Sanitized user inputs with delimiters; system prompts structured with strict JSON schema constraints and output validators. |

---

## 2. Vulnerability Reporting & Disclosure Policy

If you discover a potential security vulnerability within this repository, please report it directly to the engineering team:

* **Primary Contact:** Pranav Deshmukh (Lead Architect)
* **Email:** security@ai-academic-mentor.edu *(or submit an internal engineering security ticket)*
* **Expected Response Window:** Within 48 hours.

### Reporting Guidelines
Please include:
1. Description of the vulnerability and affected endpoint/component.
2. Step-by-step reproduction steps or Proof of Concept (PoC) payload.
3. Potential impact assessment.

We adhere to **Responsible Disclosure** standards and appreciate your cooperation in keeping student project data secure.
