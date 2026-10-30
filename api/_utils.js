const crypto = require("node:crypto");

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8").send(JSON.stringify(body));
}

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Configuração em falta: ${name}`);
  return value;
}

function createAdminToken() {
  const timestamp = String(Date.now());
  const signature = crypto.createHmac("sha256", env("ADMIN_TOKEN_SECRET")).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return false;
  const age = Date.now() - Number(timestamp);
  if (age < 0 || age > 12 * 60 * 60 * 1000) return false;
  const expected = crypto.createHmac("sha256", env("ADMIN_TOKEN_SECRET")).update(timestamp).digest("hex");
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function supabaseRequest(path, options = {}) {
  const url = env("SUPABASE_URL").replace(/\/$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const error = new Error("Erro ao comunicar com a base de dados.");
    error.status = response.status;
    error.detail = data;
    throw error;
  }
  return data;
}

module.exports = { json, env, createAdminToken, verifyAdminToken, supabaseRequest };
