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
