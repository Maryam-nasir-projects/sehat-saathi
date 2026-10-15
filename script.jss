/* ==========================================
   SEHAT SAATHI - JAVASCRIPT
   Hospital Search, Filters & Appointment Forms
   ========================================== */

(() => {
    "use strict";

    // Helper functions
    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    // Safely load saved demo requests
    function safeGet(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch {
            return [];
        }
    }

    // Safely save demo requests
    function safeSave(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================

    const menuToggle = $("#menuToggle");
    const nav = $("#primaryNav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        $$("a", nav).forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );
            });
        });

        document.addEventListener("click", event => {
            if (
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // 2. HOSPITAL SEARCH AND FILTERS
    // ==========================================

    const hospitalCards = $$(".hospital-card");
    const hospitalSearch = $("#hospitalSearch");
    const hospitalFilter = $("#hospitalFilter");
    const hospitalCount = $("#hospitalCount");
    const emptyState = $("#emptyState");
    const hospitalSelect = $("#appointmentHospital");

    // Get hospital names from the HTML cards
    const hospitals = hospitalCards.map(card => ({
        name: $("h3", card)?.textContent.trim() || "",
        type: card.dataset.type || "all",
        search: card.dataset.search || ""
    })).filter(hospital => hospital.name);

    // Add hospital names to the appointment dropdown
    if (hospitalSelect) {
        hospitals.forEach(hospital => {
            const alreadyExists = [...hospitalSelect.options].some(
                option => option.value === hospital.name
            );

            if (!alreadyExists) {
                const option = document.createElement("option");

                option.value = hospital.name;
                option.textContent = hospital.name;

                hospitalSelect.appendChild(option);
            }
        });
    }

    // Filter hospital cards
    function filterHospitals() {
        const searchTerm = (
            hospitalSearch?.value || ""
        ).trim().toLowerCase();

        const selectedType = hospitalFilter?.value || "all";
        let visibleCount = 0;

        hospitalCards.forEach(card => {
            const searchableText = (
                (card.dataset.search || "") + " " +
                card.textContent
            ).toLowerCase();

            const matchesSearch =
                searchableText.includes(searchTerm);

            const matchesType =
                selectedType === "all" ||
                card.dataset.type === selectedType;

            const shouldShow = matchesSearch && matchesType;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        if (hospitalCount) {
            hospitalCount.textContent = visibleCount;
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    hospitalSearch?.addEventListener(
        "input",
        filterHospitals
    );

    hospitalFilter?.addEventListener(
        "change",
        filterHospitals
    );

    // ==========================================
    // 3. BOOK APPOINTMENT BUTTONS
    // ==========================================

    $$(".book-hospital").forEach(button => {
        button.addEventListener("click", () => {
            const hospitalName = button.dataset.hospital || "";

            if (hospitalSelect) {
                const matchingOption = [...hospitalSelect.options]
                    .find(option => option.value === hospitalName);

                if (matchingOption) {
                    hospitalSelect.value = hospitalName;
                }
            }

            const appointmentSection = $("#appointment");

            appointmentSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setTimeout(() => {
                hospitalSelect?.focus({
                    preventScroll: true
                });
            }, 450);
        });
    });

    // ==========================================
    // 4. SET MINIMUM APPOINTMENT DATE
    // ==========================================

    const dateInput = $("#appointmentDate");

    function setMinimumDate() {
        if (!dateInput) return;

        const today = new Date();

        const localDate = new Date(
            today.getTime() -
            today.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 10);

        dateInput.min = localDate;
    }

    setMinimumDate();

    // ==========================================
    // 5. CURRENT YEAR IN FOOTER
    // ==========================================

    const yearElement = $("#currentYear");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

    // ==========================================
    // 6. TOAST NOTIFICATION
    // ==========================================

    let toastTimer;

    function toast(message) {
        const toastElement = $("#toast");

        if (!toastElement) return;

        toastElement.textContent = message;
        toastElement.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toastElement.classList.remove("show");
        }, 3400);
    }

    // ==========================================
    // 7. FORM MESSAGE
    // ==========================================

    function showMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.className = `form-message ${type}`;
    }

    // Generate a reference number
    function makeReference(prefix) {
        return (
            prefix + "-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36)
                .slice(2, 6).toUpperCase()
        );
    }

    // ==========================================
    // 8. APPOINTMENT REQUEST FORM
    // ==========================================

    const appointmentForm = $("#appointmentForm");

    appointmentForm?.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!appointmentForm.reportValidity()) {
                return;
            }

            const formData = Object.fromEntries(
                new FormData(appointmentForm).entries()
            );

            const requests = safeGet(
                "sehatSaathiAppointmentRequests"
            );

            const request = {
                reference: makeReference("SS"),
                ...formData,
                createdAt: new Date().toISOString(),
                status: "Demo request saved locally"
            };

            requests.push(request);

            const saved = safeSave(
                "sehatSaathiAppointmentRequests",
                requests
            );

            if (!saved) {
                showMessage(
                    $("#appointmentMessage"),
                    "Unable to save the request in this browser. Please try again.",
                    "error"
                );

                return;
            }

            showMessage(
                $("#appointmentMessage"),
                `Your demo request has been saved on this device. Reference: ${request.reference}. This is not a confirmed booking. Contact the hospital to confirm availability.`,
                "success"
            );

            toast("Appointment request saved on this device.");

            appointmentForm.reset();
            setMinimumDate();
        }
    );

    // ==========================================
    // 9. ONLINE CONSULTATION FORM
    // ==========================================

    const consultationForm = $("#consultationForm");

    consultationForm?.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!consultationForm.reportValidity()) {
                return;
            }

            const formData = Object.fromEntries(
                new FormData(consultationForm).entries()
            );

            const enquiries = safeGet(
                "sehatSaathiConsultationEnquiries"
            );

            const enquiry = {
                reference: makeReference("ENQ"),
                ...formData,
                createdAt: new Date().toISOString()
            };

            enquiries.push(enquiry);

            const saved = safeSave(
                "sehatSaathiConsultationEnquiries",
                enquiries
            );

            if (!saved) {
                showMessage(
                    $("#consultationMessage"),
                    "Unable to save your enquiry. Please try again.",
                    "error"
                );

                return;
            }

            showMessage(
                $("#consultationMessage"),
                `Your demo enquiry has been saved on this device. Reference: ${enquiry.reference}. No doctor has received this enquiry.`,
                "success"
            );

            toast("Consultation enquiry saved on this device.");

            consultationForm.reset();
        }
    );

})();
