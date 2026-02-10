## 1. Project overview

This repository contains a fully working **dummy movie ticket booking system** implemented as a modern web application.

- **Frontend**: React + Vite + Tailwind CSS (v4) with React Router and Context for state.
- **Backend**: Node.js + Express with in-memory data and simple seat-booking logic.
- **Persistence**: No database – demo bookings are stored in-memory on the server and in `localStorage` in the browser.

The system walks a user through a realistic booking flow:

1. Browse movies from multiple mocked “APIs”.
2. View movie details.
3. Select city, theater and showtime.
4. Pick seats on a seat map (rows A–E, seats 1–10).
5. Confirm and see a booking summary screen.

The goal is to demonstrate **clean architecture**, **modern UI/UX**, and **clear documentation** suitable for a technical interview.

---

## 2. Tech stack explanation

- **React + Vite**
  - React powers the SPA (single-page application) with components, hooks and context.
  - Vite provides a fast dev server and optimized production builds.
- **Tailwind CSS (v4)**
  - Utility-first styling for rapid, consistent design.
  - Uses the new v4 CSS-first setup with `@import "tailwindcss"` and the Vite plugin `@tailwindcss/vite`.
- **React Router**
  - Client-side routing for the required pages:
    - `/` → movie list (home)
    - `/movie/:id` → movie details
    - `/booking` → seat selection & booking
    - `/summary` → booking confirmation
- **React Context + Hooks**
  - `BookingContext` stores the current booking flow (movie, city, theater, showtime, seats, last booking).
  - Hooks like `useState`, `useEffect`, and `useMemo` are used for managing UI and derived data.
- **Express (Node.js)**
  - Serves a minimal JSON API:
    - `GET /movies`
    - `GET /theaters`
    - `POST /book-seat`
  - Uses pure in-memory data; no database.
- **localStorage**
  - Client-side persistence of booked seats per show, so refreshing the browser preserves previously booked seats.

---

## 3. System architecture (diagram in text)

Text-based architecture diagram:

```text
[Browser]
  └─ React SPA (Vite + Tailwind)
     ├─ Pages
     │   ├─ HomePage ("/")
     │   ├─ MovieDetailsPage ("/movie/:id")
     │   ├─ BookingPage ("/booking")
     │   └─ SummaryPage ("/summary")
     ├─ State
     │   └─ BookingContext
     ├─ Components
     │   ├─ Layout / BookingProgress
     │   ├─ MovieCard
     │   ├─ SeatGrid
     │   ├─ SelectField / InfoChip
     │   └─ LoadingState / ErrorState
     ├─ API client
     │   └─ fetchMovies / fetchTheaters / bookSeats → "/api/*"
     └─ Storage
         └─ localStorage ("movie-ticket-bookings")

Vite Dev Server
  └─ Proxies "/api/*" → "http://localhost:4000"

[Express Backend] (port 4000)
  ├─ GET /movies
  │    └─ src/movies.js
  │         ├─ tmdbLikeMovies[]
  │         ├─ publicJsonApiMovies[]
  │         └─ extraStaticMovies[]
  │         → getNormalizedMovies()
  ├─ GET /theaters
  │    └─ src/theaters.js
  │         └─ getTheaters()
  └─ POST /book-seat
       └─ src/store.js
            └─ createBookingStore().bookSeats()
```

Key flows:

- **Movie data**: Frontend calls `/api/movies` → Vite proxy → Express `/movies` → in-memory “API” sources → normalized movie list.
- **Theater data**: Frontend calls `/api/theaters` → Express `/theaters` → static city/theater/showtime data.
- **Seat booking**: Frontend calls `/api/book-seat` with a payload → Express `/book-seat` checks availability in memory and confirms or rejects → frontend persists confirmed seats in `localStorage`.

---

## 4. Folder structure explanation

Project root (this repo):

```text
Movie_ticketBooking/
├─ client/        # React + Vite + Tailwind frontend
└─ server/        # Express backend API (Node.js)
```

### 4.1 Frontend (`client/`)

```text
client/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ App.css
   ├─ api/
   │  └─ client.js
   ├─ components/
   │  ├─ Layout.jsx
   │  ├─ Progress.jsx
   │  ├─ MovieCard.jsx
   │  ├─ SeatGrid.jsx
   │  ├─ Selectors.jsx
   │  └─ Feedback.jsx
   ├─ pages/
   │  ├─ HomePage.jsx
   │  ├─ MovieDetailsPage.jsx
   │  ├─ BookingPage.jsx
   │  └─ SummaryPage.jsx
   ├─ state/
   │  └─ BookingContext.jsx
   └─ utils/
      └─ storage.js
```

