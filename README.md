
# CineArchive

**CineArchive** is a movie discovery and trending tracking web application. It allows users to search for movies in real-time using the TMDb API and view the most popular and trending titles. It features a modern, responsive UI built with React and Tailwind CSS, and uses Appwrite for backend services.

**Live Demo**: [https://cinearchive.vercel.app](https://cinearchive-movie-app.vercel.app/)

---

## Features

- **Search Movies**: Search for any movie using the TMDb API.
- **Trending Section**: Highlights movies trending among users.
- **Responsive UI**: Fully responsive, mobile-friendly layout.
- **Fast Debounced Search**: Reduces API calls while typing.
- **Loading Indicator**: Visual spinner during data fetching.
- **Back Button Support**: Reset view to show trending movies again.

---

## Technologies Used

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React-Use (for debounce)

### Backend / API
- [TMDb API](https://developer.themoviedb.org/) – For movie search and metadata.
- [Appwrite](https://appwrite.io) – For storing and retrieving trending data.

---

## Project Structure

```

cinearchive/
├── public/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx
│   │   ├── MovieCard.jsx
│   │   ├── Search.jsx
│   │   └── Spinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── MovieDetail.jsx
│   ├── appwrite/               # Appwrite configuration and services
│   ├── App.jsx
│   └── main.jsx
├── .env                        # Environment variables
├── vite.config.js
├── package.json
└── README.md

````

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- TMDb API Key
- Appwrite account and project with database & collection set up

### Environment Setup

Create a `.env` file in the root with the following keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_API_KEY=your_appwrite_api_key
````

### Running Locally

```bash
git clone https://github.com/Fazeenp/cinearchive.git
cd cinearchive
npm install
npm run dev
```

---

## Deployment

This project is deployed using **Vercel**:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com), import your repo.
3. Add the environment variables from `.env` in Vercel settings.
4. Deploy the app.



---

## Author

**Fazeen Patel**
Email: [fazeenpatel@example.com](mailto:fazeenpatel@gmail.com)
GitHub: [https://github.com/Fazeenp](https://github.com/Fazeenp)

