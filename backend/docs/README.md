# Database Schema Documentation

## Tables

### student
| Column | Type | Description |
|---|---|---|
| student_id | SERIAL (PK) | Unique student identifier |
| name | VARCHAR | Student's full name |
| email | VARCHAR (unique) | Student's email, used for login |
| password | VARCHAR | Hashed password |
| department | VARCHAR | Student's department |
| year | INT | Academic year |
| mentor_name | VARCHAR | Name of the student's assigned mentor |

### skill_assessment
| Column | Type | Description |
|---|---|---|
| assessment_id | SERIAL (PK) | Unique assessment record |
| student_id | INT (FK → student) | Links to the student |
| skills | TEXT[] | Array of skills selected |
| experience_level | VARCHAR | e.g. Beginner/Intermediate/Advanced |
| score | INT | Assessment score |

### project_idea
| Column | Type | Description |
|---|---|---|
| project_id | SERIAL (PK) | Unique project record |
| student_id | INT (FK → student) | Student who submitted the idea |
| title | VARCHAR | Project title |
| description | TEXT | Project description |
| domain | VARCHAR | Project domain/category |
| status | VARCHAR | e.g. 'Pending Evaluation' |

## ER Diagram
See `er_diagram.png` in this folder.

## API Endpoints

### POST /auth/register
Registers a new student.
**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "department": "string",
  "year": 0,
  "mentor_name": "string"
}
```
**Response:** Returns a JWT access token.

### POST /auth/login
Logs in an existing student.
**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** Returns a JWT access token.

### POST /students/assessment
Submits a skill assessment for a student.
**Request body:**
```json
{
  "student_id": 0,
  "skills": ["string"],
  "experience_level": "string",
  "score": 0
}
```
**Response:** Confirms submission with an assessment_id.