- `index.html` – Root HTML shell Vite uses; bootstraps `src/main.jsx`.
- `vite.config.js` – Vite configuration:
  - React plugin (`@vitejs/plugin-react`).
  - Tailwind plugin (`@tailwindcss/vite`).
  - Dev-server proxy to the Express backend on `/api/*`.
- `src/main.jsx` – React entry point:
  - Wraps `App` with `BrowserRouter` and `BookingProvider`.
- `src/App.jsx` – Declares the React Router routes and uses `Layout`.
- `src/index.css` – Imports Tailwind and applies a dark theme base.
- `src/App.css` – Left intentionally minimal; Tailwind handles main styling.

Feature-based organization:

- `api/` – API wrapper functions used across pages.
- `components/` – Reusable components (layout, cards, seat grid, selectors, feedback).
- `pages/` – Route-level screens.
- `state/` – Cross-cutting app state via React Context.
- `utils/` – Small utility helpers (e.g., `localStorage` handling).

### 4.2 Backend (`server/`)

```text
server/
├─ package.json
└─ src/
   ├─ index.js
   ├─ movies.js
   ├─ theaters.js
   └─ store.js
```

- `package.json`
  - `type: "module"` for ES module syntax.
  - Scripts:
    - `"dev": "nodemon src/index.js"`
    - `"start": "node src/index.js"`
  - Dependencies: `express`, `cors`, `nodemon`.

- `src/index.js`
  - Express app definition and route bindings.

- `src/movies.js`
  - Contains and normalizes data from multiple dummy movie “APIs”.

- `src/theaters.js`
  - Exposes static city/theater/showtime data.

- `src/store.js`
  - In-memory booking store to simulate server-side seat state.

---

## 5. Frontend explanation (pages & components)

### 5.1 Pages

#### `/` → `HomePage.jsx`

- Fetches movie data via `fetchMovies()` when mounted.
- Shows:
  - A page header with description.
  - A responsive grid of `MovieCard` components.
- UI details:
  - Loading state: centered spinner + message.
  - Error state: error banner with retry.

#### `/movie/:id` → `MovieDetailsPage.jsx`

- Reads the `id` parameter from the URL.
- Uses:
  - `BookingContext` to read `selectedMovie`.
  - `fetchMovies()` as a fallback if the movie isn’t in context.
- Renders:
  - Poster on the left.
  - Title, rating, duration, genres.
  - Movie synopsis.
- Actions:
  - “Book tickets” → sets the selected movie in context, resets the flow and navigates to `/booking`.
  - “Go back” → navigates one step back in history.

#### `/booking` → `BookingPage.jsx`

Core of the booking flow:

- Redirects back to `/` if no `selectedMovie` is present (guards deep links).
- On mount:
  - Calls `fetchTheaters()` to obtain cities, theaters, and showtimes.
- Allows the user to:
  1. Choose a **city**.
  2. Choose a **theater** (filtered by city).
  3. Choose a **showtime** (from the theater’s list).
  4. Pick one or more **seats** using `SeatGrid`.
- Derived state:
  - `bookingKey = movieId__city__theaterId__showtime`
  - Loads booked seats from `localStorage` when `bookingKey` changes.
  - Filters out seats from `selectedSeats` that are now booked to avoid conflicts.
- Booking:
  - Validates that movie, city, theater, showtime, and at least one seat are selected.
  - Calls `bookSeats()` (POST `/api/book-seat`).
  - On success:
    - Updates `localStorage` via `addBookedSeatsForKey`.
    - Stores details into `BookingContext.lastBooking`.
    - Clears `selectedSeats` and navigates to `/summary`.
- Additional UX:
  - “Auto-pick best seats” button selects a preferred pattern (center seats in row C) when available.
  - Side panel with a live booking summary.
  - Clear validation and disabled states on controls.

#### `/summary` → `SummaryPage.jsx`

- Reads `lastBooking` from `BookingContext`.
- If `lastBooking` does not exist (e.g., on manual navigation), redirects to `/`.
- Displays a concise summary:
  - Movie, city, theater, showtime, seats.
  - Informational panel explaining that this is a dummy/demo system.
- Actions:
  - “Book another show” → keeps the same movie but resets the rest and navigates back to `/booking`.
  - “Back to home” → navigates to `/`.

### 5.2 Key components

- `Layout.jsx`
  - Wraps all pages.
  - Contains:
    - App header with logo and current movie label.
    - `BookingProgress` indicator.
    - Main content container.
    - Footer.

