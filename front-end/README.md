# AI-Based University Search (Z-Score)

A Next.js and Tailwind CSS web application with a dark theme, designed to help users search for universities based on z-score rankings. The application leverages AI to process and rank universities using z-scores, derived from criteria such as academic performance, research output, or user preferences. It features a responsive navbar and a form dropdown for user inputs.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [License](#license)

## Features
- **AI-Powered Search**: Ranks universities using z-scores calculated from user-selected criteria (e.g., academic scores, research output).
- **Dark Theme UI**: Built with Tailwind CSS for a sleek, modern, and accessible interface.
- **Responsive Navbar**: Includes navigation for Home, About, Search, and Contact, with mobile-friendly toggle.
- **Form Dropdown**: Allows users to select search criteria or filters for university rankings.
- **Next.js**: Utilizes server-side rendering and static site generation for performance.
- **Tailwind CSS**: Utility-first CSS framework for customizable and responsive styling.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- (Optional) API key for AI-based data processing (e.g., university data or ranking algorithms)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kbimsara/Z-ScoreUniFinder.git
   cd Z-ScoreUniFinder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Set up Tailwind CSS (already configured):
   - Ensure `tailwind.config.js` and `styles/global.css` are present.
   - Verify Tailwind directives in `global.css`:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
4. (Optional) Configure AI API:
   - Add your AI service API key to a `.env.local` file:
     ```env
     NEXT_PUBLIC_AI_API_KEY=your-api-key
     ```
   - Update API integration in the codebase as needed.

## Running the Project
1. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure
```
Z-ScoreUniFinder/
├── components/
│   ├── Navbar.jsx       # Responsive navigation bar
│   ├── Dropdown.jsx # Dropdown for selecting search criteria
│   ├── Table.jsx 
├── app/
│   ├── page.jsx         # Home page
│   ├── global.css       # Tailwind CSS and global styles
|
├── public/              # Static assets (e.g., university logos)
├── tailwind.config.js   # Tailwind configuration
├── .env.local           # Environment variables (e.g., API keys)
├── package.json
├── README.md
```

### Z-Score Explanation
The application uses z-scores to standardize and rank universities based on user-selected criteria. A z-score measures how many standard deviations a university's score is from the mean for a given metric (e.g., research output). The AI processes data to compute z-scores and present ranked results.

### Example
- Select "Academic Score" in the dropdown.
- The AI fetches university data, calculates z-scores, and ranks institutions.
- Results are displayed in a responsive, dark-themed table or list.


Please ensure code follows the project's ESLint and Prettier configurations.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
