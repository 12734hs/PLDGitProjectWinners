const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle && navLinks) {
	toggle.addEventListener("click", () => {
		const isOpen = navLinks.classList.toggle("is-open");
		toggle.setAttribute("aria-expanded", String(isOpen));
	});
}
// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    initProjectFilters();
    initContactForm();
    initScrollEffects();
}

// ==================== PROJECT FILTERING ==================== 

/**
 * Initialize project filter buttons
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            // Filter projects
            projectCards.forEach((card, index) => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.animation = 'fadeIn 0.5s ease-out';
                    }, visibleCount * 50);
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==================== CONTACT FORM ==================== 

const BOT_TOKEN = "8744924218:AAGp7Whfc6bJ1AX10xfuRETdfABZ9PAZAb8";
const CHAT_ID = "-1003990964878";

async function sendToTelegram(fullname, email, subject, message) {
    const text = `
📩 New Application:

👤 Name: ${fullname}
📧 Email: ${email}
📝 Subject: ${subject}
💬 Message: ${message}
    `;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: "HTML"
            })
        });

        return await response.json();

    } catch (error) {
        console.error("Telegram error:", error);
    }
}

/**
 * Initialize contact form handling
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!fullname || !email || !subject || !message) {
        alert('Please fill in all required fields');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

   const result = await sendToTelegram(fullname, email, subject, message);

    if (result && result.ok) {
        showSuccessMessage(fullname, email);
        e.target.reset();
    } else {
        alert("Сообщение не отправлено. Попробуй позже.");
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show success message
 */
function showSuccessMessage(name, email) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
    submitBtn.style.background = 'rgba(76, 175, 80, 0.3)';
    submitBtn.style.borderColor = '#4caf50';

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        submitBtn.style.borderColor = 'var(--bg-white)';
    }, 3000);
}

// ==================== SCROLL EFFECTS ==================== 

/**
 * Initialize scroll effects
 */
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe info cards
    document.querySelectorAll('.info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ==================== VIEW PROJECT BUTTON ==================== 

/**
 * Handle view project button clicks
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-info h3').textContent;
        alert(`Loading ${projectTitle} project details...`);
    }
});

// ==================== SMOOTH SCROLLING ==================== 

/**
 * Smooth scroll for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== UTILITY FUNCTIONS ==================== 

/**
 * Add animation styles to document
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);