- `Progress.jsx` (`BookingProgress`)
  - Step indicator for the booking flow:
    - Steps: Movie → Details → Seats → Summary.
    - Computes the active step from `location.pathname`.
    - Uses colors and connecting lines to show progression.

- `MovieCard.jsx`
  - Displays a single movie in the grid:
    - Poster with gradient overlay.
    - Rating, duration, and genres.
    - Short description.
    - “Details” and “Book now” actions.
  - “Book now” also seeds the `BookingContext` with the movie and navigates to the booking flow.

- `SeatGrid.jsx`
  - Renders a seat map with:
    - Rows: A–E.
    - Seats: 1–10 per row.
  - Seat states:
    - **Available**: neutral styling, clickable.
    - **Selected**: highlighted in green, with glow.
    - **Booked**: red and disabled.
  - Props:
    - `bookedSeats: string[]` – seats already booked for the show.
    - `selectedSeats: string[]` – seats currently selected by the user.
    - `onToggleSeat(seatId: string)` – callback for seat click.
    - `isDisabled: boolean` – disables interaction if show is incomplete.
  - UI extras:
    - Visual “Screen” indicator at the top.
    - Legend showing color coding.

- `Selectors.jsx`
  - `SelectField` – generic styled `<select>` with label and placeholder.
  - `InfoChip` – pill-shaped badges to show current movie/city/theater/showtime in the header.

- `Feedback.jsx`
  - `LoadingState` – full-page spinner used for loading movies and theaters.
  - `ErrorState` – standardized error display with optional retry button.

- `BookingContext.jsx`
  - Central store for booking state:
    - `selectedMovie`
    - `selectedCity`
    - `selectedTheater`
    - `selectedShowtime`
    - `selectedSeats`
    - `lastBooking`
  - Provides setters and a `resetBookingFlow()` helper.

- `storage.js`
  - Encapsulates `localStorage` usage:
    - `getBookedSeatsForKey(key)` → returns an array of seat IDs.
    - `addBookedSeatsForKey(key, seats)` → merges and saves seats for a key.

---

## 6. Backend explanation (all APIs)

The backend is a simple Express app with in-memory data and logic. It does not depend on any external services or databases at runtime.

### 6.1 `GET /`

- Health-check / metadata endpoint.
- Returns:

```json
{
  "status": "ok",
  "service": "movie-ticket-booking-api"
}
```

### 6.2 `GET /movies`

Implemented in `src/index.js` and `src/movies.js`.

- Responsible for:
  - Aggregating data from multiple **mocked APIs**:
    - `tmdbLikeMovies`: TMDB-shaped data (`id`, `title`, `poster_path`, etc.).
    - `publicJsonApiMovies`: generic public-movie-API shape (`movie_id`, `name`, etc.).
    - `extraStaticMovies`: already normalized examples.
  - Normalizing this data to a single shape:

```ts
type Movie = {
  id: string;
  title: string;
  poster: string;
  genre: string[];  // list of genres
  duration: number; // minutes
  rating: number;   // 0–10
  description: string;
}
```

- Normalization functions:
  - `normalizeFromTmdb(movie)`
  - `normalizeFromPublicJson(movie)`
  - `normalizeFromStatic(movie)`
- Returns:

```json
{
  "movies": [ /* normalized movies */ ]
}
```

This models the idea of pulling from multiple public APIs while remaining fully self-contained and not relying on real network calls or API keys.

### 6.3 `GET /theaters`

Implemented in `src/theaters.js`.

- Returns static data describing:
  - Multiple **cities** (e.g., Bengaluru, Mumbai, Delhi).
  - Multiple **theaters per city**.
  - Multiple **showtimes per theater** (morning, afternoon, evening, night).
- Example shape:

```ts
type Theater = {
  id: string;
  name: string;
  address: string;
  showtimes: string[];
};

type CityWithTheaters = {
  city: string;
  theaters: Theater[];
};
```

- Response:

```json
{
  "theaters": [
    {
      "city": "Bengaluru",
      "theaters": [
        {
          "id": "blr-pvr-orion",
          "name": "PVR Orion Mall",
          "address": "Brigade Gateway, Dr Rajkumar Rd, Bengaluru",
          "showtimes": ["10:00 AM", "1:30 PM", "4:30 PM", "7:30 PM", "10:30 PM"]
        }
      ]
    }
  ]
}
```

### 6.4 `POST /book-seat`

Implemented in `src/index.js` using `createBookingStore()` from `src/store.js`.

- Request body:

