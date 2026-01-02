# Matt Hurley - Personal Website

Professional portfolio and reflective space showcasing independent software projects, writing, and technical expertise.

**Live Site:** [https://matthurley.dev](https://matthurley.dev)

## About

This site presents educator-led software development work, focusing on:
- Practical systems thinking
- Privacy-first principles
- Reliability over hype
- Clear UX and maintainable architecture

## Tech Stack

- **Framework:** Astro (static site generator)
- **Hosting:** Cloudflare Pages
- **Styling:** Plain CSS with dark mode support
- **Performance:** Optimized for Lighthouse 95+ scores

## Project Structure

```
├── src/
│   ├── layouts/
│   │   └── Layout.astro         # Base layout with header/footer
│   ├── pages/
│   │   ├── index.astro          # Home page
│   │   ├── projects.astro       # Project case studies
│   │   ├── writing.astro        # Reflective writing
│   │   ├── about.astro          # Background and philosophy
│   │   └── contact.astro        # Contact information
│   └── styles/
│       └── global.css           # Global styles and variables
├── public/                      # Static assets
├── astro.config.mjs            # Astro configuration
└── package.json
```

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to **Pages** > **Create a project** > **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** (leave empty)
6. Click **Save and Deploy**

### Manual Deployment

```bash
# Build the site
npm run build

# Install Wrangler CLI (Cloudflare's deployment tool)
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

### Custom Domain Setup

1. In Cloudflare Pages project settings, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter `matthurley.dev`
4. Follow DNS configuration instructions (typically automatic if domain is on Cloudflare)

## Content Guidelines

- **Tone:** Professional, understated, reflective
- **No commercial language:** This is a personal site, not a business
- **Privacy-first:** Sophia STARS documented without exposing sensitive data
- **Focus:** Real systems, real constraints, real learnings

## Performance Targets

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100

## License

Content and code © 2026 Matt Hurley. All rights reserved.
