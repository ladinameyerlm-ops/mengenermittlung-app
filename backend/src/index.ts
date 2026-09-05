import express, { Request, Response } from "express";
import cors from "cors";
import { berechneMenugenermittlung } from "./sia385Calculator";

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/berechne
app.post("/api/berechne", (req: Request, res: Response) => {
  try {
    const ergebnis = berechneMenugenermittlung(req.body);
    res.json(ergebnis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ fehler: String(error) });
  }
});

// GET /api/health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    norm: "SIA 385/1 + SVGW W10",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
  console.log(`📋 POST http://localhost:${PORT}/api/berechne`);
  console.log(`🏥 GET http://localhost:${PORT}/api/health`);
});