# NetYaFelix

A Netflix-inspired streaming UI clone built with **React**, **Tailwind CSS**, and **Vite**, powered by the [TMDB API](https://www.themoviedb.org/).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=fff)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![TMDB](https://img.shields.io/badge/Data-TMDB-01D47F?logo=themoviedatabase&logoColor=fff)](https://www.themoviedb.org/)

- [NetYaFelix](#netyafelix)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Production Build](#production-build)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Design Decisions](#design-decisions)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Features

- **Dynamic Hero Banner** — randomly showcases a Netflix Original with backdrop, overview, and trailer playback
- **Genre Rows** — horizontally scrollable carousels for Trending, Top Rated, Action, Comedy, Horror, Romance, and Documentaries
- **Movie Cards** — hover-reveal cards showing rating, release year, and quick-action buttons
- **Full-Text Search** — search across movies and TV shows by title, person, or genre
- **Detail Pages** — rich detail view with poster, metadata, genre tags, cast photos, and "More Like This" recommendations
- **YouTube Trailer Player** — inline modal with autoplay for official trailers fetched from TMDB
- **Responsive Design** — adapts from mobile to desktop with fluid typography and layout breakpoints
- **Smooth Interactions** — scroll-snap carousels with hover-reveal arrow navigation, navbar transparency on scroll, animated search bar expansion

## Tech Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| Framework  | React 19               |
| Build Tool | Vite 5                 |
| Styling    | Tailwind CSS 4         |
| Routing    | React Router DOM v7    |
| Data       | TMDB API v3            |
| Video      | YouTube Embed (iframe) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/felabs1/NetYaFelix.git
cd NetYaFelix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Open .env and paste your TMDB API key
# Get your free key from https://www.themoviedb.org/settings/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Top navigation, search bar, profile dropdown
│   ├── HeroBanner.jsx   # Featured movie backdrop with trailer support
│   ├── MovieRow.jsx     # Scrollable genre/carousel row
│   └── MovieCard.jsx    # Individual poster card with hover overlay
├── pages/
│   ├── HomePage.jsx     # Landing page — hero + all genre rows
│   ├── Search.jsx       # Search results grid
│   └── MovieDetail.jsx  # Full detail view with cast, trailer, similar
├── services/
│   └── tmdb.js          # TMDB API client, URL helpers, image resolver
├── hooks/
│   └── useFetch.js      # Reusable data-fetching hook
├── App.jsx              # Route definitions
├── main.jsx             # Entry point
└── index.css            # Tailwind config + custom styles
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your TMDB API key:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

All API requests are routed through `src/services/tmdb.js`, which reads the key from `import.meta.env.VITE_TMDB_API_KEY`.

The app calls these TMDB endpoints:

- `GET /discover/tv` — Netflix Originals
- `GET /trending/all/week` — Trending content
- `GET /movie/top_rated` — Top-rated movies
- `GET /discover/movie?with_genres=X` — Genre-filtered movie lists
- `GET /search/multi` — Multi-field search
- `GET /{movie|tv}/{id}?append_to_response=videos,credits,similar` — Detail pages

## Design Decisions

- **No CSS framework beyond Tailwind** — keeps the bundle lean and the design system consistent
- **Custom `useFetch` hook** — centralizes loading/error/data state for every API call
- **Lazy-loaded images** — `loading="lazy"` on all poster cards to keep initial paint fast
- **Graceful degradation** — skeleton loaders, fallback placeholders for missing images, and "No Trailer" buttons when no YouTube video exists

## License

MIT — feel free to fork, modify, and use in your portfolio.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the API and data
- Inspired by the Netflix UI/UX design patterns
