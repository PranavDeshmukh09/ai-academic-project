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

    {
      "name": "string",
      "email": "string",
      "password": "string",
      "department": "string",
      "year": 0,
      "mentor_name": "string"
    }

**Response:** Returns a JWT access token.

### POST /auth/login
Logs in an existing student.

**Request body:**

    {
      "email": "string",
      "password": "string"
    }

**Response:** Returns a JWT access token.

### POST /projects/submit
Submits a new project idea. Requires a valid JWT token (Authorization header).

**Request body:**

    {
      "title": "string",
      "description": "string",
      "domain": "string"
    }

**Response:** Confirms submission with a project_id and status ("Pending Evaluation"). The student is automatically identified from the login token.