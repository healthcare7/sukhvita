//========================================//
//script for book service from index page //
//========================================//

document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".form-step");
    const circles = document.querySelectorAll(".step-circle");
    const serviceSelect = document.getElementById("serviceSelect");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("appointmentForm");
    const toast = document.getElementById("successToast");
    const modal = document.getElementById("appointmentModal");
    let currentStep = 0;

    // ✅ Getting element ID
    const nameInput = document.getElementById("nameInput");
    const phoneInput = document.getElementById("phoneInput");
    const emailInput = document.getElementById("emailInput");
    const cityInput = document.getElementById("citySelect");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    const serviceInput = document.getElementById("serviceSelect");

    function showStep(index) {
        steps.forEach((step, i) => step.classList.toggle("active", i === index));
        circles.forEach((circle, i) => circle.classList.toggle("active", i <= index));
        currentStep = index;
    }

    function validateStep(stepIndex) {
        let valid = true;
        const inputs = steps[stepIndex].querySelectorAll("input, select");
        inputs.forEach(input => {
            const errorDiv = input.parentElement.querySelector(".error-message");

            // Manual check for City dropdown
            if (input.id === "citySelect" && input.selectedIndex === 0) {
                errorDiv.textContent = "Please select a city";
                valid = false;
            }
            // Manual check for Service dropdown (optional here, but keeps consistency)
            else if (input.id === "serviceSelect" && input.selectedIndex === 0) {
                errorDiv.textContent = "Please select a service";
                valid = false;
            }
            // Normal validation for other fields
            else if (!input.checkValidity()) {
                valid = false;
                if (input.type === "text") errorDiv.textContent = "Please enter your name";
                else if (input.type === "tel") errorDiv.textContent = "Please enter your phone number";
                else if (input.type === "email" && input.value !== "") errorDiv.textContent = "Please enter a valid email";
                else if (input.type === "date") errorDiv.textContent = "Please select a date";
                else if (input.type === "time") errorDiv.textContent = "Please select a time";
            } else {
                errorDiv.textContent = "";
            }
        });
        return valid;
    }


    document.querySelectorAll(".next-step").forEach(btn => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) showStep(currentStep + 1);
        });
    });

    document.querySelectorAll(".prev-step").forEach(btn => {
        btn.addEventListener("click", () => showStep(currentStep - 1));
    });

    // Reset form on modal close
    modal.addEventListener("hidden.bs.modal", () => {
        form.reset();
        document.querySelectorAll(".error-message").forEach(e => e.textContent = "");
        showStep(0);
    });

    // Submit with service validation + toast
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        // Extra check for service field
        if (serviceSelect.selectedIndex === 0) {
            const errorDiv = serviceSelect.parentElement.querySelector(".error-message");
            errorDiv.textContent = "Please select a service";
            return; // stop submission
        }

        //You can replace following code to store data in database
        //---------- Send data to Google Sheet Start -----------//
        // Send data to Google Sheet (no-cors mode)
        const data = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value || "Not provided",
            city: citySelect.value,
            date: dateInput.value,
            time: timeInput.value,
            service: serviceSelect.value
        };

        fetch("https://script.google.com/macros/s/AKfycbxmwe31zZvNAYoSh65kjQH926KPKqDJKaZM21Dr0aDumM6AURv1fYi1sEnOxXzoj9xR/exec", {
            method: "POST",
            mode: "no-cors",   // ✅ prevents CORS error
            body: JSON.stringify(data)
        });

        // You won’t get a readable response back, but the row will be added in Google Sheet.


        //---------- Send data to Google Sheet End -----------//

        // Show toast with slight delay after modal closes
        setTimeout(() => {
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 4000); // toast visible for 4s
        }, 300); // delay 300ms after modal close
        //tost end 
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });

    showStep(0);
});