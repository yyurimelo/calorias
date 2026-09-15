import "dotenv/config";
import express from "express";
import analyzeRoutes from "./routes/analyze.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.use("/api", analyzeRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// O padrão do Node fecha conexões keep-alive ociosas após ~5s, enquanto o
// proxy do Next reutiliza sockets por mais tempo — o resultado é o erro
// intermitente "socket hang up" (ECONNRESET) entre o proxy e o backend.
// Mantendo os sockets vivos por mais tempo, o proxy nunca reutiliza uma
// conexão que o servidor acabou de fechar.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
