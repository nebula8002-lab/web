# Nethra Shree — Personal Portfolio Website

An elegant, minimal, and modern personal portfolio website for **Nethra Shree**, an aspiring Artificial Intelligence & Machine Learning engineer pursuing B.Tech at SRM Institute of Science and Technology, Ramapuram, Chennai (2026–2030).

## Design System & Colour Palette

| Element | Color Hex | Color Name | Role |
| :--- | :--- | :--- | :--- |
| **Background** | `#FCF9EA` | Warm Cream | Dominant backdrop for clean, editorial breathing room |
| **Hero Heading** | `#DB9558` | Muted Caramel | Distinctive display typography |
| **Main Content** | `#A8BBA3` | Sage Green | Content styling, subtle fills, tags, and highlights |
| **Borders & Outlines** | `#97A87A` | Olive Green | Structural 1px dividers, grid outlines, and frames |

### Typography
- **Headings & Display**: `EB Garamond` (Google Font)
- **Body & Paragraphs**: `Source Serif 4` (Google Font)
- **Labels, Dates & Metadata**: `IBM Plex Mono` (Google Font)

## Features & Editorial Architecture

- **Editorial Heading Rail**: Desktop layout features a structured left rail with section indexing and title, aligning main content along a unified vertical guide.
- **Strict Square Corners**: No rounded borders (`border-radius: 0px`) echoing Swiss/editorial minimalism.
- **100% Genuine Information**: Accurate academic profile without fabricated metrics or fake progress bars.
- **Modern Web Standards**:
  - Accessible form validation using `:user-valid` and `:user-invalid` pseudo-classes (error messages deferred until user interaction).
  - Screen reader synchronization with `aria-invalid` and `aria-errormessage`.
  - Real email compose handling targeting `nebula8002@gmail.com` with formatted drafts and one-click clipboard copying.
  - Reduced-motion accessibility (`prefers-reduced-motion: reduce`).
  - WCAG-compliant contrast ratios.

## Quick Start / Local Preview

1. **Option 1: Direct Open**
   Open `index.html` directly in any web browser.

2. **Option 2: Node.js Local Server**
   ```bash
   node server.js
   # or
   npm start
   ```
   Navigate to `http://localhost:3000`.

## Deployment

The project is structured for 100% deployment reliability across any host or upload method:
- **Zero-Dependency Self-Contained HTML**: `index.html` contains embedded styling and fallback scripts, meaning even if a host or web uploader fails to upload the `.css` or `.js` files, the entire site renders with full styling and interactivity right out of the box.
- **Root & Subdirectory Asset Support**: Stylesheet and script files are available at both the root (`style.css`, `main.js`) and subdirectories (`css/style.css`, `js/main.js`).
- **GitHub Pages**: Push all files (or just `index.html`) to your GitHub repository and enable GitHub Pages under **Settings > Pages** on the `main` branch. A `.nojekyll` file is included to prevent Jekyll build interference.
- **Vercel / Netlify**: Deploy as a static site pointing to the project root directory. Configuration files (`vercel.json` and `netlify.toml`) are included for optimal headers and routing.

---
&copy; 2026 Nethra Shree. All rights reserved.

