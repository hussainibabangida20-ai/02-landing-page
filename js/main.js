/**
 * Initializes the landing page after its markup is ready.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initFooterYear();
  initSignupForm();
};

/**
 * Toggles the mobile navigation and closes it after navigation or Escape.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".nav__toggle");
  const primaryNav = document.querySelector("#primary-nav");

  if (!menuToggle || !primaryNav) return;

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("nav--open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("nav--open", !isExpanded);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
};

/**
 * Provides single-open FAQ accordions with animated panel heights.
 */
const initAccordion = () => {
  const questions = document.querySelectorAll(".faq__question");

  questions.forEach((question) => {
    const answerId = question.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;
    if (!answer) return;

    answer.hidden = false;
    answer.style.height = question.getAttribute("aria-expanded") === "true" ? "auto" : "0px";
    answer.classList.toggle("faq__answer--open", question.getAttribute("aria-expanded") === "true");

    question.addEventListener("click", () => {
      const shouldOpen = question.getAttribute("aria-expanded") !== "true";

      questions.forEach((otherQuestion) => {
        const otherAnswerId = otherQuestion.getAttribute("aria-controls");
        const otherAnswer = otherAnswerId ? document.getElementById(otherAnswerId) : null;
        if (!otherAnswer || otherQuestion === question) return;

        otherQuestion.setAttribute("aria-expanded", "false");
        otherAnswer.classList.remove("faq__answer--open");
        otherAnswer.style.height = `${otherAnswer.scrollHeight}px`;
        requestAnimationFrame(() => {
          otherAnswer.style.height = "0px";
        });
      });

      question.setAttribute("aria-expanded", String(shouldOpen));
      answer.classList.toggle("faq__answer--open", shouldOpen);

      if (shouldOpen) {
        answer.style.height = `${answer.scrollHeight}px`;
        answer.addEventListener("transitionend", () => {
          if (question.getAttribute("aria-expanded") === "true") {
            answer.style.height = "auto";
          }
        }, { once: true });
      } else {
        answer.style.height = `${answer.scrollHeight}px`;
        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });
      }
    });
  });
};

/**
 * Switches displayed prices and reveals the yearly savings label.
 */
const initPricingToggle = () => {
  const billingOptions = document.querySelectorAll(".pricing__option");
  const prices = document.querySelectorAll(".pricing__amount");
  const billingNotes = document.querySelectorAll(".pricing__billing-note");
  const pricePeriods = document.querySelectorAll(".pricing__period");
  const savingsLabel = document.querySelector(".pricing__savings");

  const setBillingPeriod = (period) => {
    billingOptions.forEach((option) => {
      const isSelected = option.dataset.period === period;
      option.classList.toggle("pricing__option--active", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
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

    if (savingsLabel) savingsLabel.hidden = period !== "yearly";
  };

  billingOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const period = button.dataset.period;
      if (period === "monthly" || period === "yearly") setBillingPeriod(period);
    });
  });

  setBillingPeriod("monthly");
};

/**
 * Adds a shadow to the sticky header once the page scrolls past 10 pixels.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const updateHeaderShadow = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Displays the current year in the footer.
 */
const initFooterYear = () => {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
};

/**
 * Shows a confirmation after the signup form passes native validation.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");
  if (!signupForm) return;

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;

    const name = new FormData(signupForm).get("name");
    if (typeof name !== "string") return;

    if (formMessage) {
      formMessage.textContent = `Thanks, ${name.trim()}! Your details are ready. Please email hello@shuaibtech.ng to complete your enquiry.`;
    }
    signupForm.reset();
  });
};

document.addEventListener("DOMContentLoaded", init);
