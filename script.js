// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTopBtn = document.getElementById('scrollToTop');
const feedbackForm = document.getElementById('feedbackForm');
const stars = document.querySelectorAll('.stars i');

// Initialize aria-expanded attribute for accessibility
hamburger.setAttribute('aria-expanded', 'false');

// Toggle mobile menu function
function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    hamburger.setAttribute('aria-expanded', isActive ? 'false' : 'true');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? '' : 'hidden';
}

// Close mobile menu function
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Toggle mobile menu on hamburger click
hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // If it's an anchor link (not external links), prevent default and smooth scroll
        if (link.getAttribute('href').startsWith('#') && 
            !link.getAttribute('href').includes('menu.html') &&
            !link.getAttribute('href').includes('reservation.html')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
        
        closeMobileMenu();
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
    
    if (!isClickInsideNav && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close mobile menu on escape key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close mobile menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to current section in viewport
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all sections with IDs
document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// Star rating functionality
if (stars.length > 0) {
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            const ratingInput = document.getElementById('rating');
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach(s => {
                const starRating = s.getAttribute('data-rating');
                if (starRating <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
        
        // Hover effect
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach(s => {
                const starRating = s.getAttribute('data-rating');
                if (starRating <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = document.getElementById('rating').value;
            stars.forEach(s => {
                const starRating = s.getAttribute('data-rating');
                if (starRating <= currentRating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Feedback form submission (CONNECTED TO BACKEND)
if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('fname').value;
        const email = document.getElementById('femail').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const rating = document.getElementById('rating').value;

        if (rating === '0') {
            alert('Please rate your experience before submitting feedback.');
            return;
        }

        fetch("http://localhost:3000/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message,
                rating,
                date: new Date().toISOString()
            })
        })
        .then(res => res.json())
        .then(data => {
            alert("Thank you! Your feedback has been sent 🙏");
            feedbackForm.reset();

            // Reset stars
            stars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
            document.getElementById('rating').value = '0';
        })
        .catch(err => {
            console.error("Feedback error:", err);
            alert("Something went wrong. Please try again.");
        });
    });
}

// Initialize current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value
  };

  const res = await fetch("https://cactus-reservations.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.message);
});
