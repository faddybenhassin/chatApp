# chatApp

Full-stack chat application (React + Vite frontend, Node/Express backend, MongoDB auth and messaging). Built for learning and fast prototyping.

## 🚀 Features

- User registration / login (JWT)
- Protected API routes for messages and users
- Realtime send/receive with Socket.IO (if configured)
- Message CRUD support & user lookup
- Frontend auth context and protected app pages

## 🗂️ Repository structure

- `backend/`
  - `package.json`, `server.js`
  - `config/` (DB, keys)
  - `controllers/` (auth, message, user logic)
  - `middleware/` (JWT verify)
  - `models/` (Mongoose `User`, `Message`)
  - `routes/` (`/api/auth`, `/api/users`, `/api/messages`)

- `frontend/`
  - `index.html`, `package.json`, `vite.config.js`
  - `src/main.jsx`
  - `src/components/` (`header`, `sidebar`, `messages`)
  - `src/pages/` (login, register, app)
  - `src/util/` (`authContext`, `authProvider`, `services`, `socket`)

## 🛠️ Prerequisites

- Node.js 18+ (or latest LTS)
- npm or yarn
- MongoDB (cloud Atlas or local)

## ⚙️ Backend setup

1. `cd backend`
2. `npm install`
3. Create `.env` (or use `config/keys.js`):
   - `MONGO_URI=<your-mongo-connection-string>`
   - `JWT_SECRET=<your-secret>`
   - `PORT=5000` (optional)
4. `npm run dev` (or `node server.js`)

### Backend quick script (example)

```bash
cd backend
npm install
export MONGO_URI="mongodb://localhost:27017/chatApp"
export JWT_SECRET="replace-with-secret"
npm run dev
```

## ⚙️ Frontend setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:5173` (default Vite URL)

## 🔗 How to use

- Register new user
- Login
- Access `/app` (protected)
- Send/receive messages
- Logout

## 🧪 Testing

No tests are included by default.

- Add Jest / Vitest for frontend and backend if desired.

## 🧩 Notes

- Ensure backend runs on the correct CORS origin or adjust in server settings.
- If using Socket.IO, check `frontend/src/util/socket.jsx` and backend socket initializer.

## 📦 Deployment

- Build frontend: `npm run build` in `frontend`
- Serve static frontend from CDN or Node static server
- Backend: deploy to Heroku, Render, Vercel (serverless with express) with env vars.

## 🧰 Future improvements

- Add message ack status + typing indicators
- Add group chat and file attachments
- Add user presence (online / offline)
- Add tests (e2e, unit, integration)

## 🪪 License

MIT
