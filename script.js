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

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function applyCpfMask(value) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function applyPhoneMask(value) {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function applyCepMask(value) {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function validateCpf(value) {
  const digits = digitsOnly(value);

  if (digits.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const computeVerifier = (digitsToValidate, factor) => {
    const sum = digitsToValidate.reduce((total, digit) => total + Number(digit) * factor--, 0);
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  const d1 = computeVerifier([...digits.slice(0, 9)], 10);
  const d2 = computeVerifier([...digits.slice(0, 9), d1], 11);

  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

function setupCustomFormValidation(form, statusEl, onSubmitMessage) {
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const fields = form.querySelectorAll("input, textarea, select");

  const clearFeedback = () => {
    fields.forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.setCustomValidity("");
    });

    if (statusEl) {
      statusEl.textContent = "";
      statusEl.classList.remove("is-error");
    }
  };

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("is-error");
      }
    });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(clearFeedback, 0);
  });

  form.addEventListener("submit", (event) => {
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
      if (statusEl) {
        statusEl.textContent = "Confira os campos destacados antes de continuar.";
        statusEl.classList.add("is-error");
      }
      form.reportValidity();
      return;
    }

    if (statusEl) {
      statusEl.textContent = onSubmitMessage;
      statusEl.classList.remove("is-error");
    }
  });
}

if (contactForm instanceof HTMLFormElement && formStatus) {
  setupCustomFormValidation(
    contactForm,
    formStatus,
    "Campos validados. O site ainda não está conectado a um serviço de envio; fale com a equipe pelo e-mail ou WhatsApp."
  );
}

const cadastroForm = document.querySelector("#cadastro-form");
const cadastroStatus = document.querySelector("#cadastro-status");
const birthField = document.querySelector("#data-nascimento");

if (birthField instanceof HTMLInputElement) {
  birthField.max = new Date().toISOString().split("T")[0];
  birthField.min = "1900-01-01";
}

if (cadastroForm instanceof HTMLFormElement && cadastroStatus) {
  const cpfField = document.querySelector("#cpf");
  const telefoneField = document.querySelector("#telefone");
  const cepField = document.querySelector("#cep");

  if (cpfField instanceof HTMLInputElement) {
    cpfField.addEventListener("input", () => {
      cpfField.value = applyCpfMask(cpfField.value);
      cpfField.setCustomValidity(validateCpf(cpfField.value) ? "" : "Informe um CPF válido.");
      cpfField.toggleAttribute("aria-invalid", !validateCpf(cpfField.value));
    });
  }

  if (telefoneField instanceof HTMLInputElement) {
    telefoneField.addEventListener("input", () => {
      telefoneField.value = applyPhoneMask(telefoneField.value);
      telefoneField.setCustomValidity(digitsOnly(telefoneField.value).length >= 10 ? "" : "Informe um telefone válido.");
      telefoneField.toggleAttribute("aria-invalid", digitsOnly(telefoneField.value).length < 10);
    });
  }

  if (cepField instanceof HTMLInputElement) {
    cepField.addEventListener("input", () => {
      cepField.value = applyCepMask(cepField.value);
      cepField.setCustomValidity(digitsOnly(cepField.value).length === 8 ? "" : "Informe um CEP válido.");
      cepField.toggleAttribute("aria-invalid", digitsOnly(cepField.value).length !== 8);
    });
  }

  setupCustomFormValidation(
    cadastroForm,
    cadastroStatus,
    "Formulário validado. Como não há backend configurado, esta é apenas uma demonstração de front-end."
  );

  cadastroForm.addEventListener("submit", () => {
    const cpfValid = cpfField instanceof HTMLInputElement ? validateCpf(cpfField.value) : true;
    const telefoneValid = telefoneField instanceof HTMLInputElement ? digitsOnly(telefoneField.value).length >= 10 : true;
    const cepValid = cepField instanceof HTMLInputElement ? digitsOnly(cepField.value).length === 8 : true;

    if (!cpfValid && cpfField instanceof HTMLInputElement) {
      cpfField.setCustomValidity("Informe um CPF válido.");
      cpfField.setAttribute("aria-invalid", "true");
    }

    if (!telefoneValid && telefoneField instanceof HTMLInputElement) {
      telefoneField.setCustomValidity("Informe um telefone válido.");
      telefoneField.setAttribute("aria-invalid", "true");
    }

    if (!cepValid && cepField instanceof HTMLInputElement) {
      cepField.setCustomValidity("Informe um CEP válido.");
      cepField.setAttribute("aria-invalid", "true");
    }
  });
}
