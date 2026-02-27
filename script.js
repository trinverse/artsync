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
function trimTransparentPadding(imageElement) {
    const handleImageLoad = () => {
        if (imageElement.dataset.trimmed === 'true') {
            imageElement.removeEventListener('load', handleImageLoad);
            return;
        }

        const sourceWidth = imageElement.naturalWidth;
        const sourceHeight = imageElement.naturalHeight;

        if (!sourceWidth || !sourceHeight) {
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.drawImage(imageElement, 0, 0);
        const imageData = context.getImageData(0, 0, sourceWidth, sourceHeight);
        const pixels = imageData.data;

        let minX = sourceWidth;
        let minY = sourceHeight;
        let maxX = 0;
        let maxY = 0;
        let hasVisiblePixels = false;

        for (let y = 0; y < sourceHeight; y++) {
            for (let x = 0; x < sourceWidth; x++) {
                const alpha = pixels[(y * sourceWidth + x) * 4 + 3];
                if (alpha > 0) {
                    hasVisiblePixels = true;
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (!hasVisiblePixels) {
            return;
        }

        const trimmedWidth = maxX - minX + 1;
        const trimmedHeight = maxY - minY + 1;

        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = trimmedWidth;
        trimmedCanvas.height = trimmedHeight;

        const trimmedContext = trimmedCanvas.getContext('2d');
        if (!trimmedContext) {
            return;
        }

        trimmedContext.putImageData(context.getImageData(minX, minY, trimmedWidth, trimmedHeight), 0, 0);

        imageElement.dataset.trimmed = 'true';
        imageElement.src = trimmedCanvas.toDataURL('image/png');
    };

    imageElement.addEventListener('load', handleImageLoad);
    if (imageElement.complete && imageElement.naturalWidth > 0) {
        handleImageLoad();
    }
}

function createArtSyncLogo(options = {}) {
    const {
        size = 40,
        showText = true,
        className = 'artsync-logo'
    } = options;
    
    const logoContainer = document.createElement('div');
    logoContainer.className = className;
    logoContainer.style.display = 'inline-flex';
    logoContainer.style.alignItems = 'center';
    logoContainer.style.gap = '8px';

    const scriptElement = document.querySelector('script[src$="script.js"]');
    const logoSource = scriptElement
        ? new URL('artsync-logo.png', scriptElement.src).href
        : 'artsync-logo.png';

    const logoImage = document.createElement('img');
    logoImage.src = logoSource;
    logoImage.alt = 'ArtSync';
    logoImage.className = 'artsync-logo-image';
    logoImage.style.height = `${size}px`;
    logoImage.style.width = 'auto';
    logoImage.style.display = 'block';

    trimTransparentPadding(logoImage);

    logoContainer.appendChild(logoImage);

    if (!showText) {
        logoImage.alt = 'ArtSync logo';
    }
    
    return logoContainer;
}

// Initialize logos when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Aggressive cleanup of any logos in hero section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroLogo = heroSection.querySelector('.hero-graphic-logo');
        if (heroLogo) {
            trimTransparentPadding(heroLogo);
        }

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
            size: 44,
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
            size: 32,
            showText: true,
            className: 'artsync-logo footer-logo',
            primaryColor: '#226db0'
        });
        footerLogo.innerHTML = '';
        footerLogo.appendChild(logo);
    }
});

// Notification function for form submissions
window.showNotification = function(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}



