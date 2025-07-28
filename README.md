# AI-Based University Search (Z-Score)

A full-stack application using Next.js frontend and Node.js backend to help users search for universities based on z-score rankings.

## Table of Contents
- [Features](#features)
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [License](#license)

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
- Node.js (v16 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn
- Git

## Installation

### Frontend Setup
```bash
cd front-end
npm install
```

### Backend Setup
```bash
cd back-end
npm install
```

### Environment Configuration
1. Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_API_KEY=your-api-key
```

2. Backend (.env):
```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

## Running the Project

### Start Backend Server
```bash
cd back-end
npm run dev
```

### Start Frontend Development Server
```bash
cd front-end
npm run dev
```

## Project Structure
```
Z-ScoreUniFinder/
├── front-end/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   └── styles/        # CSS files
│   ├── public/            # Static assets
│   └── package.json
│
├── back-end/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── config/          # Configuration files
│   └── package.json
│
└── README.md
```

### API Endpoints
```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
GET    /api/universities    # Get university list
POST   /api/universities    # Add new university
GET    /api/search         # Search universities
POST   /api/calculate      # Calculate z-scores
```

### Z-Score Calculation
The backend implements z-score calculations using the formula:
```
Z = (X - μ) / σ
Where:
- X = Raw score
- μ = Population mean
- σ = Standard deviation
```

## Development

### Backend Development
```bash
cd back-end
npm run dev     # Start development server
npm run test    # Run tests
npm run lint    # Run linter
```

### Frontend Development
```bash
cd front-end
npm run dev     # Start development server
npm run build   # Create production build
npm run lint    # Run linter
```
