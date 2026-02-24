// Inicjalizacja wszystkich komponentów strony
document.addEventListener("DOMContentLoaded", function () {
  // Płynne przewijanie do sekcji
  initSmoothScrolling();

  // Menu mobilne
  initMobileMenu();

  // Zmiana wyglądu headera podczas scrollowania
  initHeaderScrollEffect();

  // Obsługa aktywnej sekcji podczas scrollowania (tylko na stronie głównej)
  if (document.querySelectorAll("section[id]").length > 1) {
    initActiveSection();
  }

  // Portfolio filtrowanie (tylko na stronie głównej)
  if (document.querySelector(".portfolio-grid")) {
    initPortfolioFilter();
  }

  // Testimonials slider (tylko na stronie głównej)
  if (document.querySelector(".testimonials-slider")) {
    initTestimonialsSlider();
  }

  // FAQ toggle (tylko na stronie głównej)
  if (document.querySelector(".faq-container")) {
    initFaqToggle();
  }

  // Formularz kontaktowy - inicjalizacja tylko jeśli nie został załadowany skrypt contact-form-ajax.js
  if (document.getElementById("contactForm") && !window.contactFormAjaxLoaded) {
    initContactForm();
  }
});

// Płynne przewijanie do sekcji
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Zamknij menu mobilne, jeśli otwarte
        const navLinks = document.getElementById("nav-links");
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");

        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });
}

// Menu mobilne
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");

  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.innerHTML = navLinks.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
}

// Zmiana wyglądu headera podczas scrollowania
function initHeaderScrollEffect() {
  const header = document.getElementById("header");

  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Nawigacja - aktywna sekcja podczas scrollowania
function initActiveSection() {
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  });
}

// Portfolio filtrowanie
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (!filterButtons.length || !portfolioItems.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Aktywny przycisk
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// Testimonials slider
function initTestimonialsSlider() {
  const testimonials = document.getElementById("testimonials");
  const testimonialItems = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector(".prev-testimonial");
  const nextBtn = document.querySelector(".next-testimonial");

  if (!testimonials || !testimonialItems.length || !prevBtn || !nextBtn) return;

  let currentTestimonial = 0;
  const testimonialCount = testimonialItems.length;

  function showTestimonial(index) {
    testimonials.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial - 1 + testimonialCount) % testimonialCount;
    showTestimonial(currentTestimonial);
  });

  nextBtn.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCount;
    showTestimonial(currentTestimonial);
  });

  // Auto slide testimonials
  const autoSlideInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCount;
    showTestimonial(currentTestimonial);
  }, 5000);

  // Zatrzymaj auto-slide przy interakcji
  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
    });
  });
}

// FAQ toggle
function initFaqToggle() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Zamknij wszystkie aktywne elementy
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      // Jeśli kliknięty element nie był aktywny, aktywuj go
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// Formularz kontaktowy (prosta wersja, używana tylko gdy nie ma AJAX)
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;

    // Zmiana tekstu przycisku podczas wysyłania
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Wysyłanie...";

    // Symulacja wysyłania - w rzeczywistym środowisku tutaj byłoby wysyłanie na serwer
    setTimeout(() => {
      // Przywrócenie oryginalnego stanu przycisku
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Wyświetl alert i zresetuj formularz
      alert("Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.");
      contactForm.reset();
    }, 1000);
  });
}

// Obsługa dotyku dla elementów portfolio
function initPortfolioTouchSupport() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!portfolioItems.length) return;
  
  portfolioItems.forEach(item => {
    item.addEventListener('touchstart', function(e) {
      // Zapobiegaj domyślnemu zachowaniu tylko jeśli nie kliknięto przycisku
      if (!e.target.closest('a')) {
        e.preventDefault();
      }
      
      // Usuń klasę 'touched' ze wszystkich innych elementów
      portfolioItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('touched');
        }
      });
      
      // Przełącz klasę 'touched' dla klikniętego elementu
      item.classList.toggle('touched');
    });
  });
  
  // Zamknij overlay po kliknięciu poza elementem portfolio
  document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.portfolio-item')) {
      portfolioItems.forEach(item => {
        item.classList.remove('touched');
      });
    }
  });
}

// Dodaj tę funkcję do istniejących inicjalizacji
document.addEventListener("DOMContentLoaded", function () {
  // ...istniejące inicjalizacje
  initPortfolioTouchSupport();
});

// Dodaj na końcu pliku js/scripts.js
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
  const expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
});

