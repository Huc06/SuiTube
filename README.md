# My First Sui Dapp

**My First Sui Dapp** is a fullstack web application that allows users to share and watch videos, earn SUI rewards, comment, tip creators, and connect their Sui wallet. The project uses React (Vite), Express, Drizzle ORM with PostgreSQL, and integrates the Sui blockchain via `@mysten/dapp-kit`.

---

## Main Features

- Upload and watch videos, shorts (short videos)
- User system, authentication, Sui wallet integration
- Commenting and tipping (rewarding) for videos/creators
- Creator dashboard for managing videos and earnings
- Sui blockchain integration: wallet connection, rewards, tipping
- RESTful API for videos, users, comments, tips

---

## Project Structure

```
.
├── client/         # Frontend React (Vite, TailwindCSS, wouter)
│   └── src/
├── server/         # Backend Express, API, logic
├── shared/         # ORM schema, shared types
├── drizzle.config.ts # Drizzle ORM configuration
├── package.json    # Dependency and script management
└── .start          # Startup configuration (Replit/Nix)
```

---

## Installation

### Requirements

- Node.js >= 20
- PostgreSQL >= 16
- (Recommended) Bun or npm

### Database Configuration

Create a `.env` file in the project root with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Install dependencies

```bash
npm install
```

### Initialize database (migration)

```bash
npm run db:push
```

---

## Running the Application

### Development

```bash
npm run dev
```

- Both server and client will run on port 5000 (http://localhost:5000)

### Production

```bash
npm run build
npm run start
```

---

## Main APIs

- `GET /api/videos` — Get list of videos
- `GET /api/videos/:id` — Get video details
- `POST /api/videos` — Create a new video
- `GET /api/shorts` — Get list of shorts
- `GET /api/users` — Get list of users
- `POST /api/users` — Create a new user
- `GET /api/videos/:id/comments` — Get comments for a video
- `POST /api/comments` — Add a comment
- `POST /api/tips` — Tip a video/creator
- `POST /api/wallet/connect` — Connect Sui wallet (mock)

---

## Technologies Used

- **Frontend:** React, Vite, TailwindCSS, wouter, @mysten/dapp-kit
- **Backend:** Express, Drizzle ORM, PostgreSQL
- **Blockchain:** Sui (testnet/mainnet/devnet)
- **ORM:** drizzle-orm, drizzle-zod
- **Others:** Passport, React Query, Radix UI, WebSocket

---

## Development & Contribution

- Fork and clone the repo
- Create a new branch for your feature/bugfix
- Submit a pull request with a clear description

---

## License

MIT 