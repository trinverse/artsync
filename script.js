/**
 * ArtSync Interactive Logic
 * Handles global theme synchronization, high-performance UI interactions, and operational telemetry.
 */

// --- Theme Orchestration ---
function synchronizeTheme() {
    const activeTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // Smooth architectural appearance
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 150);
}

function executeThemeTransition() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    
    // Update theme toggle icons if needed
    updateToggleIcons(targetTheme);
}

function updateToggleIcons(theme) {
    const sunIcons = document.querySelectorAll('.fa-sun');
    sunIcons.forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// --- Initialization Hub ---
document.addEventListener('DOMContentLoaded', () => {
    synchronizeTheme();
    
    // Theme triggers
    const themeTriggers = document.querySelectorAll('.theme-toggle');
    themeTriggers.forEach(trigger => {
        trigger.addEventListener('click', executeThemeTransition);
    });

    // High-precision scroll observation
    const detectionOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((detects) => {
        detects.forEach(detect => {
            if (detect.isIntersecting) {
                detect.target.classList.add('visible');
                scrollObserver.unobserve(detect.target);
            }
        });
    }, detectionOptions);

    document.querySelectorAll('.glass-card, section h1, section h2, .badge, .project-card').forEach(nexus => {
        nexus.classList.add('reveal-on-scroll');
        scrollObserver.observe(nexus);
    });

    // Automated Ascent Logic
    const ascentBtn = document.getElementById('scroll-top');
    if (ascentBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                ascentBtn.classList.add('visible');
            } else {
                ascentBtn.classList.remove('visible');
            }
        });

        ascentBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// --- System Transmissions ---
window.initiateTransmissionNotice = function (content, classification = 'success') {
    const notice = document.createElement('div');
    notice.className = `notice ${classification}`;
    notice.style.cssText = `
        position: fixed;
        bottom: 3rem;
        right: 3rem;
        padding: 1.25rem 2.5rem;
        border-radius: 16px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-neon);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        animation: ingress 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    notice.innerHTML = `
        <i class="fas ${classification === 'success' ? 'fa-shield-halved' : 'fa-triangle-exclamation'}" style="color: var(--color-primary); font-size: 1.5rem;"></i>
        <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 800; font-family: 'Outfit'; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; color: var(--color-primary);">System Notice</span>
            <span style="font-weight: 600; color: var(--color-text-main);">${content}</span>
        </div>
    `;

    document.body.appendChild(notice);

    setTimeout(() => {
        notice.style.animation = 'egress 0.5s forwards';
        setTimeout(() => notice.remove(), 500);
    }, 5000);
};

// Global styles for notice animation
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes ingress {
        from { transform: translateY(100px) scale(0.8); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes egress {
        from { transform: translateY(0) scale(1); opacity: 1; }
        to { transform: translateY(100px) scale(0.8); opacity: 0; }
    }
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(40px);
        transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .reveal-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(dynamicStyles);
