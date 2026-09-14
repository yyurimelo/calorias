import { Router, type ErrorRequestHandler } from "express";
import multer from "multer";
import { AnalyzeRequest } from "../models";
import { OpenRouterError, analyzeImages } from "../services/analyze.service";

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
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const { prompt } = req.body as AnalyzeRequest;

  if (files.length === 0) {
    res.status(400).json({ error: "Nenhuma imagem enviada." });
    return;
  }

  const images = files.map(toDataUrl);
  const result = await analyzeImages({ images, prompt });

  res.json(result);
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const known = MULTER_ERRORS[err.code];
    if (known) {
      res.status(known.status).json({ error: known.message });
    } else {
      res.status(413).json({ error: `Erro no upload: ${err.code}` });
    }
    return;
  }

  if (err instanceof InvalidFileTypeError) {
    res.status(415).json({ error: err.message });
    return;
  }

  if (err instanceof OpenRouterError) {
    res.status(err.status).json({ error: `Falha na análise pela IA: ${err.message}` });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
};

router.use(errorHandler);

export default router;
