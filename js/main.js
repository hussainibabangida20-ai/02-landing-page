const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav?.classList.toggle("is-open", !isExpanded);
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;

    button.setAttribute("aria-expanded", String(!expanded));
    if (answer) answer.hidden = expanded;
  });
});

const billingOptions = document.querySelectorAll(".billing-option");
const prices = document.querySelectorAll(".price-value");
const billingNotes = document.querySelectorAll(".billing-note");
const pricePeriods = document.querySelectorAll(".price-period");

billingOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const period = button.dataset.period;
    if (period !== "monthly" && period !== "yearly") return;

    billingOptions.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("active", selected);
      option.setAttribute("aria-pressed", String(selected));
    });

    prices.forEach((price) => {
      const amount = price.dataset[period];
      if (amount) price.textContent = amount;
    });
    billingNotes.forEach((note) => {
      note.textContent = period === "yearly" ? "Billed yearly · save 20%" : "Billed monthly";
    });
    pricePeriods.forEach((label) => {
      label.textContent = period === "yearly" ? "/month, billed yearly" : "/month";
    });
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;

  const formData = new FormData(signupForm);
  const name = formData.get("name");
  if (typeof name !== "string") return;

  if (formMessage) {
    formMessage.textContent = `Thanks, ${name.trim()}! Your details are ready. Please email hello@shuaibtech.ng to complete your enquiry.`;
  }
  signupForm.reset();
});

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());
