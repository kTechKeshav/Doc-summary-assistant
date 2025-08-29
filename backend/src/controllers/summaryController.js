// backend/src/controllers/summaryController.js
import fs from "fs";
import { getDocument } from "pdfjs-dist"; // PDF extraction
import { createWorker } from "tesseract.js"; // OCR
import { summarizeWithGemini } from "../services/geminiService.js";
import Document from "../models/Document.js";

// --- PDF Extraction ---
async function extractTextFromPDF(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }
  return text;
}

// --- Image Extraction (OCR with Tesseract) ---
async function extractTextFromImage(filePath) {
  // ✅ Newer Tesseract.js API — no manual loadLanguage/load/initialize needed
  const worker = await createWorker("eng");
  const {
    data: { text },
  } = await worker.recognize(filePath);
  await worker.terminate();
  return text;
}

export async function handleUpload(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";

    if (file.mimetype === "application/pdf") {
      // --- PDF Extraction ---
      text = await extractTextFromPDF(file.path);
    } else if (file.mimetype.startsWith("image/")) {
      // --- Image Extraction via OCR ---
      text = await extractTextFromImage(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // --- Summarize with Gemini ---
    const summary = await summarizeWithGemini(
      text,
      req.body.length || "medium"
    );

    // --- Save to DB ---
    const doc = await Document.create({
      filename: file.filename,
      originalname: file.originalname,
      text,
      summary,
    });

    // --- Return result ---
    res.json({ id: doc._id, summary, textPreview: text.slice(0, 1000) });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Processing error" });
  }
}
