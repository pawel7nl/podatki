document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tax-form");
    const submitButton = document.getElementById("submit-button");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        let formData = new FormData(form);
        let textData = "";
        
        formData.forEach((value, key) => {
            textData += `${key}: ${value}\n`;
        });
        
        let blob = new Blob([textData], { type: "text/plain" });
        let filename = `${formData.get("full_name")} - rozliczenie podatkowe.txt`;
        
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        sendEmail(filename, blob);
    });
    
    function sendEmail(filename, file) {
        let formData = new FormData();
        formData.append("to", "podatki@kfa-finanse.nl");
        formData.append("subject", filename);
        formData.append("body", "Załączam plik z danymi do rozliczenia podatkowego.");
        formData.append("attachment", file, filename);
        
        fetch("https://your-email-api-endpoint.com/send", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => alert("Plik wysłany na e-mail!"))
        .catch(error => console.error("Błąd wysyłki e-maila:", error));
    }
});
