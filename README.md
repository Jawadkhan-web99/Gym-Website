# ⚡ NEUROFIT — Elite Athletic Performance & Smart Training Platform

[![Responsive Design](https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-00D4FF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/Jawadkhan-web99/Gym-Website)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D%20Globe-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP 3](https://img.shields.io/badge/GSAP%203-ScrollTrigger%20%26%20Timelines-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth%20Scroll-FF4500?style=for-the-badge)](https://github.com/darkroomengineering/lenis)

> **NEUROFIT** is a state-of-the-art, luxury fitness and athletic performance web application designed with high-end typography, interactive 3D WebGL visualizations, cinema-grade video loops, buttery-smooth GSAP ScrollTrigger timelines, and a 100% production-ready responsive layout across all device viewports.

---

## 🌟 Key Highlights & Features

### 🌍 1. Interactive 3D World Globe (Three.js WebGL)
- **Particle Point Cloud**: Custom glowing cyan point cloud with orbital rings, inner atmospheric glow, and city markers.
- **Full Touch & Drag Interaction**: Mobile users can touch-drag and explore the globe in 360 degrees, with gentle momentum damping and auto-rotation on idle.
- **Scroll & Tap Synchronization**: Automatically rotates to global hubs (**Peshawar HQ, Dubai, London, New York**) on scroll or direct card tap.
- **Battery-Optimized Rendering**: Dynamic viewport scaling, capped devicePixelRatio, and orientation-change handlers for 60fps performance.

### ⚡ 2. GSAP 3 & ScrollTrigger Animations
- **Horizontal Gym Experience Carousel**: Desktop pinned horizontal slide-track and mobile touch-snap swipe.
- **Statement Scrub Reveals**: Word-by-word typography scrub animations on scroll.
- **Clip-Path Text Reveals & Image Expansion**: Dynamic mask reveals and progressive facility photo scaling.
- **Selective Preloader**: High-tech loader displayed only on initial visit and manual refresh, with instant sub-page transitions.

### 🎴 3. 3D Perspective Tilt Engine (init3DTilt)
- **Card Depth Effect**: Desktop mousemove 3D perspective angle tilt on all Program, Trainer, and Pricing cards.
- **Touch Feedback**: Haptic-style scale compression on mobile tap.

### 🎬 4. Cinema-Grade Hero Video
- Responsive background video loop with object-fit: cover and dark vignette overlay.
- Dynamic 100svh / 100dvh viewport calculations that adapt smoothly to mobile address-bar changes.

### 📱 5. 100% Production Responsive System
- Fully tested across **13 breakpoints** from small phones (320px, 375px, 390px, 414px, 480px) to tablets (768px, 820px, 1024px) and large desktop monitors (1280px, 1440px, 1920px).
- Hamburger drawer navigation with staggered GSAP link animations and 44px touch targets.

---

## 📂 Multi-Page Architecture

| Page | File | Purpose |
| :--- | :--- | :--- |
| **Home** | index.html | Hero video, 8 Coaches, Smart Pricing slider, 3D Globe, Horizontal Experience, Testimonials, FAQ |
| **About** | bout.html | Brand genesis, 4 Pillars of methodology, 3 Architectural spaces, Interactive 2014-2026 Timeline |
| **Programs** | programs.html | 8 Engineered protocols (Strength, Hypertrophy, Metabolic Shred, Functional Engine, etc.) with filter tabs |
| **Trainers** | 	rainers.html | 6 Master Coach profiles with certifications, specialty badges, and 1-on-1 booking modals |
| **Membership** | membership.html | Monthly/Annual billing toggle (-20% discount), 3 Tier pricing cards, 15-row comparison table |
| **Contact** | contact.html | Consultation booking form, 24/7 Headquarters information, interactive dark map visual |

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 with accessibility attributes (ria-label, ria-hidden)
- **Styling**: Modern CSS3 (Custom Properties, Flexbox, Grid, clamp() fluid typography, Backdrop Blur Glassmorphism)
- **3D Graphics**: [Three.js](https://threejs.org/) (r128)
- **Animation Engine**: [GSAP 3](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis) (v1.1.9)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Fonts**: Space Grotesk, Space Mono, Inter (Google Fonts)

---

## 📁 Directory Structure

`
Gym-Website/
├── assets/
│   ├── images/
│   │   ├── coaches/          # 8 Distinct high-res coach portraits
│   │   ├── trainers/         # Master coach profile photos
│   │   ├── programs/         # Engineered protocol banners
│   │   └── about/            # Facility and training space photos
│   └── videos/
│       └── gym-video.mp4     # Cinematic hero background video
├── css/
│   ├── global.css            # CSS variables, typography, reset, buttons, utility classes
│   ├── components.css        # Navbar, cards, modals, sliders, 3D canvas, footer
│   ├── animations.css        # Keyframe animations, glow pulses, marquees, preloader
│   └── responsive.css        # 100% Mobile, Tablet, Laptop, and Desktop media queries
├── js/
│   └── app.js                # Core app controller (Three.js, GSAP, Lenis, Tilt, Modals, Filters)
├── index.html                # Home Landing Page
├── about.html                # About & Facility Page
├── programs.html             # Training Programs Page
├── trainers.html             # Master Coaches Page
├── membership.html           # Pricing & Membership Page
├── contact.html              # Contact & Consultation Booking Page
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
`

---

## 🚀 Quick Start & Local Setup

### 1. Clone the repository
`ash
git clone https://github.com/Jawadkhan-web99/Gym-Website.git
cd Gym-Website
`

### 2. Run locally
You can open index.html directly in any modern browser, or run a local development server:

**Using VS Code Live Server**:
Right-click index.html and select **Open with Live Server**.

**Using Node.js (
px serve)**:
`ash
npx serve .
`

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and customize it for personal or commercial projects.

---

<p align=center>
  Crafted with passion for athletic excellence by <strong>NEUROFIT Performance Lab</strong>.
</p>
