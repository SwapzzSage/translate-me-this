document.addEventListener("DOMContentLoaded", () => {
    const langToggle = document.getElementById("langToggle");
    const servicesMenu = document.querySelector(".nav-dropdown");
    const servicesMenuToggles = document.querySelectorAll(".services-menu-toggle");
    const servicesOverviewLinks = document.querySelectorAll(".services-overview");
    const serviceOptions = document.querySelectorAll(".service-option");
    const documentType = document.querySelector('select[name="document-type"]');

    if (documentType) {
        const selectedService = new URLSearchParams(window.location.search).get("service");

        if (selectedService) {
            documentType.value = selectedService;
        }
    }

    langToggle.addEventListener("click", () => {
        document.querySelectorAll(".en").forEach(el => {
            el.classList.toggle("hidden");
        });

        document.querySelectorAll(".es").forEach(el => {
            el.classList.toggle("hidden");
        });

        langToggle.textContent = langToggle.textContent === "ES" ? "EN" : "ES";
    });

    servicesMenuToggles.forEach(toggle => {
        toggle.addEventListener("click", event => {
            if (window.matchMedia("(min-width: 760px)").matches) {
                return;
            }

            event.preventDefault();
            servicesMenu.classList.toggle("open");
        });
    });

    servicesOverviewLinks.forEach(link => {
        link.addEventListener("click", () => {
            servicesMenu.classList.remove("open");
        });
    });

    serviceOptions.forEach(option => {
        option.addEventListener("click", () => {
            if (documentType) {
                documentType.value = option.dataset.service;
            }
            servicesMenu.classList.remove("open");
        });
    });

    document.addEventListener("click", event => {
        if (servicesMenu && !servicesMenu.contains(event.target)) {
            servicesMenu.classList.remove("open");
        }
    });
});
