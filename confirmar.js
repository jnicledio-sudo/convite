const form = document.querySelector("#rsvp-form");
const feedback = document.querySelector("#rsvp-feedback");
const nameInput = document.querySelector("#guest-name");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.textContent = "";
  feedback.classList.remove("error");

  const name = nameInput.value.trim();
  if (!name) {
    feedback.textContent = "Por favor, indique o seu nome.";
    feedback.classList.add("error");
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "A confirmar...";

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
    if (!response.ok) throw new Error(result.error || "Não foi possível guardar a confirmação.");

    feedback.textContent = "Presença confirmada com sucesso. Obrigado!";
    nameInput.value = "";
    form.reset();
  } catch (error) {
    feedback.textContent = error.message || "Ocorreu um erro. Tente novamente.";
    feedback.classList.add("error");
  } finally {
    button.disabled = false;
    button.innerHTML = '<span aria-hidden="true">✓</span> Confirmar presença';
  }
});
