# 🚀 SuiTube Backend - Fully Decentralized Architecture

Backend API cho nền tảng video phi tập trung SuiTube, được xây dựng hoàn toàn trên Sui blockchain ecosystem.

## 🏗️ Kiến Trúc Phi Tập Trung

```
┌─────────────────────────────────────────────────┐
│         SUI BLOCKCHAIN (Source of Truth)        │
│  - Video metadata (title, owner, tips, etc)    │
│  - User profiles                                │
│  - Subscriptions, likes, views                  │
│  - All critical data on-chain                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│   SUIGRAPHQL (GraphQL API for Sui Blockchain)   │
│  - Query videos, users, events                  │
│  - Real-time data from blockchain               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│   WALRUS + SEAL (Decentralized Storage)         │
│  - Video files (.mp4, .webm)                   │
│  - Thumbnails, avatars                         │
│  - Access control với Seal                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│   NESTJS BACKEND (API Layer)                    │
│  - RESTful API endpoints                       │
│  - GraphQL queries to Sui                       │
│  - File upload handling                        │
│  - Rate limiting, security                     │
└─────────────────────────────────────────────────┘
```

## 📦 Technologies

- **NestJS** - Backend framework
- **SuiGraphQL** - GraphQL API cho Sui blockchain
- **Walrus** - Decentralized storage
- **Seal** - Access control & encryption
- **@mysten/sui** - Sui SDK
- **Redis** (optional) - Caching layer

> **Note**: Nautilus (off-chain computation) có thể được thêm vào sau khi cần video processing phức tạp

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` và cập nhật các giá trị:

```env
# Sui Blockchain
SUI_NETWORK=testnet
SUI_PACKAGE_ID=your_package_id
SUI_PLATFORM_ID=your_platform_id
SUI_GRAPHQL_URL=https://api.sui-testnet.walrus.space/graphql

# Walrus Storage
WALRUS_API_URL=https://api.walrus-testnet.walrus.space
WALRUS_API_KEY=your_walrus_api_key

# Nautilus (optional - disabled for now)
# NAUTILUS_API_URL=https://nautilus.sui.io
# NAUTILUS_ENABLED=false

# Application
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 3. Run Development Server

```bash
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3001`

### 4. API Documentation

Swagger UI: `http://localhost:3001/api/docs`

## 📁 Project Structure

```
src/
├── api/                    # API modules
│   └── videos/            # Video endpoints
│       ├── videos.controller.ts
│       ├── videos.service.ts
│       └── videos.module.ts
├── services/              # Core services
│   ├── blockchain/       # SuiGraphQL service
│   │   └── suigraphql.service.ts
│   └── storage/          # Walrus + Seal service
│       └── walrus-seal.service.ts
├── config/               # Configuration files
│   ├── app.config.ts
│   ├── sui.config.ts
│   ├── walrus.config.ts
│   └── nautilus.config.ts
├── common/               # Shared utilities
│   ├── guards/          # Auth guards
│   ├── decorators/      # Custom decorators
│   └── filters/         # Exception filters
└── main.ts              # Application entry point
```

## 🔌 API Endpoints

### Videos

- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `GET /api/videos/owner/:address` - Get videos by owner
- `POST /api/videos/upload` - Upload video
- `POST /api/videos/:id/view` - Track video view

## 🔧 Services

### SuiGraphQLService

Query data từ Sui blockchain:

```typescript
// Get all videos
const videos = await suigraphqlService.getAllVideos(50, 0);

// Get video by ID
const video = await suigraphqlService.getVideoById(videoId);

// Get user profile
const profile = await suigraphqlService.getUserProfile(walletAddress);
```

### WalrusSealService

Upload và quản lý files trên Walrus:

```typescript
// Upload video
const { cid, url } = await walrusService.uploadVideo(filePath, {
  title: 'My Video',
  owner: '0x...',
});

// Create access policy
const { policyId } = await walrusService.createAccessPolicy({
  cid,
  policy: {
    allowedAddresses: ['0x...'],
    expirationTime: Date.now() + 86400000, // 24 hours
  },
});
```

### Video Processing

Video processing (transcoding, thumbnails) có thể được xử lý bằng:
- **Client-side**: Sử dụng ffmpeg.js trong browser
- **External services**: AWS MediaConvert, Cloudflare Stream, etc.
- **Nautilus**: Có thể thêm vào sau khi cần off-chain computation với TEE

## 🔐 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Throttle requests
- **Validation** - Input validation với class-validator
- **Seal** - Access control cho encrypted content

## 📝 Notes

- **Không sử dụng database**: Tất cả data được lưu trên blockchain hoặc Walrus
- **Backend là indexer/cache layer**: Không phải source of truth
- **Real-time updates**: Sử dụng SuiGraphQL để subscribe events
- **Video processing**: Có thể xử lý client-side hoặc external services (Nautilus có thể thêm sau)

## 🚧 Next Steps

1. Implement WebSocket cho real-time updates
2. Add Redis caching layer
3. Implement authentication với wallet signatures
4. Add more API endpoints (users, comments, subscriptions)
5. Setup CI/CD pipeline

## 📚 Resources

- [Sui Documentation](https://docs.sui.io)
- [SuiGraphQL](https://docs.sui.io/build/suigraphql)
- [Walrus](https://docs.walrus.space)
- [Nautilus](https://docs.sui.io/concepts/cryptography/nautilus)
- [NestJS Documentation](https://docs.nestjs.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
