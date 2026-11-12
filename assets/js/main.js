
/* ==========================================
   ALVAROCEAN — MAIN JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* HEADER */

    const header = document.querySelector(".ao-header");

    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 50
        );
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* MENÚ MÓVIL */

    const toggle = document.querySelector(
        ".ao-menu-toggle, .menu-toggle"
    );

    const nav = document.querySelector(
        ".ao-nav, .site-nav"
    );

    if (toggle && nav) {

        const setMenuState = (open) => {

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

            toggle.setAttribute(
                "aria-label",
                open ? "Cerrar menú" : "Abrir menú"
            );

            nav.classList.toggle("is-open", open);

            if (header) {
                header.classList.toggle("is-menu-open", open);
            }

            document.body.classList.toggle(
                "ao-menu-open",
                open
            );
        };

        toggle.addEventListener("click", () => {
            const open =
                toggle.getAttribute("aria-expanded") !== "true";

            setMenuState(open);
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setMenuState(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 767) {
                setMenuState(false);
            }
        });
    }


    /* ANIMACIONES */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }

                });
            },
            { threshold: 0.08 }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    }


    /* FILTROS PORTFOLIO */

    const filters = document.querySelectorAll(".filter");
    const cards = document.querySelectorAll(".work-card");

    filters.forEach(button => {

        button.addEventListener("click", () => {

            const category = button.dataset.filter;

            filters.forEach(filter => {
                const active = filter === button;

                filter.classList.toggle("is-active", active);

                filter.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });

            cards.forEach(card => {
                card.hidden =
                    category !== "all" &&
                    card.dataset.category !== category;
            });

        });
    });

    /* CONFIRMACIÓN DEL FORMULARIO */

    const contactModal = document.querySelector(".ao-contact-modal");
    const closeContactModal = contactModal?.querySelector(".ao-contact-modal__close");

    if (contactModal) {
        requestAnimationFrame(() => contactModal.classList.add("is-visible"));

        const hideContactModal = () => {
            contactModal.classList.remove("is-visible");
        };

        closeContactModal?.addEventListener("click", hideContactModal);
        contactModal.addEventListener("click", event => {
            if (event.target === contactModal) hideContactModal();
        });

        window.setTimeout(hideContactModal, 7000);
    }

    /* FORMULARIO DE DEMO: GitHub Pages no ejecuta PHP. */
    const demoForm = document.querySelector("#ao-contact-form");
    const demoNotice = document.querySelector(".ao-demo-form-notice");

    demoForm?.addEventListener("submit", event => {
        event.preventDefault();
        if (!demoNotice) return;
        demoNotice.hidden = false;
        demoNotice.textContent = "Esta es una demo visual. El formulario se activará en la web oficial.";
        demoNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    /* VÍDEOS DE WORK */
    const videoModal = document.querySelector("#ao-video-modal");
    const videoFrame = videoModal?.querySelector("iframe");
    const videoClose = videoModal?.querySelector(".ao-video-modal__close");
    const videoTitle = videoModal?.querySelector(".ao-video-modal__title");

    const closeVideo = () => {
        if (!videoModal || !videoFrame) return;
        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("ao-video-open");
        window.setTimeout(() => {
            videoModal.hidden = true;
            videoFrame.src = "";
        }, 250);
    };

    document.querySelectorAll(".work-video").forEach(card => {
        card.addEventListener("click", event => {
            event.preventDefault();
            if (!videoModal || !videoFrame) return;
            const videoId = card.dataset.video;
            const start = card.dataset.start ? `&start=${card.dataset.start}` : "";
            const label = card.getAttribute("aria-label")?.replace(/^Ver vídeo /, "") || "Vídeo del proyecto";
            videoFrame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0${start}`;
            videoFrame.title = label;
            if (videoTitle) videoTitle.textContent = label;
            videoModal.hidden = false;
            videoModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("ao-video-open");
            requestAnimationFrame(() => videoModal.classList.add("is-open"));
            videoClose?.focus();
        });
    });

    videoClose?.addEventListener("click", closeVideo);
    videoModal?.addEventListener("click", event => {
        if (event.target === videoModal) closeVideo();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && videoModal?.classList.contains("is-open")) closeVideo();
    });

});
