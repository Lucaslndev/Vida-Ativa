const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");

function setMenuOpen(isOpen) {
  if (!menuToggle || !mainNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  mainNav.classList.toggle("is-open", isOpen);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      event.target instanceof Node &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm instanceof HTMLFormElement && formStatus) {
  const fields = contactForm.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      formStatus.textContent = "";
      formStatus.classList.remove("is-error");
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = [...fields].filter((field) => !field.validity.valid);
    fields.forEach((field) => {
      if (!field.validity.valid) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    });

    if (invalidFields.length > 0) {
      formStatus.textContent = "Confira os campos destacados antes de continuar.";
      formStatus.classList.add("is-error");
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Campos validados. O site ainda não está conectado a um serviço de envio; fale com a equipe pelo e-mail ou WhatsApp.";
    formStatus.classList.remove("is-error");
  });
}
