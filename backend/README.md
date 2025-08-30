# 🚀 Doc Summary Assistant — Backend

A fast Express.js backend for AI-powered document summarization.  
Handles PDF/image uploads, extracts text, and generates summaries using Gemini AI.

---

## ✨ Features

- **File Upload API**: Accepts PDF and image files via `/api/upload`.
- **Text Extraction**: Uses `pdfjs-dist` for PDFs and `tesseract.js` for images (OCR).
- **AI Summarization**: Integrates Gemini AI for smart, customizable summaries.
- **CORS Support**: Easily connects to any frontend.
- **No Database Needed**: Stateless, summary history managed on frontend.

---

## 🛠️ Tech Stack

- **Express.js**
- **pdfjs-dist** (PDF text extraction)
- **tesseract.js** (OCR for images)
- **@google/generative-ai** (Gemini API)
- **Multer** (file uploads)
- **CORS**
- **dotenv**

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend root:

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Run the server

```bash
npm run server
```

Server will start at [http://localhost:5000](http://localhost:5000).

---

## 📦 API Endpoints

### `POST /api/upload`

Upload a PDF or image to get a summary.

**Request:**  
- `multipart/form-data` with `file` (PDF/image) and optional `length` (`short`, `medium`, `long`).

**Response:**  
```json
{
  "summary": "...",
  "textPreview": "...",
  "filename": "yourfile.pdf"
}
```

---

## 📝 Example Usage

```bash
curl -F "file=@yourdoc.pdf" -F "length=short" http://localhost:5000/api/upload
```

---

## 📁 Project Structure

```
src/
  ├── controllers/
  │     └── summaryController.js
  ├── routes/
  │     └── upload.js
  ├── services/
  │     └── geminiService.js
  ├── app.js
```

---

## 💡 Credits

- [Express.js](https://expressjs.com/)
- [pdfjs-dist](https://github.com/mozilla/pdf.js)
- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [Gemini AI](https://ai.google.dev/)
- [Multer](https://github.com/expressjs/multer)

---

## 📄 License

MIT