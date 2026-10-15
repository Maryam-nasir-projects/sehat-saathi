
document.addEventListener("DOMContentLoaded", () => {
    const appointmentDate = document.getElementById("appointmentDate");

    // Set today's date as the earliest appointment date.
    if (appointmentDate) {
        const now = new Date();

        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");

        appointmentDate.min = today;
    }

    // Appointment request form.
    const appointmentForm = document.getElementById("appointmentForm");
    const appointmentMessage =
        document.getElementById("appointmentMessage");

    if (appointmentForm && appointmentMessage) {
        appointmentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!appointmentForm.reportValidity()) return;

            appointmentMessage.textContent =
                "Your details are valid. No appointment has been booked yet. Please contact the selected hospital to confirm availability.";
        });
    }

    // Online consultation request form.
    const consultationForm = document.getElementById("consultationForm");
    const consultationMessage =
        document.getElementById("consultationMessage");

    if (consultationForm && consultationMessage) {
        consultationForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!consultationForm.reportValidity()) return;

            consultationMessage.textContent =
                "Your details are valid. Your consultation has not been requested or scheduled. Please contact the selected hospital to arrange a consultation.";
        });
    }

    // Smooth scrolling for internal navigation.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    console.log("Sehat Saathi JavaScript loaded.");
});
