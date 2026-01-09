import { Ollama } from "ollama";
import dotenv from "dotenv";

dotenv.config({ encoding: "utf8", path: ".env", debug: true });

//validation
const requiredEnv = [
  "OLLAMA_MODEL",
  "OLLAMA_SYSTEM_PROMPT",
  "OLLAMA_VISION_MODEL",
  "OLLAMA_VISION_SYSTEM_PROMPT",
  "OLLAMA_HOST",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required OLLAMA_ env vars: ${missingEnv.join(", ")}`
  );
}

//client init
const ollamaClient = new Ollama({
  host: process.env.OLLAMA_HOST,
});

// conifg export
export const ollama = {
  client: ollamaClient,
  host: process.env.OLLAMA_HOST,
  model: process.env.OLLAMA_MODEL,
  systemPrompt: process.env.OLLAMA_SYSTEM_PROMPT,
  visionModel: process.env.OLLAMA_VISION_MODEL,
  visionSystemPrompt: process.env.OLLAMA_VISION_SYSTEM_PROMPT,
};
