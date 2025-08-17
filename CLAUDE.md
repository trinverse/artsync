# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ArtSync is a static website for a company providing Software Development, Data Entry, and IT Support services. This is a traditional static website using pure HTML, CSS, and vanilla JavaScript - not a framework-based application.

## Tech Stack

- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Design System**: Material Design 3 (Material You)
- **Icons**: Font Awesome 6.5.2
- **Fonts**: Google Fonts (Roboto family)
- **Hosting**: GitHub Pages ready

## Architecture

### File Structure
- All pages are standalone HTML files in the root directory
- Single `style.css` file contains all Material Design 3 styling
- Single `script.js` file contains all JavaScript functionality
- Blog posts in `/blog/` directory
- Portfolio projects in `/portfolio/` directory

### Key Components

**Logo System** (`script.js:1-134`): Custom SVG logo generation with:
- Size variants: small (32px), medium (64px), large (128px), extra-large (256px)
- Dynamic color schemes and animations
- Used across all pages via `createLogo()` function

**Material Design 3 Implementation** (`style.css:1-500`):
- Complete color token system with CSS custom properties
- Elevation levels (0-5) with proper shadow values
- Typography scale following Material guidelines
- Component styling (cards, buttons, forms, navigation)

## Development Commands

This is a static website with no build process:

```bash
# Development - Open directly in browser
open index.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Deploy to GitHub Pages
git add .
git commit -m "Your commit message"
git push origin main
```

## Development Guidelines

### When Adding New Pages
1. Copy the structure from an existing page (e.g., `about.html`)
2. Maintain consistent navigation across all pages
3. Include the logo system by calling `createLogo()` in script tags
4. Follow Material Design 3 color and component patterns

### Styling Conventions
- All styles go in `style.css` - do not use inline styles
- Use existing Material Design tokens (e.g., `var(--md-sys-color-primary)`)
- Maintain mobile-first responsive design
- Test on multiple screen sizes

### JavaScript Conventions
- All scripts go in `script.js` - avoid inline JavaScript
- Use the existing logo system for any logo displays
- Form submissions should provide user feedback
- Maintain smooth animations and transitions

### Content Updates
- Employee information: Update in `employees.html`
- Services: Modify cards in `services.html`
- Portfolio: Add new HTML files in `/portfolio/` directory
- Blog: Add new HTML files in `/blog/` directory

## Testing Checklist

Before committing changes:
- [ ] Test on mobile viewport (< 768px)
- [ ] Test on tablet viewport (768px - 1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify logo displays correctly
- [ ] Check navigation works on all pages
- [ ] Ensure Material Design colors are consistent
- [ ] Test any forms or interactive elements

## Deployment

The site is configured for GitHub Pages:
1. Repository: `git@github.com:trinverse/artsync.git`
2. Push changes to `main` branch
3. GitHub Pages will automatically deploy from `main` branch

## Important Notes

- This is NOT a React/Next.js/Node.js project - no npm/yarn commands needed
- No build process or bundling required
- All assets are loaded via CDN (Font Awesome, Google Fonts)
- Forms currently use JavaScript alerts - integrate with backend service when needed
- SEO meta tags are present but can be enhanced in each page's `<head>` section