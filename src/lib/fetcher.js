// src/lib/fetcher.js
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const API_URL = import.meta.env.VITE_API_URL || "";
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

function joinUrl(base, path) {
  if (!base) return path;
  if (base.endsWith("/") && path.startsWith("/")) return base.slice(0, -1) + path;
  if (!base.endsWith("/") && !path.startsWith("/")) return base + "/" + path;
  return base + path;
}

export async function fetchJson(path, options = {}) {
  const url = joinUrl(API_URL, path);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let body = null;
    try {
      body = isJson ? await res.json() : await res.text();
    } catch {
      body = null;
    }

    if (!res.ok) {
      const msg =
        (body && body.message) ||
        (typeof body === "string" && body) ||
        `Erro HTTP ${res.status}`;
      throw new ApiError(msg, res.status, body);
    }

    return body;
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new ApiError("Tempo limite excedido. Tente novamente.", 408, null);
    }
    if (err instanceof ApiError) throw err;

    throw new ApiError(
      "Falha de conexão com a API. Verifique se o backend está rodando.",
      0,
      err
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
