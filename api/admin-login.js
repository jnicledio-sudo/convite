const crypto = require("node:crypto");
const { json, env, createAdminToken } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Método não permitido." });
  try {
    const supplied = String((req.body || {}).password || "");
    const expected = env("ADMIN_PASSWORD");
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!valid) return json(res, 401, { error: "Senha incorrecta." });
    return json(res, 200, { token: createAdminToken() });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return json(res, 500, { error: "O painel não está configurado correctamente." });
  }
};
