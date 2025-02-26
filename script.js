document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("TWÓJ_PUBLIC_KEY"); // Wstaw swój EmailJS PUBLIC_KEY

    let currentStep = 0;
    const steps = document.querySelectorAll(".step");

    function showStep(step) {
        steps.forEach((s, index) => {
            s.classList.toggle("active", index === step);
        });
    }

    window.nextStep = function () {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    };

    window.prevStep = function () {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    };

    const form = document.getElementById("tax-form");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = new FormData(form);
        let textData = "";

        formData.forEach((value, key) => {
            textData += `${key}: ${value}\n`;
        });

        let blob = new Blob([textData], { type: "text/plain" });
        let filename = `${formData.get("full_name")} - rozliczenie podatkowe.txt`;

        // Pobranie pliku przez użytkownika
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        // Wysyłka pliku e-mailem
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let base64Data = reader.result.split(",")[1];

            emailjs.send("TWÓJ_SERVICE_ID", "TWÓJ_TEMPLATE_ID", {
                full_name: formData.get("full_name"),
                email_to: "podatki@kfa-finanse.nl",
                subject: filename,
                file_name: filename,
                file_data: base64Data
            })
            .then(() => {
                alert("Formularz został wysłany!");
                form.reset();
                currentStep = 0;
                showStep(currentStep);
            })
            .catch(error => {
                console.error("Błąd wysyłki e-maila:", error);
                alert("Wystąpił problem z wysyłką. Spróbuj ponownie.");
            });
        };
    });

    showStep(currentStep);
});
