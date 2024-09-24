# Project Overview
 " CloudNotebook is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users take notes, create to-do lists, and store information in a seamless and user-friendly manner. The project uses Redux, Axios, and Context API for efficient state management and API communication."

## Features
- > Note Management: Create, update, delete, and organize notes.
- > To-Do List: Manage tasks with a simple to-do list feature.
- > User Authentication: Secure login and registration.
- > Persistent Storage: Notes are stored in the cloud, accessible from anywhere.
- > Responsive UI: Optimized for both desktop and mobile devices.

## Tech Stack
### Frontend

- > React.js: For building the user interface.
- > Redux: For managing global state across the application.
- > Axios: For making HTTP requests to the backend API.
- > Context API: For managing authentication and theme toggling.

### Backend

- > Node.js: Server-side runtime environment.
- > Express.js: Web framework for Node.js, handling routes and middleware.
- > MongoDB: Database for storing user data and notes.

## Usage

- > Sign up or log in to create your own personal notebook.
- > Add, edit, or delete notes and to-do items.
- > Your notes are saved to the cloud and can be accessed from any device.
- > Manage your notes easily using the search and filter functionalities.


## Project Structure

cloudnotebook/
│
├── backend/                   # Node.js backend code
│   ├── Middlewares/           # Middleware files (contains: FetchUser)
│   ├── models/                # MongoDB models
│   ├── routes/                # Express routes
│   ├── db.js                  # Database connection
│   └── index.js               # Main entry point of the backend
│
├── frontend/                  # React.js frontend code
│   ├── src/                   # Main source code
│   │   ├── components/        # React components
│   │   ├── pages/             # Application pages (Home, Login, Register)
│   │   ├── context/           # Context API for theme and authentication
│   │   └── App.js             # Main app file
│   └── public/                # Static files (index.html, CSS, images)
│
└── README.md                  # Project documentation
