# SuiTube

SuiTube is a decentralized video platform built on the Sui blockchain, enabling users to upload, watch, tip, and earn rewards for videos. The project features a modern React frontend, direct integration with Move smart contracts on Sui, and decentralized video storage via walrus (Tusky).

---

## Table of Contents

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Setup & Development](#setup--development)
- [Component Details](#component-details)
  - [Frontend (client)](#frontend-client)
  - [Smart Contract (VideoPlatform)](#smart-contract-videoplatform)
- [Blockchain & Storage Integration](#blockchain--storage-integration)
- [Data Schema](#data-schema)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

- **Video Upload**: Instantly upload videos to walrus and store metadata on the Sui blockchain.
- **Watch & Tip**: Users can tip creators with SUI tokens and claim rewards for watching videos.
- **Modern Home Page**: Beautiful, responsive UI with filters, featured videos, shorts, and creator spotlights.
- **Creator Dashboard**: Manage videos, view analytics (views, earnings), upload new content.
- **Sui Wallet Integration**: Connect and send blockchain transactions directly from the frontend.
- **Move Smart Contract**: Transparent, on-chain management of videos, tips, and rewards.

---

## Project Structure

```
├── client/              # Frontend React (Vite)
│   ├── src/
│   │   ├── pages/       # Main pages: home, shorts, creator-dashboard
│   │   ├── components/  # UI components: video-card, upload-section, ...
│   │   ├── lib/         # WalletAdapter, mock-data, utils
│   │   └── index.css
│   └── index.html
├── VideoPlatform/       # Move smart contract for Sui
│   ├── sources/         # videoplatform.move
│   ├── tests/           # Move tests
│   ├── Move.toml
│   └── README.md
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md            # (You are here)
```

---

## Setup & Development

### 1. Install dependencies

```bash
bun install
# or
npm install
```

### 2. Run the frontend

```bash
cd client
bun run dev
# or
npm run dev
# Visit: http://localhost:5173
```

### 3. Build & deploy the Move smart contract

```bash
cd VideoPlatform
sui move build
sui client publish --gas-budget 100000000
# Save the packageId and objectId for frontend configuration
```

### 4. Environment configuration (if needed)

Create a `.env` file in `client/` with:
```
VITE_SUI_PACKAGE_ID=0x...         # packageId after deployment
VITE_VIDEO_LIST_ID=0x...          # objectId of VideoList
```

---

## Component Details

### Frontend (client)

- **Home Page**: Displays videos, shorts, filters, creator spotlights, and upload section.
- **Shorts**: Watch short videos, navigate with arrow keys, tip, follow creators.
- **Creator Dashboard**: View analytics (views, earnings, subscribers), upload new videos, manage content.
- **Upload Section**: Upload form for video title, description, file, type (short/long), uploads to walrus, sends add_video transaction to Sui.
- **Sui Wallet Integration**: Connect wallet, send add_video, tip, claim_reward transactions via `@mysten/dapp-kit`.

### Smart Contract (VideoPlatform)

- **Structs**:
  - `VideoList`: List of videos, id_counter, vector<Video>
  - `Video`: id, title, desc, cid, owner, is_short, tips, rewarded
- **Main Functions**:
  - `init_video_list`: Initialize the VideoList object
  - `add_video`: Add a new video
  - `tip`: Tip SUI to the creator
  - `claim_reward`: Reward viewers (each viewer can claim once per video)
  - `video_count`, `get_video`: Data retrieval for frontend

---

## Blockchain & Storage Integration

- **Video Storage**: Upload files to walrus (IPFS/Tusky), receive a CID/hash, store the CID on-chain.
- **Blockchain Transactions**: Send add_video, tip, claim_reward transactions via Sui wallet (dapp-kit).
- **Data Retrieval**: Frontend calls smart contract functions to fetch video lists, video info, tips, and rewards.

---

## Data Schema

### Video

```ts
{
  id: number,
  title: string,
  description: string,
  thumbnailUrl: string,
  videoUrl: string,
  duration: number,
  views: number,
  likes: number,
  suiRewards: number,
  isShort: boolean,
  creatorId: number,
  walrusHash: string,
  isVerified: boolean,
  createdAt: Date,
}
```

### User

```ts
{
  id: number,
  username: string,
  walletAddress: string,
  suiBalance: number,
  avatar: string,
  isVerified: boolean,
  subscribers: number,
  createdAt: Date,
}
```

---

## Tech Stack

- **Frontend**: React, Vite, TypeScript, TailwindCSS, Radix UI, React Query, Framer Motion, Wouter
- **Blockchain**: Sui, Move, @mysten/dapp-kit
- **Storage**: walrus (IPFS/Tusky)
- **Other**: WebSocket, Zod, clsx, lucide-react, recharts

---

## Contributing

- Fork the repository, create a new branch, and submit a PR to `main`.
- All contributions (code, ideas, bug reports) are welcome!

---

## License

MIT 