```json
{
  "movieId": "tmdb-1",
  "city": "Bengaluru",
  "theaterId": "blr-pvr-orion",
  "showtime": "7:30 PM",
  "seats": ["C5", "C6"]
}
```

- Validation:
  - All fields (`movieId`, `city`, `theaterId`, `showtime`, `seats`) must be present.
  - `seats` must be a non-empty array.
  - If validation fails, responds with `400 Bad Request`.

- Internals:
  - Constructs a **booking key**:

    ```text
    bookingKey = `${movieId}__${city}__${theaterId}__${showtime}`
    ```

  - Calls `bookingStore.bookSeats(bookingKey, seats)` which:
    - Lazily creates an entry for `bookingKey` if it doesn’t exist.
    - Checks for conflicts (already-booked seats).
    - Either:
      - Returns `{ success: false, conflictingSeats, bookedSeats }` – server responds with `409 Conflict`.
      - Returns `{ success: true, bookedSeats }` – server responds with `201 Created`.

- Success response:

```json
{
  "message": "Booking confirmed",
  "bookedSeats": ["C5", "C6"]
}
```

This endpoint simulates server-side validation and booking logic, which complements the client-side persistence in `localStorage`.

---

## 7. API integration logic

### 7.1 Frontend API client (`src/api/client.js`)

- `API_BASE = "/api"` – combined with Vite’s proxy to forward to Express.

Endpoints:

- `fetchMovies()`
  - `GET /api/movies`
  - Returns normalized movie array.

- `fetchTheaters()`
  - `GET /api/theaters`
  - Returns city+theater+showtime data.

- `bookSeats(payload)`
  - `POST /api/book-seat`
  - Returns booking confirmation JSON or error (thrown as `Error`).

Every call:

- Uses a shared helper `handleResponse(response)` that:
  - Throws a JS error with message from the response JSON when `!response.ok`.
  - On success, returns `response.json()`.

### 7.2 Vite proxy configuration

In `client/vite.config.js`:

- Configures:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

- Frontend code calls `/api/movies`, `/api/theaters`, `/api/book-seat`.
- At dev time, these are proxied to `http://localhost:4000/movies` etc., which:
  - Keeps browser CORS simple (no manual headers needed from the client).
  - Keeps backend URLs environment-agnostic.

---

## 8. Seat booking logic explanation

The booking logic is split between **server** and **client** to simulate a more realistic system while remaining fully in-memory and local.

### 8.1 Seat model

- Rows: `A, B, C, D, E`.
- Seats per row: `1–10`.
- Seat ID format: `<Row><Number>` (e.g., `C7`).
- Implemented in `SeatGrid`:
  - Utility: `buildSeatId(row, number)`.

Seat states:

1. **Available**
   - Not present in `bookedSeats` and not in `selectedSeats`.
   - Rendered with neutral colors.
2. **Selected**
   - Present in `selectedSeats` but not in `bookedSeats`.
   - Rendered highlighted (green) with glow, clickable to deselect.
3. **Booked**
   - Present in `bookedSeats`.
   - Rendered with a red style and `disabled` attribute so it cannot be selected.

### 8.2 Server-side store (`src/store.js`)

- Uses a `Map<string, Set<string>>`:
  - Keys: booking keys of the form `movieId__city__theaterId__showtime`.
  - Values: set of seat IDs already booked for that show.

Algorithm for `bookSeats(bookingKey, seats)`:

1. If the key is new, initialize it with an empty `Set`.
2. Compute `conflictingSeats = seats.filter(seat => bookedSet.has(seat))`.
3. If `conflictingSeats` is non-empty:
   - Do **not** modify the store.
   - Return `{ success: false, conflictingSeats, bookedSeats: Array.from(bookedSet) }`.
4. Otherwise:
   - Add each seat to the `Set`.
   - Return `{ success: true, bookedSeats: Array.from(bookedSet) }`.

This simulates the idea of atomic server-side seat allocation with conflict detection.

### 8.3 Client-side persistence (`src/utils/storage.js`)

- Uses `localStorage` under a single key: `"movie-ticket-bookings"`.
- Data structure:

```ts
type BookingStorage = {
  [bookingKey: string]: string[]; // seat IDs
};
```

Functions:

- `getBookedSeatsForKey(key)`
  - Parses the JSON map from `localStorage`.
  - Returns `map[key]` (an array of seats) or `[]`.

- `addBookedSeatsForKey(key, seats)`
  - Reads current data with `getAllBookings()`.
  - Merges new seats into the existing set for that `key`.
  - Writes back the whole map via `saveAllBookings(all)`.
  - Returns the merged array.

### 8.4 Putting it together in `BookingPage.jsx`

