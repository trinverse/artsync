// Theme Toggle Functionality
function initTheme() {
    // Check for system theme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference, or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            // Only update if user hasn't manually set a preference
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
    
    // Update body class for smooth transition after initial load
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 100);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Trigger animation on toggle button
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        toggleBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            toggleBtn.style.transform = '';
        }, 300);
    }
}

// Initialize theme on page load
initTheme();

// ArtSync Logo Component
function createArtSyncLogo(options = {}) {
    const {
        size = 40,
        primaryColor = '#4A55A2',
        accentColor = '#DDE0FF',
        showText = true,
        className = 'artsync-logo'
    } = options;
    
    const logoContainer = document.createElement('div');
    logoContainer.className = className;
    logoContainer.style.display = 'inline-flex';
    logoContainer.style.alignItems = 'center';
    logoContainer.style.gap = '8px';
    
    // Create SVG logo icon
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', size);
    svgIcon.setAttribute('height', size);
    svgIcon.setAttribute('viewBox', '0 0 48 48');
    svgIcon.setAttribute('fill', 'none');
    
    // Main circular background with gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'artSyncGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', primaryColor);
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#745470');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svgIcon.appendChild(defs);
    
    // Main circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '24');
    circle.setAttribute('cy', '24');
    circle.setAttribute('r', '22');
    circle.setAttribute('fill', 'url(#artSyncGradient)');
    svgIcon.appendChild(circle);
    
    // Sync arrows (circular)
    const syncPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    syncPath.setAttribute('d', 'M16 12 C20 8, 28 8, 32 12 L30 14 M32 36 C28 40, 20 40, 16 36 L18 34');
    syncPath.setAttribute('stroke', 'white');
    syncPath.setAttribute('stroke-width', '2.5');
    syncPath.setAttribute('stroke-linecap', 'round');
    syncPath.setAttribute('fill', 'none');
    svgIcon.appendChild(syncPath);
    
    // Code brackets
    const leftBracket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leftBracket.setAttribute('d', 'M14 18 L10 22 L14 26');
    leftBracket.setAttribute('stroke', 'white');
    leftBracket.setAttribute('stroke-width', '2');
    leftBracket.setAttribute('stroke-linecap', 'round');
    leftBracket.setAttribute('fill', 'none');
    svgIcon.appendChild(leftBracket);
    
    const rightBracket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rightBracket.setAttribute('d', 'M34 18 L38 22 L34 26');
    rightBracket.setAttribute('stroke', 'white');
    rightBracket.setAttribute('stroke-width', '2');
    rightBracket.setAttribute('stroke-linecap', 'round');
    rightBracket.setAttribute('fill', 'none');
    svgIcon.appendChild(rightBracket);
    
    // Center data/grid icon
    const dataGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // Small rectangles representing data
    const positions = [
        {x: 20, y: 20}, {x: 24, y: 20}, {x: 28, y: 20},
        {x: 20, y: 24}, {x: 24, y: 24}, {x: 28, y: 24}
    ];
    
    positions.forEach(pos => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', pos.x);
        rect.setAttribute('y', pos.y);
        rect.setAttribute('width', '2');
        rect.setAttribute('height', '2');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('opacity', '0.8');
        dataGrid.appendChild(rect);
    });
    svgIcon.appendChild(dataGrid);
    
    // Small gear icon (IT Support)
    const gear = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    gear.setAttribute('cx', '38');
    gear.setAttribute('cy', '10');
    gear.setAttribute('r', '6');
    gear.setAttribute('fill', accentColor);
    gear.setAttribute('stroke', primaryColor);
    gear.setAttribute('stroke-width', '1');
    svgIcon.appendChild(gear);
    
    // Gear teeth
    const gearTeeth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gearTeeth.setAttribute('d', 'M38 6 L38 4 M42 10 L44 10 M38 14 L38 16 M34 10 L32 10');
    gearTeeth.setAttribute('stroke', primaryColor);
    gearTeeth.setAttribute('stroke-width', '1');
    gearTeeth.setAttribute('stroke-linecap', 'round');
    svgIcon.appendChild(gearTeeth);
    
    logoContainer.appendChild(svgIcon);
    
    // Add text if requested
    if (showText) {
        const textElement = document.createElement('span');
        textElement.textContent = 'ArtSync';
        textElement.style.fontWeight = '700';
        textElement.style.fontSize = `${size * 0.6}px`;
        textElement.style.color = primaryColor;
        textElement.style.fontFamily = 'Roboto, sans-serif';
        textElement.style.letterSpacing = '1px';
        logoContainer.appendChild(textElement);
    }
    
    return logoContainer;
}

// Initialize logos when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Aggressive cleanup of any logos in hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        // Remove any existing logos
        const allLogos = heroSection.querySelectorAll('.artsync-logo, .hero-logo-container, [class*="logo"]');
        allLogos.forEach(element => {
            // Don't remove the word "logo" from text content, only actual logo elements
            if (element.querySelector('svg') || element.id?.includes('logo')) {
                element.remove();
            }
        });
        
        // Prevent any future logos from being added to hero
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList?.contains('artsync-logo') || 
                            node.classList?.contains('hero-logo-container') ||
                            node.id?.includes('logo')) {
                            node.remove();
                        }
                    }
                });
            });
        });
        
        observer.observe(heroSection, { childList: true, subtree: true });
    }
    
    // Replace header logo
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
        const logo = createArtSyncLogo({
            size: 42,
            showText: true,
            className: 'artsync-logo header-logo'
        });
        headerLogo.innerHTML = '';
        headerLogo.appendChild(logo);
    }
    
    // Add logo to footer
    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo) {
        const logo = createArtSyncLogo({
            size: 28,
            showText: true,
            className: 'artsync-logo footer-logo',
            primaryColor: '#4A55A2'
        });
        footerLogo.innerHTML = '';
        footerLogo.appendChild(logo);
    }
});

// Form handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

