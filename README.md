# Movify 
## A place to find and journal your next favorite film.

Movify is a modern, full-stack web application built with the MERN stack, designed to be a personal movie journal and discovery platform. Inspired by services like Letterboxd, it allows users to search for movies, add them to a personal journal, write reviews, and get personalized recommendations.

The application is fully deployed and live, with the backend hosted on Render and the frontend on Vercel.

# ✨ Features
Personal Movie Journal: Users can search for any movie and add it to their personal, persistent collection.

Rich Movie Details: View detailed information for every movie, including synopsis, runtime, genres, and a high-resolution backdrop.

Write & View Reviews: Add your own rating and comments for any movie in your journal.

Smart Recommendations ("For You"): Get personalized movie suggestions based on your current mood and preferred genre.

Movie Discovery:

Trending: See a list of movies trending this week.

Upcoming: Browse movies that are coming soon to theaters.

Discover: A powerful tool to filter movies by genre, release year, and original language.

Personal Stats Page: An analytics dashboard that visualizes your movie-watching habits, including your favorite genres, ratings distribution, and total time spent watching.

Secure Authentication: A complete user system with both traditional email/password sign-up and a frictionless "Continue as Guest" option.

Responsive, Minimalist Design: A sleek dark/light mode theme that is fully responsive and looks great on any device, from mobile phones to desktops.

🛠 Tech Stack
Movify is built with the MERN stack and other modern web technologies.

Frontend:

React: A JavaScript library for building user interfaces.

React Router: For client-side routing and navigation.

Axios: For making API requests to the backend.

Bootstrap & Lucide React: For styling and icons.

Recharts: For creating the data visualization charts on the Stats page.

Backend:

Node.js: A JavaScript runtime for the server.

Express: A web application framework for Node.js.

MongoDB: A NoSQL database for storing movie and user data.

Mongoose: An ODM library for MongoDB and Node.js.

Services & APIs:

Firebase Authentication: For handling secure user sign-up, login, and guest sessions.

TMDB (The Movie Database) API: Used as the source for all movie data, including posters, details, and discovery features.

Render: For hosting the live backend server.

Vercel: For hosting the live frontend application.

🚀 Setup and Installation
To run this project locally, follow these steps:

Prerequisites:

Node.js installed

A MongoDB Atlas account

A TMDB API key

A Firebase project

1. Clone the Repository:

git clone https://github.com/yashwanthbooram/Movify.git
cd Movify

2. Backend Setup:

Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file in the backend folder and add your secret keys:

ATLAS_URI=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key

Start the backend server: npm start

The server will be running on http://localhost:5000.

3. Frontend Setup:

Open a new terminal and navigate to the frontend folder: cd frontend

Install dependencies: npm install

Open the frontend/src/firebase.js file and replace the placeholder firebaseConfig object with your own keys from the Firebase console.

Start the frontend development server: npm start

The application will open in your browser at http://localhost:3000.
