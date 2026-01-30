// Fundo animado que segue o mouse
const bgAnimated = document.querySelector('.bg-animated');
const blobs = document.querySelectorAll('.blob');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

if (bgAnimated && blobs.length) {
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateBlobs() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const move = 40;
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.5;
      const x = currentX * move * factor;
      const y = currentY * move * factor;
      blob.style.transform = blob.classList.contains('blob-3')
        ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
        : `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateBlobs);
  }
  animateBlobs();
}

let btnMenu = document.getElementById('btn-menu');
let menu = document.getElementById('menu-mobile');
let overlay = document.getElementById('overlay-menu');


btnMenu.addEventListener('click',()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')
})


// ========== MÁSCARA DE TELEFONE (XX) XXXXX-XXXX ==========
function formatarTelefone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const phoneInputEl = document.querySelector("#phone");
if (phoneInputEl) {
  phoneInputEl.addEventListener("input", function () {
    this.value = formatarTelefone(this.value);
  });
}

// ========== FORMULÁRIO DE CONTATO – VALIDAÇÕES ==========
const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const messageTextarea = document.querySelector("#message");
const formSuccess = document.getElementById("form-success");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const messageError = document.getElementById("message-error");
const btnSubmit = document.getElementById("btn-submit");

function showError(errorEl, message) {
  if (!errorEl) return;
  errorEl.textContent = message;
  const input = errorEl.previousElementSibling; // input está antes do span
  if (input) {
    input.classList.add("error");
    input.classList.remove("valid");
  }
}
function clearError(errorEl, input) {
  if (errorEl) errorEl.textContent = "";
  const inp = input || (errorEl?.closest(".form-group")?.querySelector("input, textarea"));
  if (inp) {
    inp.classList.remove("error");
    inp.classList.toggle("valid", !!inp.value.trim());
  }
}

function validateName() {
  const value = nameInput.value.trim();
  clearError(nameError, nameInput);
  if (!value) {
    showError(nameError, "Name is required.");
    nameInput.classList.remove("valid");
    return false;
  }
  if (value.length < 2) {
    showError(nameError, "Name must have at least 2 characters.");
    return false;
  }
  if (/[0-9]/.test(value)) {
    showError(nameError, "Name should not contain numbers.");
    return false;
  }
  nameInput.classList.add("valid");
  return true;
}

function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateEmail() {
  const value = emailInput.value.trim();
  clearError(emailError, emailInput);
  if (!value) {
    showError(emailError, "Email is required.");
    return false;
  }
  if (!isEmailValid(value)) {
    showError(emailError, "Enter a valid email address.");
    return false;
  }
  emailInput.classList.add("valid");
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim().replace(/\s/g, "");
  clearError(phoneError, phoneInput);
  if (!value) {
    showError(phoneError, "Phone number is required.");
    return false;
  }
  const onlyDigits = value.replace(/\D/g, "");
  if (onlyDigits.length < 10 || onlyDigits.length > 11) {
    showError(phoneError, "Enter a valid phone number (10 or 11 digits).");
    return false;
  }
  phoneInput.classList.add("valid");
  return true;
}

function validateMessage() {
  const value = messageTextarea.value.trim();
  clearError(messageError, messageTextarea);
  if (!value) {
    showError(messageError, "Message is required.");
    return false;
  }
  if (value.length < 10) {
    showError(messageError, "Message must have at least 10 characters.");
    return false;
  }
  messageTextarea.classList.add("valid");
  return true;
}

function clearErrorForInput(input) {
  const err = document.getElementById(input.id + "-error");
  if (err) err.textContent = "";
  input.classList.remove("error");
  input.classList.toggle("valid", !!input.value.trim());
}

if (form) {
  [nameInput, emailInput, phoneInput, messageTextarea].forEach((input) => {
    if (!input) return;
    input.addEventListener("blur", () => {
      if (input === nameInput) validateName();
      else if (input === emailInput) validateEmail();
      else if (input === phoneInput) validatePhone();
      else if (input === messageTextarea) validateMessage();
    });
    input.addEventListener("input", () => clearErrorForInput(input));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameOk = validateName();
    const emailOk = validateEmail();
    const phoneOk = validatePhone();
    const messageOk = validateMessage();

    if (!nameOk || !emailOk || !phoneOk || !messageOk) {
      const firstInvalid = form.querySelector(".error");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Sending...";
    }

    const formId = form.dataset.formspreeId || "";
    const mailto = form.dataset.mailto || "igor.sebastian23@gmail.com";
    const useFormspree = formId && !formId.includes("REPLACE");

    if (useFormspree) {
      try {
        const formData = new FormData(form);
        const res = await fetch(`https://formspree.io/f/${formId}`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          showFormSuccess();
        } else {
          openMailtoFallback();
        }
      } catch (e) {
        openMailtoFallback();
      }
    } else {
      openMailtoFallback();
    }

    function openMailtoFallback() {
      const subject = encodeURIComponent("Contato pelo Portfólio");
      const body = encodeURIComponent(
        `Nome: ${nameInput.value.trim()}\nE-mail: ${emailInput.value.trim()}\nTelefone: ${phoneInput.value.trim()}\n\nMensagem:\n${messageTextarea.value.trim()}`
      );
      window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      showFormSuccess();
    }

    function showFormSuccess() {
      if (formSuccess) {
        formSuccess.hidden = false;
        form.reset();
        phoneInput.value = "";
        form.querySelectorAll("input, textarea").forEach((el) => el.classList.remove("valid", "error"));
        [nameError, emailError, phoneError, messageError].forEach((el) => { if (el) el.textContent = ""; });
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Send message";
      }
      setTimeout(() => {
        if (formSuccess) formSuccess.hidden = true;
      }, 5000);
    }
  });
}


const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const voltarTopo = document.getElementById('voltarTopo');
if (voltarTopo) {
  voltarTopo.style.display = 'none';
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      voltarTopo.style.display = 'flex';
      voltarTopo.style.alignItems = 'center';
      voltarTopo.style.justifyContent = 'center';
    } else {
      voltarTopo.style.display = 'none';
    }
  });
  voltarTopo.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
