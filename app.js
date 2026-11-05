const form = document.querySelector("form");
const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const email = document.querySelector("#email");
const queryTypes = document.querySelectorAll("input[name='query-type']");
const message = document.querySelector("#message");
const consent = document.querySelector("#consent");
const submitButton = document.querySelector("form button");

// Error messages
const firstNameError = document.querySelector(".first__error");
const lastNameError = document.querySelector(".last__error");
const emailError = document.querySelector(".email__error");
const queryTypeError = document.querySelector(".query__error");
const messageError = document.querySelector(".message__error");
const consentError = document.querySelector(".consent__error");
const submissionError = document.querySelector(".submission__error");

// Success message
const successMessage = document.querySelector(".success__message");

function setError(control, error, message) {
  error.textContent = message;
  control.setAttribute("aria-invalid", String(Boolean(message)));

  if ("classList" in control) {
    control.classList.toggle("input__error", Boolean(message));
  }
}

// Form validation
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  firstName.value = firstName.value.trim();
  lastName.value = lastName.value.trim();
  email.value = email.value.trim();
  message.value = message.value.trim();

  setError(
    firstName,
    firstNameError,
    firstName.value ? "" : "First name cannot be empty",
  );
  setError(
    lastName,
    lastNameError,
    lastName.value ? "" : "Last name cannot be empty",
  );

  let emailErrorMessage = "";
  if (!email.value) {
    emailErrorMessage = "Email cannot be empty";
  } else if (!email.validity.valid) {
    emailErrorMessage = "Please enter a valid email";
  }
  setError(email, emailError, emailErrorMessage);

  const hasSelectedQueryType = [...queryTypes].some((type) => type.checked);
  queryTypeError.textContent = hasSelectedQueryType
    ? ""
    : "Please select a query type";
  queryTypes.forEach((type) => {
    type.setAttribute("aria-invalid", String(!hasSelectedQueryType));
  });
  setError(
    message,
    messageError,
    message.value ? "" : "Message cannot be empty",
  );
  setError(
    consent,
    consentError,
    consent.checked
      ? ""
      : "To submit this form, please consent to being contacted",
  );

  const isValidForm =
    firstName.value &&
    lastName.value &&
    email.value &&
    email.validity.valid &&
    hasSelectedQueryType &&
    message.value &&
    consent.checked;

  if (!isValidForm) {
    successMessage.classList.remove("show");
    const firstInvalidControl = form.querySelector('[aria-invalid="true"]');
    firstInvalidControl?.focus();
    return;
  }

  submissionError.hidden = true;
  submissionError.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    successMessage.classList.add("show");
    submitButton.textContent = "Submitted";

    setTimeout(() => {
      successMessage.classList.remove("show");
      submitButton.disabled = false;
      submitButton.textContent = "Submit";

      form.reset();
    }, 10000);
  } catch (error) {
    console.error("Contact form submission failed:", error);
    submissionError.textContent =
      "There was a problem sending your message. Please try again.";
    submissionError.hidden = false;
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});
