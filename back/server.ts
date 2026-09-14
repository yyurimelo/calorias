import "dotenv/config";
import express from "express";
import analyzeRoutes from "./routes/analyze.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
