document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("nav");
    const langToggle = document.getElementById("langToggle");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const serviceOptions = document.querySelectorAll(".service-option");
    const documentType = document.querySelector('select[name="document-type"]');
    const supportedLanguages = ["en", "es"];

    const normalizeNavigation = () => {
        const navList = document.querySelector(".nav-links");

        if (!navList) {
            return;
        }

        const contactHref = window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")
            ? "#contact"
            : "index.html#contact";

        navList.innerHTML = `
            <li>
                <a href="index.html" class="en">Home</a>
                <a href="index.html" class="es hidden">Inicio</a>
            </li>
            <li>
                <a href="services.html" class="en">Services</a>
                <a href="services.html" class="es hidden">Servicios</a>
            </li>
            <li>
                <a href="about.html" class="en">About</a>
                <a href="about.html" class="es hidden">Acerca de</a>
            </li>
            <li>
                <a href="FAQ.html" class="en">FAQ</a>
                <a href="FAQ.html" class="es hidden">FAQ</a>
            </li>
            <li>
                <a href="${contactHref}" class="en">Contact</a>
                <a href="${contactHref}" class="es hidden">Contacto</a>
            </li>
        `;
    };

    const setupContactInfo = () => {
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

        let contactButton = navActions.querySelector(".contact-info-toggle");

        if (!contactButton) {
            contactButton = document.createElement("button");
            contactButton.className = "contact-info-toggle";
            contactButton.type = "button";
            contactButton.setAttribute("aria-label", "Open contact information");
            contactButton.setAttribute("aria-haspopup", "dialog");
            contactButton.setAttribute("aria-controls", "contactInfoPanel");
            contactButton.innerHTML = `
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="7" y="2" width="10" height="20" rx="2"></rect>
                    <path d="M11 18h2"></path>
                </svg>
                <span class="en">Get your quote</span>
                <span class="es hidden">Cotiza aquí</span>
            `;
            navActions.appendChild(contactButton);
        }

        let contactPanel = document.getElementById("contactInfoPanel");

        if (!contactPanel) {
            contactPanel = document.createElement("div");
            contactPanel.className = "contact-info-panel";
            contactPanel.id = "contactInfoPanel";
            contactPanel.setAttribute("role", "dialog");
            contactPanel.setAttribute("aria-modal", "true");
            contactPanel.setAttribute("aria-labelledby", "contactInfoTitle");
            contactPanel.hidden = true;
            contactPanel.innerHTML = `
                <div class="contact-info-card">
                    <button class="contact-info-close" type="button" aria-label="Close contact information">×</button>
                    <h2 id="contactInfoTitle">
                        <span class="en">Contact</span>
                        <span class="es hidden">Contacto</span>
                    </h2>
                    <a href="mailto:info@translatemethis.com">info@translatemethis.com</a>
                    <a href="https://wa.me/50766753033" target="_blank" rel="noopener noreferrer">+507 66753033</a>
                </div>
            `;
            document.body.appendChild(contactPanel);
        }

        const closeButton = contactPanel.querySelector(".contact-info-close");
        const openPanel = () => {
            contactPanel.hidden = false;
            closeButton.focus();
        };
        const closePanel = () => {
            contactPanel.hidden = true;
            contactButton.focus();
        };

        contactButton.addEventListener("click", openPanel);
        closeButton.addEventListener("click", closePanel);
        contactPanel.addEventListener("click", event => {
            if (event.target === contactPanel) {
                closePanel();
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !contactPanel.hidden) {
                closePanel();
            }
        });
    };

    const getCurrentLanguage = () => {
        const urlLanguage = new URLSearchParams(window.location.search).get("lang");
        const storedLanguage = window.localStorage.getItem("tmt-language");

        if (supportedLanguages.includes(urlLanguage)) {
            return urlLanguage;
        }

        if (supportedLanguages.includes(storedLanguage)) {
            return storedLanguage;
        }

        return "en";
    };

    const setLanguage = language => {
        const activeLanguage = supportedLanguages.includes(language) ? language : "en";

        document.querySelectorAll(".en").forEach(el => {
            el.classList.toggle("hidden", activeLanguage !== "en");
        });

        document.querySelectorAll(".es").forEach(el => {
            el.classList.toggle("hidden", activeLanguage !== "es");
        });

        if (langToggle) {
            langToggle.textContent = activeLanguage === "en" ? "ES" : "EN";
        }

        window.localStorage.setItem("tmt-language", activeLanguage);
        document.documentElement.lang = activeLanguage;
    };

    const updateInternalLinks = language => {
        document.querySelectorAll("a[href]").forEach(link => {
            const rawHref = link.getAttribute("href");

            if (!rawHref || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
                return;
            }

            const url = new URL(rawHref, window.location.href);

            if (url.origin !== window.location.origin) {
                return;
            }

            url.searchParams.set("lang", language);
            link.href = `${url.pathname}${url.search}${url.hash}`;
        });
    };

    normalizeNavigation();
    setupContactInfo();

    const navLinks = document.querySelectorAll(".nav-links a");
    let currentLanguage = getCurrentLanguage();
    setLanguage(currentLanguage);
    updateInternalLinks(currentLanguage);

    if (documentType) {
        const selectedService = new URLSearchParams(window.location.search).get("service");

        if (selectedService) {
            documentType.value = selectedService;
        }
    }

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            currentLanguage = currentLanguage === "en" ? "es" : "en";
            setLanguage(currentLanguage);
            updateInternalLinks(currentLanguage);
        });
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
