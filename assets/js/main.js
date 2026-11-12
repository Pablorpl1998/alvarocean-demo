
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
                platform: "ALVAROCEAN / TRABAJO",
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
            html: `<h3>1. Datos identificativos</h3><p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y del comercio electrónico (LSSI-CE), se informa de que la titularidad de este sitio web corresponde a <strong>Álvaro Pita Ramírez</strong>.</p><p><strong>NIF:</strong> 53769248D<br><strong>Domicilio:</strong> C/ Pablo Picasso Nº7<br><strong>Email:</strong> info@alvarocean.com<br><strong>Teléfono:</strong> 655 587 255</p><h3>2. Objeto y condiciones de uso</h3><p>El sitio ofrece información sobre los servicios audiovisuales, proyectos y formas de contacto de Alvarocean. El acceso es gratuito, sin perjuicio del coste de conexión del usuario. El usuario se compromete a utilizar el sitio de forma lícita, diligente y respetuosa con los derechos de terceros.</p><h3>3. Propiedad intelectual</h3><p>Las fotografías, vídeos, textos, logotipos, diseño, código y demás contenidos del sitio están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución, transformación o comunicación pública sin autorización, salvo los usos permitidos legalmente.</p><h3>4. Responsabilidad</h3><p>Se procurará mantener la disponibilidad y exactitud del sitio, pero no se garantiza la ausencia de interrupciones, errores o contenidos de terceros. Los enlaces externos se facilitan como referencia y se rigen por las condiciones y políticas de sus respectivos titulares.</p><h3>5. Legislación aplicable</h3><p>La relación con el usuario se regirá por la legislación española. Para cualquier cuestión, serán competentes los juzgados y tribunales que correspondan conforme a la normativa aplicable.</p>`
        },
        cookies: {
            title: "Política de cookies",
            html: `<h3>1. Qué son las cookies</h3><p>Las cookies son pequeños archivos que un sitio web puede almacenar en el dispositivo del usuario para recordar información técnica o mejorar la navegación.</p><h3>2. Cookies utilizadas en esta landing</h3><p>Esta landing no instala actualmente cookies propias de analítica, publicidad ni seguimiento. No se ha integrado Google Analytics, Meta Pixel ni una herramienta equivalente. Google Search Console se utiliza para consultar el rendimiento del sitio desde el panel del propietario y no para instalar cookies de analítica en esta landing.</p><p>El formulario se gestiona mediante el sistema y el plugin de formularios configurados para el sitio. La gestión del envío y almacenamiento de los datos del formulario se describe en la Política de privacidad.</p><h3>3. Contenido de terceros</h3><p>Los vídeos de Work se cargan desde YouTube cuando el usuario los solicita y los enlaces sociales dirigen a Instagram. Estos servicios pueden aplicar sus propias cookies y políticas cuando el usuario interactúa con ellos fuera o dentro de sus plataformas.</p><h3>4. Gestión y cambios</h3><p>El usuario puede bloquear o eliminar cookies desde la configuración de su navegador. Si en el futuro se incorporan cookies no necesarias, analítica, publicidad o integraciones de terceros, se actualizará esta política y se habilitará un mecanismo de consentimiento previo con opciones visibles para aceptar o rechazar.</p>`
        },
        privacy: {
            title: "Política de privacidad",
            html: `<h3>1. Responsable</h3><p><strong>Álvaro Pita Ramírez</strong> · NIF 53769248D<br><strong>Domicilio:</strong> C/ Pablo Picasso Nº7<br><strong>Email:</strong> info@alvarocean.com<br><strong>Teléfono:</strong> 655 587 255</p><h3>2. Datos tratados</h3><p>A través del formulario pueden tratarse nombre, email, teléfono, tipo de proyecto y el contenido del mensaje. Solo deben facilitarse datos adecuados y necesarios para gestionar la consulta o solicitud de presupuesto.</p><h3>3. Finalidades y base jurídica</h3><p>Los datos se tratarán para atender consultas, responder solicitudes, preparar presupuestos y mantener las comunicaciones relacionadas con el proyecto. La base jurídica es el consentimiento del usuario, que se solicita mediante la casilla de aceptación y puede retirarse en cualquier momento.</p><h3>4. Conservación y destinatarios</h3><p>Los datos se conservarán durante el tiempo necesario para atender la solicitud y, como máximo, durante 18 meses, salvo que exista una obligación legal o sea necesario conservarlos para formular, ejercer o defender reclamaciones.</p><p>Los datos se almacenarán en el plugin de gestión de formularios instalado en el sitio y podrán ser tratados por el proveedor de hosting, correo electrónico y soporte técnico, únicamente en la medida necesaria para prestar esos servicios y bajo las garantías exigibles. No se venderán datos ni se utilizarán para publicidad de terceros.</p><h3>5. Transferencias y decisiones automatizadas</h3><p>No se realizan decisiones automatizadas ni elaboración de perfiles con los datos del formulario. Si algún proveedor técnico tratara datos fuera del Espacio Económico Europeo, deberán aplicarse las garantías previstas por la normativa de protección de datos.</p><h3>6. Derechos</h3><p>El usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar su consentimiento, escribiendo a <a href="mailto:info@alvarocean.com">info@alvarocean.com</a>. Puede solicitar también información sobre el tratamiento y sus destinatarios.</p><h3>7. Reclamaciones</h3><p>Si considera que el tratamiento no se ajusta a la normativa, puede reclamar ante la Agencia Española de Protección de Datos: <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">aepd.es</a>.</p><h3>8. Seguridad y actualización</h3><p>Se aplicarán medidas técnicas y organizativas razonables para proteger la información. Esta política podrá actualizarse cuando cambien los tratamientos, los proveedores o la normativa aplicable.</p>`
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
