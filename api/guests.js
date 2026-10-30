const { json, verifyAdminToken, supabaseRequest } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") return json(res, 405, { error: "Método não permitido." });
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!verifyAdminToken(token)) return json(res, 401, { error: "Acesso não autorizado." });

    const guests = await supabaseRequest(
      "guest_confirmations?select=id,name,created_at&order=created_at.asc"
    );
    return json(res, 200, { guests: guests || [] });
  } catch (error) {
    console.error("Guest list error:", error.message);
    return json(res, 500, { error: "Não foi possível consultar as confirmações." });
  }
};
