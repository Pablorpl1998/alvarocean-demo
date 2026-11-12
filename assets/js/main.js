
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
    const videoPlatform = videoModal?.querySelector("#ao-video-platform");
    const videoFallback = videoModal?.querySelector("#ao-video-fallback");
    const videoFrameWrap = videoModal?.querySelector(".ao-video-modal__frame");

    const openVideoModal = ({ src, label, fallbackHref, platform, fallbackLabel, social = false }) => {
        if (!videoModal || !videoFrame) return;
        videoFrame.src = src;
        videoFrame.title = label;
        if (videoTitle) videoTitle.textContent = label;
        if (videoPlatform) videoPlatform.textContent = platform;
        if (videoFallback) {
            videoFallback.href = fallbackHref;
            videoFallback.textContent = fallbackLabel;
        }
        videoFrameWrap?.classList.toggle("ao-video-modal__frame--social", social);
        videoModal.hidden = false;
        videoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("ao-video-open");
        requestAnimationFrame(() => videoModal.classList.add("is-open"));
        videoClose?.focus();
    };

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
            openVideoModal({
                src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0${start}`,
                label,
                fallbackHref: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
                platform: "ALVAROCEAN / WORK",
                fallbackLabel: "VER EN YOUTUBE ↗"
            });
        });
    });

    videoClose?.addEventListener("click", closeVideo);
    videoModal?.addEventListener("click", event => {
        if (event.target === videoModal) closeVideo();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && videoModal?.classList.contains("is-open")) closeVideo();
    });

    /* POLÍTICAS EN POPUP */
    const policyModal = document.querySelector("#ao-policy-modal");
    const policyTitle = policyModal?.querySelector("#ao-policy-title");
    const policyContent = policyModal?.querySelector("#ao-policy-content");
    const policyClose = policyModal?.querySelector(".ao-policy-modal__close");
    const policies = {
        legal: {
            title: "Aviso legal",
            html: `<p>En cumplimiento de la Ley 34/2002 (LSSI-CE), la titularidad de este sitio web corresponde a Álvaro Pita Ramírez.</p><p><strong>NIF:</strong> 53769248D<br><strong>Email:</strong> info@alvarocean.com<br><strong>Teléfono:</strong> 655 587 255</p><p>El acceso y uso de alvarocean.com atribuye la condición de usuario y supone la aceptación de las condiciones de uso aplicables. Los contenidos, imágenes, vídeos, textos, logotipos y demás elementos del sitio están protegidos por la normativa de propiedad intelectual.</p>`
        },
        cookies: {
            title: "Política de cookies",
            html: `<p>Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento y, si se activan servicios externos, cookies de terceros asociadas a dichos servicios.</p><p>Las cookies pueden rechazarse o eliminarse desde la configuración del navegador. El sitio seguirá siendo accesible, aunque algunas funciones podrían verse limitadas.</p><p>Antes de incorporar analítica, publicidad o integraciones que requieran consentimiento, deberá configurarse el aviso y el mecanismo de preferencias correspondiente.</p>`
        },
        privacy: {
            title: "Política de privacidad",
            html: `<p><strong>Responsable:</strong> Álvaro Pita Ramírez · NIF 53769248D<br><strong>Email:</strong> info@alvarocean.com<br><strong>Teléfono:</strong> 655 587 255<br><strong>Dirección:</strong> C/ Pablo Picasso 12</p><p>Los datos enviados mediante el formulario se tratarán para atender consultas y solicitudes de presupuesto. La base jurídica es el consentimiento del usuario, que puede retirarse en cualquier momento.</p><p>Los datos se conservarán durante el tiempo necesario para atender la solicitud y, como máximo, durante 18 meses, salvo obligación legal. El usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@alvarocean.com.</p><p>También puede reclamar ante la Agencia Española de Protección de Datos: <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">aepd.es</a>.</p>`
        }
    };

    const closePolicy = () => {
        if (!policyModal) return;
        policyModal.classList.remove("is-open");
        policyModal.setAttribute("aria-hidden", "true");
        window.setTimeout(() => { policyModal.hidden = true; }, 220);
    };

    document.querySelectorAll("[data-policy]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            const policy = policies[link.dataset.policy];
            if (!policyModal || !policy) return;
            policyTitle.textContent = policy.title;
            policyContent.innerHTML = policy.html;
            policyModal.hidden = false;
            policyModal.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() => policyModal.classList.add("is-open"));
            policyClose?.focus();
        });
    });
    policyClose?.addEventListener("click", closePolicy);
    policyModal?.addEventListener("click", event => { if (event.target === policyModal) closePolicy(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && policyModal?.classList.contains("is-open")) closePolicy(); });

});
