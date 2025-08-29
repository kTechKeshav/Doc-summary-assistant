// backend/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get('/', (req, res)=>{
  res.send('You are at root route')
})

app.use('/api/upload', uploadRouter);

// Start server (no mongoose)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://127.0.0.1:${PORT}`));