1. **Deriving the booking key**

   ```js
   const bookingKey =
     selectedMovie && selectedCity && selectedTheater && selectedShowtime
       ? `${selectedMovie.id}__${selectedCity}__${selectedTheater.id}__${selectedShowtime}`
       : null
   ```

2. **Loading existing bookings (local)**:
   - On `bookingKey` change:
     - Call `getBookedSeatsForKey(bookingKey)` to get `bookedSeats`.
     - Remove any of these from `selectedSeats` to maintain consistency.

3. **Seat selection:**
   - Disabled unless a full show (movie, city, theater, showtime) is chosen.
   - Clicking a seat:
     - Ignores clicks on booked seats.
     - Toggles membership in `selectedSeats`.

4. **Submitting a booking:**
   - Valid only when all fields are selected and `selectedSeats.length > 0`.
   - Payload is sent to `POST /api/book-seat`.
   - On success:
     - `addBookedSeatsForKey(bookingKey, selectedSeats)` persists them in `localStorage`.
     - `lastBooking` in context is updated for summary.

5. **Booked seats remaining unselectable:**
   - Each render:
     - `SeatGrid` receives `bookedSeats` and `selectedSeats`.
     - Any seat in `bookedSeats` is rendered as disabled and red.
   - Even if the browser is refreshed:
     - `localStorage` still has the stored seats.
     - `getBookedSeatsForKey` repopulates `bookedSeats`.

---

## 9. How to run the project (step-by-step)

### 9.1 Prerequisites

- **Node.js** (LTS version recommended, e.g., 18+).
- **npm** (comes with Node).

All commands below are run from the **`Movie_ticketBooking/`** root unless stated otherwise.

### 9.2 Install dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

You already have `package-lock.json` files, so the exact dependency versions used in development are captured.

### 9.3 Run the backend (Express API)

From `Movie_ticketBooking/server`:

```bash
npm run dev
```

- Starts the Express server with `nodemon` on `http://localhost:4000`.
- Endpoints:
  - `GET /` – health check.
  - `GET /movies`
  - `GET /theaters`
  - `POST /book-seat`

### 9.4 Run the frontend (React + Vite)

In a separate terminal, from `Movie_ticketBooking/client`:

```bash
npm run dev
```

- Starts the Vite dev server (by default on `http://localhost:5173`).
- A dev proxy at `/api/*` forwards to `http://localhost:4000/*`, so:
  - `/api/movies` → backend `/movies`.
  - `/api/theaters` → backend `/theaters`.
  - `/api/book-seat` → backend `/book-seat`.

### 9.5 Use the app

1. Open `http://localhost:5173` in your browser.
2. Pick a movie from the home page.
3. Optionally read more info on the details page.
4. Proceed to `/booking`:
   - Choose city, theater and showtime.
   - Pick seats on the seat map.
   - Confirm booking.
5. On `/summary`, verify booking data.
6. Refresh the page and revisit the same show to see that booked seats remain unavailable thanks to `localStorage`.

### 9.6 Production build (optional)

To create an optimized frontend build:

```bash
cd client
npm run build
```

You can preview this build with:

```bash
npm run preview
```

The backend is already a simple Node.js script and can be started with:

```bash
cd server
npm start
```

---

## 10. Future improvements

Potential enhancements for a more production-like system:

1. **Real external APIs**
   - Integrate TMDB or other public APIs with real HTTP requests and API key configuration.
   - Implement caching and fallbacks in the backend.

2. **Database-backed persistence**
   - Store movies, theaters and bookings in a database (e.g., PostgreSQL or MongoDB).
   - Implement proper seat-locking and transaction semantics for concurrent bookings.

3. **Authentication and user accounts**
   - Add user registration and login.
   - Associate bookings with user profiles.
   - Implement a “My Bookings” history page.

4. **Payment and pricing**
   - Introduce ticket pricing per category (e.g., Standard, Premium).
   - Simulate or integrate with a payment gateway.

5. **Improved seat layout**
   - Add premium rows, wheelchair spaces, and aisle markings.
   - Allow variable screen layouts per theater.

6. **Accessibility & internationalization**
   - Add ARIA labels and keyboard navigation for seats.
   - Provide language switching and localized date/time formats.

7. **Testing**
   - Unit tests for seat booking logic (client + server).
   - Integration tests for key flows (e.g., Cypress).

8. **Deployment**
   - Create Dockerfiles for both client and server.
   - Configure CI/CD to run tests and deploy to a cloud environment.

This implementation deliberately keeps the stack **simple and interview-friendly** while leaving clear room for architectural discussion and future extension.

