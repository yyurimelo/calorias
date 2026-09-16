import { Router, type ErrorRequestHandler } from "express";
import multer from "multer";
import { performance } from "node:perf_hooks";
import { AnalyzeRequest, ProviderError } from "../models";
import {
  analyzeWithAI,
  getDefaultProvider,
  getModelFor,
  isAIProvider,
} from "../services/ai.service";
import { formatBytes, formatDuration, timestamp } from "../lib/logger";

const router = Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

class InvalidFileTypeError extends Error {
  constructor(mimetype: string) {
    super(`Tipo de arquivo não suportado: ${mimetype}`);
    this.name = "InvalidFileTypeError";
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError(file.mimetype));
    }
  },
});

const MULTER_ERRORS: Record<string, { status: number; message: string }> = {
  LIMIT_FILE_SIZE: {
    status: 413,
    message: `A imagem excede o tamanho máximo de ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
  },
  LIMIT_FILE_COUNT: {
    status: 413,
    message: `São permitidas no máximo ${MAX_FILES} imagens por requisição.`,
  },
  LIMIT_UNEXPECTED_FILE: {
    status: 400,
    message: 'Envie os arquivos no campo "images".',
  },
};

function toDataUrl(file: Express.Multer.File): string {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

router.post("/analyze", upload.array("images", MAX_FILES), async (req, res) => {
  console.log(`[${timestamp()}] ${req.method} ${req.originalUrl}`);

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const { prompt, provider: rawProvider } = req.body as AnalyzeRequest;

  const raw = rawProvider === undefined || rawProvider === "" ? getDefaultProvider() : rawProvider;
  const provider = typeof raw === "string" ? raw.trim() : "";

  if (!isAIProvider(provider)) {
    console.log(`[HTTP] 400`);
    res
      .status(400)
      .json({ error: 'Provider inválido. Valores permitidos: "gemini" ou "openrouter".' });
    return;
  }

  if (files.length === 0 && !prompt?.trim()) {
    console.log(`[HTTP] 400`);
    res.status(400).json({ error: "Envie uma imagem ou uma mensagem." });
    return;
  }

  console.log(`[AI] Provider: ${provider}`);
  console.log(`[AI] Model: ${getModelFor(provider)}`);

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`[AI] Image: ${files.length > 0}`);
  if (files.length > 0) {
    console.log(`[AI] Image size: ${formatBytes(totalBytes)}`);
  }

  const images = files.map(toDataUrl);
  const start = performance.now();
  console.log(`[AI] Analysis started`);
  console.log("");

  try {
    const result = await analyzeWithAI({ provider, images, prompt });
    const duration = performance.now() - start;
    console.log("");
    console.log(`[AI] Analysis completed in ${formatDuration(duration)}`);
    console.log(`[HTTP] 200`);
    res.json(result);
  } catch (error) {
    const duration = performance.now() - start;
    console.log("");
    if (error instanceof ProviderError) {
      console.log(`[AI] Error: ${error.status}`);
      console.log(`[AI] Error type: ${error.type}`);
      console.log("");
      console.log(`[HTTP] ${error.status}`);
      console.log(`[AI] Analysis failed after ${formatDuration(duration)}`);
      res.status(error.status).json({
        error: `Falha na análise pela IA: ${error.message}`,
        provider: error.provider,
        errorType: error.type,
      });
      return;
    }
    console.error(error);
    console.log(`[HTTP] 500`);
    console.log(`[AI] Analysis failed after ${formatDuration(duration)}`);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const known = MULTER_ERRORS[err.code];
    const status = known?.status ?? 413;
    const message = known?.message ?? `Erro no upload: ${err.code}`;
    console.log(`[HTTP] ${status}`);
    res.status(status).json({ error: message });
    return;
  }

  if (err instanceof InvalidFileTypeError) {
    console.log(`[HTTP] 415`);
    res.status(415).json({ error: err.message });
    return;
  }

  if (err instanceof ProviderError) {
    console.log(`[AI] Error: ${err.status}`);
    console.log(`[AI] Error type: ${err.type}`);
    console.log(`[HTTP] ${err.status}`);
    res.status(err.status).json({
      error: `Falha na análise pela IA: ${err.message}`,
      provider: err.provider,
      errorType: err.type,
    });
    return;
  }

  console.error(err);
  console.log(`[HTTP] 500`);
  res.status(500).json({ error: "Erro interno do servidor." });
};

router.use(errorHandler);

export default router;
