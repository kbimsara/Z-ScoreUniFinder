



<div align="center">

<h1> 🎓 AI-Based University Search (Z-Score)

[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)](https://python.org/)

</div>

> **Empowering Sri Lankan students with AI-driven university recommendations based on A/L Z-Scores**

The **Z-Score University Finder** is a web application that provides personalized university and course recommendations for students in Sri Lanka based on their Advanced Level (A/L) Z-Score, academic stream, and district. Powered by a machine learning model, it matches students to universities and displays course demand (minimum Z-Score required). The application includes a feature to filter recommendations based on a Common General Test score threshold (≤ 30) and supports cross-stream course recommendations.

## Table of Contents
- [Features](#features)
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)

## Project Overview
- **Frontend**: Next.js with Tailwind CSS for responsive UI
- **Backend**: Node.js with Express.js for REST API
- **Database**: MongoDB for storing university data
- **Authentication**: JWT-based user authentication
- **AI Integration**: Z-score calculation and university ranking system

## Features
### Frontend Features
- **AI-Powered Search**: Z-score based university rankings
- **Dark Theme UI**: Modern interface with Tailwind CSS
- **Responsive Design**: Mobile-friendly navigation
- **Interactive Forms**: Dynamic search filters and dropdowns
- **Real-time Updates**: Live search results

### Backend Features
- **RESTful API**: Express.js based endpoints
- **Database Operations**: MongoDB CRUD operations
- **Authentication**: JWT token management
- **Data Processing**: Z-score calculation algorithms
- **API Security**: Rate limiting and input validation

## Prerequisites
- **Node.js**: Version 18.x or higher
- **Python**: Version 3.8 or higher
- **npm**: Version 8.x or higher
- **Git**: For cloning the repository
- **Browser**: Chrome, Firefox, or any modern browser
- **Dataset**: A `data/dataset.csv` file (see [Dataset Requirements](#dataset-requirements))

## Project Structure
```
Z-ScoreUniFinder/
├── back-end/
│   ├── data/
│   │   └── dataset.csv          # Dataset for ML model
│   ├── ml_service.py            # ML model logic
│   ├── prediction_model.py      # Prediction and recommendation logic
│   ├── routes.py                # FastAPI routes
│   ├── schemas.py               # Pydantic models
│   ├── main.py                  # FastAPI app entry point
│   ├── run.py                   # Script to run FastAPI server
│   ├── evaluate_model.py        # Model evaluation script
│   └── requirements.txt         # Python dependencies
├── front-end/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.jsx         # Main page with form and results
│   │   │   └── globals.css      # Global styles
│   │   └── components/
│   │       ├── nav/NavBar.jsx   # Navigation bar
│   │       ├── dropdown/
│   │       │   ├── DropDown.jsx # Dropdown component
│   │       │   └── SearchableDropDown.jsx # Searchable dropdown
│   │       ├── table/Table.jsx  # Table for displaying recommendations
│   │       └── footer/Footer.jsx # Footer component
│   ├── public/                  # Static assets
│   ├── package.json             # Node.js dependencies
│   └── next.config.mjs          # Next.js configuration
└── README.md                    # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Z-ScoreUniFinder.git
cd Z-ScoreUniFinder
```

### 2. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   Example `requirements.txt`:
   ```
   fastapi==0.115.2
   uvicorn==0.32.0
   pandas==2.2.3
   scikit-learn==1.5.2
   pydantic==2.9.2
   ```
4. Ensure the dataset (`data/dataset.csv`) is in the `back-end/data/` directory (see [Dataset Requirements](#dataset-requirements)).

### 3. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   Key dependencies in `package.json`:
   ```json
   {
     "dependencies": {
       "next": "^14.2.15",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "formik": "^2.4.6",
       "yup": "^1.4.0",
       "axios": "^1.7.7",
       "react-hot-toast": "^2.4.1",
       "autoprefixer": "^10.4.20",
       "postcss": "^8.4.47",
       "tailwindcss": "^3.4.13"
     }
   }
   ```
3. (Optional) Upgrade Next.js to avoid outdated version warnings:
   ```bash
   npm install next@latest
   ```

### 4. Dataset Requirements
The backend requires a `data/dataset.csv` file in `back-end/data/` with the following columns:
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `District` | String | Student's district | "Colombo", "Kandy" |
| `Stream` | String | Academic stream | "Physical Science", "Commerce" |
| `Course` | String | University course | "Engineering", "Management" |
| `University` | String | University name | "University of Moratuwa" |
| `Z_Score` | Float | Student's Z-score | 2.5, 1.8 |
| `course_demand` | Float | Minimum required Z-score | 2.8, 2.2 |

Example `data/dataset.csv`:
```csv
District,Stream,Course,University,Z_Score,course_demand
Colombo,Physical Science,Engineering,University of Moratuwa,2.5,2.8
Colombo,Physical Science,Computer Science,University of Colombo,2.3,2.5
Colombo,Cross Stream,Management,University of Colombo,2.0,2.2
Kandy,Biological Science,Medicine,University of Peradeniya,2.7,2.9
```

Generate a sample dataset if needed:
```bash
python -c "import pandas as pd; data = [['Colombo', 'Physical Science', 'Engineering', 'University of Moratuwa', 2.5, 2.8], ['Colombo', 'Cross Stream', 'Management', 'University of Colombo', 2.0, 2.2]]; pd.DataFrame(data, columns=['District', 'Stream', 'Course', 'University', 'Z_Score', 'course_demand']).to_csv('back-end/data/dataset.csv', index=False)"
```

## Running the Project


### 1. Start the Backend
1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Run the FastAPI server:
   ```bash
   python run.py
   ```
   The server will run at `http://localhost:8000`.

### 2. Start the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd front-end
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:3000`.

### 3. Access the Application
- Open `http://localhost:3000` in a browser.
- Fill out the form with O/L results, A/L subjects, Common General Test score, and personal information (district, Z-Score, stream, exam year).
- Check the "Cross Stream" option to include cross-stream recommendations.
- Submit to view recommendations or a warning if the Common General Test score is ≤ 30.

## Usage Instructions
1. **Enter O/L Results**:
   - Select grades (A, B, C, S, F) for Mathematics, English, Science, Sinhala, and Tamil.
   - Mathematics, English, and Science are required.

2. **Enter A/L Results**:
   - Add subjects using the searchable dropdown (e.g., Physics, Chemistry).
   - Select grades for each subject.
   - Enter the Common General Test score (0–100). Scores ≤ 30 trigger a warning.

3. **Enter Personal Information**:
   - Provide District, Rank, Z-Score (-4 to 4), Stream, and Exam Year (2000–2025).

4. **View Recommendations**:
   - If Common General Test score > 30, submit to see:
     - **Stream-Specific Recommendations**: Courses matching your stream (e.g., Engineering for Physical Science).
     - **Cross-Stream Recommendations** (if enabled): Courses open to all streams (e.g., Management).
   - Each table includes Course, University, Predicted Score, and Demand (Z-Score).

5. **Print Results**:
   - Click "Print Results" to print the recommendation tables.

### Example Inputs and Outputs
- **Input** (Common General Test ≤ 30):
  - District: Colombo
  - Stream: Physical Science
  - Z-Score: 2.5
  - Common General Test: 30
  - **Output**: Warning: "⚠️ Your Common General Test score is too low! Please enter a score greater than 30."

- **Input** (Common General Test > 30, Cross Stream disabled):
  - District: Colombo
  - Stream: Physical Science
  - Z-Score: 2.5
  - Common General Test: 75
  - **Output**:
    ```
    Stream-Specific Recommendations
    Course                 | University             | Predicted Score | Demand (Z-Score)
    Engineering           | University of Moratuwa | 0.95            | 2.80
    Computer Science      | University of Colombo  | 0.92            | 2.50
    ```

- **Input** (Common General Test > 30, Cross Stream enabled):
  - District: Colombo
  - Stream: Physical Science
  - Z-Score: 2.5
  - Common General Test: 75
  - **Output**:
    ```
    Stream-Specific Recommendations
    Course                 | University             | Predicted Score | Demand (Z-Score)
    Engineering           | University of Moratuwa | 0.95            | 2.80
    Computer Science      | University of Colombo  | 0.92            | 2.50

    Cross Stream Recommendations
    Course                 | University             | Predicted Score | Demand (Z-Score)
    Management            | University of Colombo  | 0.90            | 2.20
    Law                   | University of Peradeniya | 0.88          | 2.10
    ```

---

<div align="center">

**Made with ❤️ for Sri Lankan students**

G.D.K.B.Gamaethige (22ug1-0498), K.A.S.I.Ranaweera (22ug1-0386), A.M.A.M.Muthukuda (22ug1-0162), R.M.S.D.Rathnayaka (22ug1-0805), R.M.P.Gunarathne (22ug1-0494), W.A.C.Kavindya (22ug1-0443), M.D.J.K.N.Shantha (22ug1-0704), M.R.N.T.Weerathunga (22ug1-0108), T.N.Akmeemana (22ug1-0391), J.A.S.S.Perera (22ug1-0447)

[⭐ Star this repo](https://github.com/<your-username>/Z-ScoreUniFinder) | [🍴 Fork it](https://github.com/<your-username>/Z-ScoreUniFinder/fork) | [📝 Report Issues](https://github.com/<your-username>/Z-ScoreUniFinder/issues)

</div>
