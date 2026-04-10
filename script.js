/**
 * ArtSync Interactive Logic
 * Handles theme switching, mobile navigation, and UI interactions.
 */

// --- Theme Management ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Add transition class after initial load to prevent flash
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 100);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Theme toggle buttons
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, section h1, section h2').forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });

    // Scroll-to-top button logic
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// --- Notifications ---
window.showNotification = function (message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 12px;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="color: var(--color-primary);"></i>
        <span style="font-weight: 500;">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
};

// Add necessary animations to CSS via JS if missing
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .reveal-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
