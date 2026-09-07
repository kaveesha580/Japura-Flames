# Japura Flames Media Grid

A media showcase website for the Japura Flames media unit a place to display projects, keep the crew organized, and handle client bookings. Built with a React frontend and an Express + MongoDB API.

## Features

- **Media grid** : browse photography, videography and broadcasting work
- **Project showcase** : latest projects with live status updates
- **Bookings** : clients can request media coverage for their events
- **Crew directory** : members, roles and units
- **Admin dashboard** : manage projects, bookings, crew and users in one place
- **Accounts** : register and sign in as a personal or organizer account

## Tech stack

| Layer      | Tech                                             |
|------------|--------------------------------------------------|
| Frontend   | React 19, Vite, React Router, Swiper, React Icons|
| Backend    | Node.js, Express                                 |
| Database   | MongoDB (Mongoose)                               |
| Auth       | JWT + bcrypt                                     |

## Dependencies

### Frontend

- `react` and `react-dom` : build the user interface
- `react-router-dom` : client-side routing
- `react-icons` : interface icons
- `swiper` : sliders and carousels
- `vite` : development server and production builds
- `oxlint` : code linting

### Backend

- `express` : API server
- `mongoose` : MongoDB object modeling
- `cors` : cross-origin API access
- `dotenv` : environment variable loading
- `jsonwebtoken` : authentication tokens
- `bcryptjs` : password hashing
- `nodemon` : automatic server restarts during development

## Structure

```
Japura-Flames-media-grid/
├── Frontend/   # React + Vite app (Home, Admin, Booking, Login, Registration)
└── Backend/    # Express API (routes, models, server.js)
```

## Running locally

Both folders have their own package.json, so run them in two terminals.

### 1. Backend (port 5000)

```bash
cd Backend
npm install
npm run dev
```

Create `Backend/.env` based on `Backend/.env.example`:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/Flames
JWT_SECRET=something_long_and_secret
ADMIN_PASSWORD=your_admin_password
```

`ADMIN_PASSWORD` is what logs you into the admin dashboard.

### 2. Frontend (port 5173)

```bash
cd Frontend
npm install
npm run dev
```

By default the app calls the API at `http://localhost:5000`. To change that, create `Frontend/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

You'll need Node.js and a running MongoDB instance.

## Scripts

**Backend**
- `npm run dev` : start the server with auto-restart (nodemon)
- `npm start` : start the server normally

**Frontend**
- `npm run dev` : start the Vite dev server
- `npm run build` : build for production
- `npm run lint` : run oxlint
- `npm run preview` : preview the production build