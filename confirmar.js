const rsvpCard = document.querySelector("#rsvp-card");
const successCard = document.querySelector("#rsvp-success-card");
const confirmedNameEl = document.querySelector("#confirmed-guest-name");
const form = document.querySelector("#rsvp-form");
const feedback = document.querySelector("#rsvp-feedback");
const nameInput = document.querySelector("#guest-name");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.textContent = "";
  feedback.classList.remove("error");

  const name = nameInput.value.trim();
  if (!name || name.length < 2) {
    feedback.textContent = "Por favor, indique o seu nome completo (mínimo 2 letras).";
    feedback.classList.add("error");
    nameInput.focus();
    return;
  }

  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  button.innerHTML = 'A confirmar...';

  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        company: form.elements.company.value
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Não foi possível registar a sua confirmação.");
    }

    // Sucesso: alternar para o ecrã de celebração
    confirmedNameEl.textContent = name;
    rsvpCard.hidden = true;
    successCard.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    feedback.textContent = error.message || "Ocorreu um erro ao comunicar com o servidor. Tente novamente.";
    feedback.classList.add("error");
    button.disabled = false;
    button.innerHTML = '<span aria-hidden="true">✓</span> Confirmar presença';
  }
});
