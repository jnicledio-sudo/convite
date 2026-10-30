const { json, supabaseRequest } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Método não permitido." });

  try {
    const { name, company } = req.body || {};
    // Campo-armadilha simples para reduzir envios automáticos.
    if (company) return json(res, 200, { ok: true });
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      return json(res, 400, { error: "Introduza um nome válido (2 a 100 caracteres)." });
    }

    await supabaseRequest("guest_confirmations", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ name: name.trim() })
    });
    return json(res, 201, { ok: true });
  } catch (error) {
    console.error("RSVP error:", error.message);
    return json(res, 500, { error: "Não foi possível guardar a confirmação. Tente novamente." });
  }
};
