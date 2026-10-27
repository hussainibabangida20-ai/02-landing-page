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
 * Validates signup fields, prevents duplicate emails, and stores valid signups.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");
  if (!signupForm) return;

  const fields = {
    name: signupForm.querySelector("#full-name"),
    email: signupForm.querySelector("#email"),
    plan: signupForm.querySelector("#plan"),
    terms: signupForm.querySelector('[name="terms"]'),
  };
  const errors = {
    name: signupForm.querySelector("#name-error"),
    email: signupForm.querySelector("#email-error"),
    plan: signupForm.querySelector("#plan-error"),
    terms: signupForm.querySelector("#terms-error"),
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (field, errorElement, message) => {
    if (!field || !errorElement) return;
    errorElement.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
  };

  const validateField = (fieldName) => {
    const field = fields[fieldName];
    if (!field) return true;

    let message = "";
    if (fieldName === "name" && field.value.trim().length < 2) {
      message = "Please enter a name with at least 2 characters.";
    } else if (fieldName === "email" && !emailPattern.test(field.value.trim())) {
      message = "Please enter a valid email address.";
    } else if (fieldName === "plan" && !field.value) {
      message = "Please choose a service or plan.";
    } else if (fieldName === "terms" && !field.checked) {
      message = "Please accept the terms to continue.";
    }

    setFieldError(field, errors[fieldName], message);
    return !message;
  };

  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    if (!field) return;
    const eventName = fieldName === "plan" || fieldName === "terms" ? "change" : "input";

    field.addEventListener(eventName, () => {
      validateField(fieldName);
      if (formMessage) formMessage.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formMessage) formMessage.textContent = "";

    const isValid = Object.keys(fields).reduce(
      (valid, fieldName) => validateField(fieldName) && valid,
      true,
    );
    if (!isValid) {
      signupForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const name = fields.name?.value.trim();
    const email = fields.email?.value.trim();
    const plan = fields.plan?.value;
    if (!name || !email || !plan) return;

    let signups;
    try {
      const savedSignups = localStorage.getItem("signups");
      signups = savedSignups ? JSON.parse(savedSignups) : [];
    } catch (error) {
      console.error("Could not read saved signups from localStorage.", error);
      if (formMessage) formMessage.textContent = "We couldn’t check saved signups. Please try again.";
      return;
    }

    if (!Array.isArray(signups)) {
      console.error('The "signups" localStorage value is not an array.');
      if (formMessage) formMessage.textContent = "Saved signup data is unavailable. Please contact us by email.";
      return;
    }

    const duplicateSignup = signups.some(
      (signup) => typeof signup?.email === "string" && signup.email.toLowerCase() === email.toLowerCase(),
    );
    if (duplicateSignup) {
      setFieldError(fields.email, errors.email, "You've already signed up.");
      if (formMessage) formMessage.textContent = "You've already signed up.";
      fields.email?.focus();
      return;
    }

    signups.push({ name, email, plan, createdAt: new Date().toISOString() });
    try {
      localStorage.setItem("signups", JSON.stringify(signups));
    } catch (error) {
      console.error("Could not save signup to localStorage.", error);
      if (formMessage) formMessage.textContent = "We couldn’t save your signup. Please try again.";
      return;
    }

    signupForm.reset();
    Object.keys(fields).forEach((fieldName) => {
      setFieldError(fields[fieldName], errors[fieldName], "");
    });
    if (formMessage) formMessage.textContent = `Thanks, ${name}! Your signup has been saved.`;
  });
};

document.addEventListener("DOMContentLoaded", init);
