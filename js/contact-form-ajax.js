// Oznaczenie, że skrypt contact-form-ajax.js został załadowany
window.contactFormAjaxLoaded = true;

// Inicjalizacja formularza kontaktowego z Ajax
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  // Dodanie obsługi zdarzenia wysyłania formularza
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Pobranie wartości z pól formularza
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Przyciski formularza
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    // Zmiana tekstu przycisku podczas wysyłania
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Wysyłanie...";

    // Dane do wysłania
    const formData = {
      name: name,
      email: email,
      phone: phone,
      subject: subject,
      message: message,
    };

    // Wysłanie żądania AJAX
    fetch("process-form.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          showNotification(data.message, "success");
          contactForm.reset();
        } else {
          showNotification(data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification(
          "Wystąpił błąd podczas wysyłania wiadomości. Prosimy spróbować ponownie.",
          "error"
        );
      })
      .finally(() => {
        // Przywróć oryginalny tekst przycisku
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
  });
}

// Funkcja do wyświetlania powiadomień
function showNotification(message, type) {
  // Sprawdź, czy notyfikacja już istnieje i usuń ją
  const existingNotification = document.querySelector(".form-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Stwórz element notyfikacji
  const notification = document.createElement("div");
  notification.className = `form-notification ${type}`;

  // Dodaj treść powiadomienia (bez ikony - ikona będzie dodana przez CSS ::before)
  notification.textContent = message;

  // Dodaj przycisk zamykania
  const closeBtn = document.createElement("span");
  closeBtn.className = "close-btn";
  closeBtn.innerHTML = "×";
  closeBtn.addEventListener("click", () => {
    notification.classList.add("hiding");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  notification.appendChild(closeBtn);

  // Dodaj notyfikację do formularza
  const formContainer = document.querySelector(".contact-form");
  formContainer.appendChild(notification);

  // Automatycznie usuń notyfikację po 5 sekundach
  setTimeout(() => {
    notification.classList.add("hiding");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

// Po załadowaniu dokumentu
document.addEventListener("DOMContentLoaded", function () {
  // Inicjalizacja formularza
  initContactForm();
});
