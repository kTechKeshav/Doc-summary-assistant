# 📝 Doc Summary Assistant

A full-stack AI-powered document summarization app.  
Upload PDFs or images, get instant summaries using Gemini AI, and manage your summary history with a stunning Carbon Glass UI.

---

## 📦 Project Structure

```
Doc_summery-assistant/
│
├── backend/   # Express.js API for file upload, text extraction, and Gemini AI summarization
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env
│   └── README.md
│
├── frontend/  # React + Vite web app with Carbon Glass UI and local history
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── README.md
│
└── README.md  # Main project readme
```

---

## ✨ Features

- **Upload PDF or Image**: Drag & drop or select files for instant summarization.
- **AI Summarization**: Uses Gemini AI (via backend) to generate concise summaries.
- **Carbon Glass UI**: Beautiful glassmorphism design inspired by Carbon theme.
- **Dark/Light Mode**: Toggle between elegant dark and light themes.
- **History Panel**: View, select, and delete previous summaries (stored in browser localStorage).
- **Responsive Design**: Works beautifully on desktop and mobile.
- **No Database Needed**: Stateless backend, history managed on frontend.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kTechKeshav/Doc-summery-assistant.git
cd Doc_summery-assistant
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend root:

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run server
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will start at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Axios
- **Backend:** Express.js, pdfjs-dist, tesseract.js, @google/generative-ai, Multer, CORS

---

## 📦 API Reference

See [`backend/README.md`](./backend/README.md) for API details.

---

## 🖼️ UI Preview

See [`frontend/README.md`](./frontend/README.md) for screenshots and UI features.

---

## 📄 License

MIT

---

## 💡 Credits

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express.js](https://expressjs.com/)
- [Gemini AI](https://ai.google.dev/)
- [pdfjs-dist](https://github.com/mozilla/pdf.js)
- [Tesseract.js](https://github.com/naptha/tesseract.js)
