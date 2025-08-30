import fs from "fs";
import { getDocument } from "pdfjs-dist"; 
import { createWorker } from "tesseract.js"; 
import { summarizeWithGemini } from "../services/geminiService.js";

// PDF Extraction 
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

// Image Extraction => (OCR with Tesseract)
async function extractTextFromImage(filePath) {
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
      text = await extractTextFromPDF(file.path);
    } else if (file.mimetype.startsWith("image/")) {
      text = await extractTextFromImage(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const summary = await summarizeWithGemini(
      text,
      req.body.length || "medium"
    );

    res.json({ summary, textPreview: text.slice(0, 1000), filename: file.originalname });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Processing error" });
  }
}
