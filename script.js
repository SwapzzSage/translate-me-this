document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const langToggle = document.getElementById("langToggle");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const serviceOptions = document.querySelectorAll(".service-option");
    const documentType = document.querySelector('select[name="document-type"]');
    const pageLanguage = document.documentElement.lang === "es" ? "es" : "en";

    const setupQuoteButton = () => {
        if (!nav || !langToggle) {
            return;
        }

        let navActions = nav.querySelector(".nav-actions");

        if (!navActions) {
            navActions = document.createElement("div");
            navActions.className = "nav-actions";
            langToggle.parentNode.insertBefore(navActions, langToggle);
            navActions.appendChild(langToggle);
        }

        if (navActions.querySelector(".contact-info-toggle")) {
            return;
        }

        const quoteButton = document.createElement("a");
        quoteButton.className = "contact-info-toggle";
        quoteButton.href = "https://wa.me/50766753033";
        quoteButton.target = "_blank";
        quoteButton.rel = "noopener noreferrer";
        quoteButton.setAttribute("aria-label", pageLanguage === "es" ? "Cotiza por WhatsApp" : "Get your quote on WhatsApp");
        quoteButton.innerHTML = `
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="7" y="2" width="10" height="20" rx="2"></rect>
                <path d="M11 18h2"></path>
            </svg>
            <span>${pageLanguage === "es" ? "Cotiza aquí" : "Get your quote"}</span>
        `;
        navActions.appendChild(quoteButton);
    };

    setupQuoteButton();

    const trackOutboundWhatsApp = link => {
        if (typeof window.gtag !== "function") {
            return;
        }

        window.gtag("event", "whatsapp_click", {
            event_category: "lead",
            event_label: link.href
        });
        window.gtag("event", "generate_lead", {
            method: "whatsapp",
            event_category: "lead",
            event_label: link.href
        });
    };

    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
        link.addEventListener("click", () => trackOutboundWhatsApp(link));
    });

    const contactForm = document.querySelector('#contact form');

    if (contactForm) {
        contactForm.addEventListener("submit", () => {
            if (typeof window.gtag === "function") {
                window.gtag("event", "generate_lead", {
                    method: "contact_form",
                    event_category: "lead",
                    event_label: window.location.pathname
                });
            }
        });
    }

    const navLinks = document.querySelectorAll(".nav-links a");

    if (documentType) {
        const selectedService = new URLSearchParams(window.location.search).get("service");

        if (selectedService) {
            documentType.value = selectedService;
        }
    }

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (nav && mobileMenuToggle) {
                nav.classList.remove("open");
                mobileMenuToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    serviceOptions.forEach(option => {
        option.addEventListener("click", () => {
            if (documentType) {
                documentType.value = option.dataset.service;
            }
        });
    });
});
