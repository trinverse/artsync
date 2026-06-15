/**
 * ArtSync — Futuristic UI Engine
 */

// ─── Theme ───
function synchronizeTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcons(theme);
    setTimeout(() => document.body.classList.add('theme-transition'), 100);
}

function executeThemeTransition() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcons(next);
}

function updateToggleIcons(theme) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ─── Particle Network ───
function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'fx-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], animId;

    const count = () => Math.min(80, Math.floor((w * h) / 12000));

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        const n = count();
        particles = Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
        }));
    }

    function getColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? '42, 157, 181' : '66, 201, 223';
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        const rgb = getColor();
        const linkDist = 140;

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, 0.38)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < linkDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${rgb}, ${0.1 * (1 - dist / linkDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    const observer = new MutationObserver(() => {});
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ─── Ambient Orbs ───
function initOrbs() {
    if (document.querySelector('.ambient-orbs')) return;
    const div = document.createElement('div');
    div.className = 'ambient-orbs';
    div.innerHTML = '<div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>';
    document.body.prepend(div);
}

// ─── Mobile Nav ───
function initMobileNav() {
    const header = document.querySelector('header .container');
    if (!header || document.querySelector('.menu-toggle')) return;

    const nav = header.querySelector('nav');
    const links = nav ? [...nav.querySelectorAll('a')] : [];
    const desktopToggle = header.querySelector('.theme-toggle');

    const headerActions = document.createElement('div');
    headerActions.className = 'header-actions';

    if (desktopToggle) {
        const mobileToggle = desktopToggle.cloneNode(true);
        mobileToggle.classList.add('theme-toggle-mobile');
        mobileToggle.removeAttribute('id');
        mobileToggle.setAttribute('aria-label', 'Toggle Theme');
        mobileToggle.addEventListener('click', executeThemeTransition);
        headerActions.appendChild(mobileToggle);
    }

    const btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    headerActions.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';

    const panel = document.createElement('div');
    panel.className = 'mobile-nav-panel';
    const ul = document.createElement('ul');
    links.forEach(a => {
        const li = document.createElement('li');
        li.appendChild(a.cloneNode(true));
        ul.appendChild(li);
    });
    panel.appendChild(ul);

    if (desktopToggle) {
        const themeRow = document.createElement('div');
        themeRow.className = 'mobile-nav-theme';
        themeRow.innerHTML = '<span>Appearance</span>';
        const panelToggle = desktopToggle.cloneNode(true);
        panelToggle.classList.add('theme-toggle-panel');
        panelToggle.removeAttribute('id');
        panelToggle.setAttribute('aria-label', 'Toggle Theme');
        panelToggle.addEventListener('click', executeThemeTransition);
        themeRow.appendChild(panelToggle);
        panel.appendChild(themeRow);
    }

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    header.appendChild(headerActions);

    function close() {
        btn.classList.remove('open');
        overlay.classList.remove('open');
        panel.classList.remove('open');
        document.body.style.overflow = '';
    }

    function open() {
        btn.classList.add('open');
        overlay.classList.add('open');
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    btn.addEventListener('click', () => {
        panel.classList.contains('open') ? close() : open();
    });
    overlay.addEventListener('click', close);
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ─── Header Scroll ───
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ─── Scroll Reveal ───
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.glass-card, .section-header, .stat-item').forEach(el => el.classList.add('visible'));
        return;
    }

    const variants = ['reveal-up', 'reveal-left', 'reveal-right', 'reveal-scale'];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section-header, .about-text, .footer-cta').forEach(el => {
        el.classList.add('reveal-on-scroll', 'reveal-up');
        observer.observe(el);
    });

    document.querySelectorAll('.glass-card, .project-card, .feature-card, .stat-item').forEach((el, i) => {
        el.classList.add('reveal-on-scroll', variants[i % variants.length]);
        el.style.transitionDelay = `${(i % 5) * 0.09}s`;
        observer.observe(el);
    });

    document.querySelectorAll('.reveal-stagger > *').forEach((el, i) => {
        if (el.classList.contains('reveal-on-scroll')) return;
        el.classList.add('reveal-on-scroll', 'reveal-up');
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });
}

// ─── Hero Word Reveal ───
function initHeroWordReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.hero-title').forEach(title => {
        if (title.dataset.split) return;
        title.dataset.split = '1';

        const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        let delay = 0;
        nodes.forEach(node => {
            // Don't split inside gradient spans — breaks -webkit-text-fill-color
            if (node.parentElement?.closest('.gradient-text')) return;

            const parts = node.textContent.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement('span');
                    span.className = 'word-chip';
                    span.style.animationDelay = `${delay}s`;
                    span.textContent = part;
                    frag.appendChild(span);
                    delay += 0.07;
                }
            });
            node.parentNode.replaceChild(frag, node);
        });
    });
}

// ─── Hero Parallax ───
function initHeroParallax() {
    const hero = document.getElementById('hero');
    const visual = hero?.querySelector('.hero-visual');
    if (!hero || !visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        visual.style.transform = `translate(${x * 28}px, ${y * 18}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        visual.style.transform = '';
        visual.style.transition = 'transform 0.6s ease';
        setTimeout(() => { visual.style.transition = ''; }, 600);
    });
}

// ─── Magnetic Buttons ───
function initMagneticButtons() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('btn-magnetic');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
            btn.style.setProperty('--mag-x', `${x}px`);
            btn.style.setProperty('--mag-y', `${y}px`);
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.setProperty('--mag-x', '0px');
            btn.style.setProperty('--mag-y', '0px');
        });
    });
}

// ─── Scroll Progress ───
function initScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        bar.style.width = `${pct}%`;
    }, { passive: true });
}

// ─── Page Load ───
function initPageLoad() {
    requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
    });
}

// ─── Section Line Reveal ───
function initSectionLines() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('section:not(#hero)').forEach(section => {
        section.classList.add('section-animate');
        observer.observe(section);
    });
}

// ─── Card Tilt ───
function initCardTilt() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// ─── Counter Animation ───
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = 1800;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const val = Math.round(eased * target);
                el.textContent = prefix + val + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// ─── Scroll Top ───
function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Toast Notice ───
window.initiateTransmissionNotice = function (content, type = 'success') {
    const notice = document.createElement('div');
    notice.style.cssText = `
        position:fixed; bottom:2rem; right:2rem; z-index:3000;
        padding:1rem 1.5rem; border-radius:14px;
        background:var(--bg-card); backdrop-filter:blur(20px);
        border:1px solid var(--border); box-shadow:var(--shadow-glow);
        display:flex; align-items:center; gap:1rem;
        animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        max-width:360px;
    `;
    notice.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}" style="color:var(--primary);font-size:1.25rem;"></i>
        <span style="color:var(--text);font-weight:500;font-size:0.9rem;">${content}</span>
    `;
    document.body.appendChild(notice);
    setTimeout(() => {
        notice.style.opacity = '0';
        notice.style.transform = 'translateY(20px)';
        notice.style.transition = 'all 0.4s ease';
        setTimeout(() => notice.remove(), 400);
    }, 4500);
};

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    synchronizeTheme();

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', executeThemeTransition);
    });

    initOrbs();
    initParticles();
    initMobileNav();
    initHeaderScroll();
    initHeroWordReveal();
    initHeroParallax();
    initMagneticButtons();
    initScrollProgress();
    initSectionLines();
    initScrollReveal();
    initCardTilt();
    initCounters();
    initScrollTop();
    initPageLoad();
});
