# Design System & Theme Specifications

## Overview
This document outlines the design system, color palette, and component specifications used throughout the application, with focus on the Hero section.

---

## 🎨 Color Palette

### Primary Colors
```css
/* Amber/Orange - Limited Time Badge */
--color-amber-500: #f59e0b
--color-amber-600: #d97706
--color-orange-500: #f97316
--color-orange-600: #ea580c
--color-orange-700: #c2410c

/* Red - Primary CTA Buttons */
--color-red-300: #fca5a5
--color-red-400: #f87171
--color-red-500: #ef4444

/* Pink/Purple - Rating Stars & Accents */
--color-pink-400: #f472b6
--color-pink-500: #ec4899
--color-pink-600: #db2777
--color-purple-500: #8b5cf6
--color-purple-600: #7c3aed

/* Gray Scale */
--color-gray-200: #e5e5e5
--color-gray-300: #d4d4d4
--color-gray-400: #a3a3a3
--color-gray-600: #525252
--color-gray-700: #404040
```

### Background Colors
```css
/* Glassmorphism Effects */
--bg-white-10: rgba(255, 255, 255, 0.1)
--bg-white-20: rgba(255, 255, 255, 0.2)
--bg-black-20: rgba(0, 0, 0, 0.2)
--bg-black-30: rgba(0, 0, 0, 0.3)

/* Border Colors */
--border-white-10: rgba(255, 255, 255, 0.1)
--border-white-20: rgba(255, 255, 255, 0.2)
--border-gray-200-50: rgba(229, 229, 229, 0.5)
--border-gray-700-50: rgba(64, 64, 64, 0.5)
```

### Gradient Definitions
```css
/* Hero Section Gradients */
--gradient-amber-orange: linear-gradient(to right, #f59e0b, #f97316, #ea580c)
--gradient-red: linear-gradient(to right, #fca5a5, #f87171, #ef4444)
--gradient-pink-purple: linear-gradient(to right, #ec4899, #8b5cf6)
--gradient-pink-purple-stars: linear-gradient(to right, #ec4899, #8b5cf6)
```

---

## 🔘 Button Specifications

### Primary CTA Button (Buy Now)
**Classes:** `bg-gradient-to-r from-red-300 to-red-400`

**Default State:**
- Background: `linear-gradient(to right, #fca5a5, #f87171)`
- Text: White (`text-white`)
- Padding: `px-8 py-3`
- Height: `h-12` (48px)
- Border Radius: `rounded-xl`
- Font Size: `text-sm`
- Font Weight: `font-bold`

**Hover State:**
- Background: `linear-gradient(to right, #f87171, #ef4444)`
- Shadow: `shadow-red-400/40`
- Transform: `hover:-translate-y-1`
- Scale: `group-hover:scale-110`

**Active State:**
- Scale: `active:scale-95`

**Before Pseudo-element (Hover Overlay):**
- Background: `linear-gradient(to right, #f87171, #ef4444)`
- Opacity: `before:opacity-0` → `hover:before:opacity-100`

**Glare Effect:**
- Gradient: `linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)`
- Transform: `-translate-x-full` → `group-hover:translate-x-full`
- Transition: `duration-1000`

### Secondary CTA Button (Explore Catalogue)
**Classes:** `bg-gradient-to-r from-red-300 to-red-400`

**Default State:**
- Background: `linear-gradient(to right, #fca5a5, #f87171)`
- Text: White (`text-white`)
- Padding: `px-6 py-3`
- Height: `h-12` (48px)
- Border Radius: `rounded-xl`
- Border: `border-2 border-transparent`
- Font Size: `text-sm`
- Font Weight: `font-bold`

**Hover State:**
- Background: `linear-gradient(to right, #f87171, #ef4444)`
- Border: `hover:border-red-400/60`
- Shadow: `hover:shadow-red-400/40`
- Transform: `hover:-translate-y-1`

**Before Pseudo-element:**
- Background: `linear-gradient(to right, rgba(248,113,113,0.2), rgba(239,68,68,0.2))`
- Transform: `before:scale-0` → `hover:before:scale-100`

### Limited Time Badge
**Classes:** `bg-gradient-to-r from-amber-500 to-orange-600`

**Default State:**
- Background: `linear-gradient(to right, #f59e0b, #f97316)`
- Text: White (`text-white`)
- Padding: `px-4 sm:px-6 py-2`
- Border Radius: `rounded-full`
- Font Size: `text-xs sm:text-sm`
- Font Weight: `font-bold`
- Text Transform: `uppercase`
- Letter Spacing: `tracking-wide`

**Hover State:**
- Background: `hover:from-amber-600 hover:to-orange-700`
- Shadow: `hover:shadow-orange-500/30`
- Transform: `hover:-translate-y-0.5`

---

## 📝 Typography

### Headings
```css
/* H2 Title */
font-size: 30px (text-3xl) on mobile
font-size: 36px (sm:text-4xl) on 640px+
font-size: 48px (md:text-5xl) on 768px+
font-size: 60px (lg:text-6xl) on 1024px+
font-size: 72px (xl:text-7xl) on 1280px+

font-weight: 700 (font-bold)
line-height: tracking-tight
text-align: center

/* Max Width */
max-width: 48rem (max-w-3xl) on mobile
max-width: 56rem (sm:max-w-4xl) on 640px+
max-width: 64rem (lg:max-w-5xl) on 1024px+
```

### Body Text
```css
/* Description (below title) */
font-size: 18px (text-lg) on mobile
font-size: 16px (sm:text-base) on 640px+
font-size: 18px (md:text-lg) on 768px+
font-size: 20px (lg:text-xl) on 1024px+

line-height: leading-relaxed
text-align: center

/* Rating Card Description */
font-size: 16px (text-base) on mobile
font-size: 14px (sm:text-sm) on 640px+

/* Trust Badges Text */
font-size: 14px (text-sm) on mobile
font-size: 12px (sm:text-xs) on 640px+
font-size: 14px (md:text-sm) on 768px+
font-size: 16px (lg:text-base) on 1024px+

/* Rating Text */
font-size: 14px (text-sm) on mobile
font-size: 12px (sm:text-xs) on 640px+
font-size: 14px (md:text-sm) on 768px+
```

### Text Colors
```css
/* Light Mode */
text-gray-900: #111827 (H2 title)
text-gray-600: #4b5563 (Description)
text-gray-700: #374151 (Rating text)

/* Dark Mode */
dark:text-white: #ffffff (H2 title)
dark:text-gray-200: #e5e7eb (Description)
dark:text-gray-300: #d1d5db (Rating text)
```

---

## 📏 Spacing & Layout

### Container Spacing
```css
/* Hero Content Container */
padding: 16px (px-4) on mobile
padding: 24px (sm:px-6) on 640px+
padding: 32px (md:px-8) on 768px+
padding: 48px (lg:px-12) on 1024px+

padding-top: 80px (py-20) on mobile
padding-top: 128px (md:py-32) on 768px+

/* Section Spacing */
margin-top: 32px (mt-8) between sections
margin-top: 24px (mt-6) between title and carousel
```

### Button Spacing
```css
/* Button Container */
gap: 24px (gap-6) on mobile
gap: 20px (sm:gap-5) on 640px+
gap: 16px (md:gap-4) on 768px+
gap: 24px (lg:gap-6) on 1024px+

padding: 16px (px-4) on mobile
padding: 32px (sm:px-8) on 640px+

/* Button Size */
width: 100% (w-full) on mobile
max-width: 280px (max-w-[280px]) on mobile
width: 208px (sm:w-52) on 640px+
height: 48px (h-12)
```

### Carousel Spacing
```css
/* Carousel Container */
max-width: 80rem (max-w-7xl)
margin-top: 24px (mt-6)
padding: 12px (p-3)
border-radius: 24px (rounded-3xl)

/* Image Spacing */
border-radius: 16px (rounded-2xl)
```

---

## 🎭 Animation & Transitions

### Animation Durations
```css
/* Section Animations */
title: 0.8s duration, 0.1s delay
description: 0.6s duration, 0.2s delay
carousel: 1.0s duration, 0.3s delay
rating card: 0.8s duration, 0.4s delay
cta buttons: 0.8s duration, 0.5s delay

/* Hover Transitions */
button hover: 300ms (duration-300)
glare effect: 1000ms (duration-1000)
scale transform: 300ms (duration-300)
shadow transition: 500ms (duration-500)
```

### Easing Functions
```css
/* Standard Animation */
ease: "easeOut"

/* Particle Animation */
ease: "linear"

/* Floating Shapes */
ease: "easeInOut"
```

### Transform Values
```css
/* Hover Effects */
hover:-translate-y-1: transform: translateY(-4px)
hover:scale-105: transform: scale(1.05)
hover:scale-110: transform: scale(1.1)
active:scale-95: transform: scale(0.95)
```

---

## 🖼️ Component Specifications

### Floating Shapes (Decorative Elements)
```css
/* Shape 1 - Top Left */
position: absolute
left: 16px (left-4) on mobile
left: 40px (sm:left-10) on 640px+
top: 80px (top-20)
width/height: 96px (h-24 w-24) on mobile
width/height: 128px (sm:h-32 sm:w-32) on 640px+

/* Shape 2 - Top Right */
right: 16px (right-4) on mobile
right: 80px (sm:right-20) on 640px+
top: 160px (top-40)
width/height: 112px (h-28 w-28) on mobile
width/height: 160px (sm:h-40 sm:w-40) on 640px+

/* Shape 3 - Bottom Left */
left: 10% (left-[10%]) on mobile
left: 25% (sm:left-1/4) on 640px+
bottom: 80px (bottom-20)
width/height: 80px (h-20 w-20) on mobile
width/height: 96px (sm:h-24 sm:w-24) on 640px+

/* Background Gradient */
from-pink-400/20 to-purple-400/20 (light mode)
from-pink-600/10 to-purple-600/10 (dark mode)
blur: blur-xl
```

### Rating Card
```css
/* Container */
border-radius: 16px (rounded-2xl)
border: 1px solid rgba(255, 255, 255, 0.2) (light mode)
border: 1px solid rgba(255, 255, 255, 0.1) (dark mode)
background: rgba(255, 255, 255, 0.1) (light mode)
background: rgba(0, 0, 0, 0.2) (dark mode)
padding: 24px (p-6)
backdrop-filter: blur(16px) (backdrop-blur-xl)
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) (shadow-2xl)

/* Stars */
size: 16px (h-4 w-4) on mobile
size: 20px (md:h-5 md:w-5) on 768px+
gradient: from-pink-500 to-purple-600
```

### Trust Badges
```css
/* Badge Container */
background: rgba(255, 255, 255, 0.2) (light mode)
background: rgba(0, 0, 0, 0.3) (dark mode)
padding: 6px 12px (px-3 py-1.5)
border-radius: 9999px (rounded-full)
backdrop-filter: blur(4px) (backdrop-blur-sm)

/* Icon */
color: #10b981 (text-green-500)
size: 16px (h-4 w-4)
```

---

## 🖱️ Interactive States

### Hover States Summary
| Element | Transform | Shadow | Background Change |
|---------|-----------|--------|-------------------|
| Primary Button | `translateY(-4px)` | `shadow-red-400/40` | Darker red gradient |
| Secondary Button | `translateY(-4px)` | `shadow-red-400/40` | Darker red gradient |
| Badge | `translateY(-2px)` | `shadow-orange-500/30` | Darker amber/orange |
| Carousel Item | `scale(1.05)` | - | - |
| Images | - | - | Overlay appears |

### Active States
```css
/* All Buttons */
active:scale-95: transform: scale(0.95)
```

### Focus States
```css
/* Default Tailwind Focus (implied) */
focus:outline-none
focus:ring-2
focus:ring-offset-2
```

---

## 🎨 Special Effects

### Glassmorphism
```css
/* Glass Container */
backdrop-filter: blur(16px) (backdrop-blur-xl)
background: rgba(255, 255, 255, 0.1) (light mode)
background: rgba(0, 0, 0, 0.2) (dark mode)
border: 1px solid rgba(255, 255, 255, 0.2) (light mode)
border: 1px solid rgba(255, 255, 255, 0.1) (dark mode)
```

### Glare Effect
```css
/* Button Glare */
position: absolute
inset: 0
transform: skewX(-12deg) (-skew-x-12)
background: linear-gradient(
  to right,
  transparent,
  rgba(255, 255, 255, 0.2),
  transparent
)
transform-origin: left
animation: slide across on hover
duration: 1000ms
```

### Shadow Effects
```css
/* Carousel */
shadow-[0_8px_32px_rgba(248,113,113,0.25)]: box-shadow with red tint
shadow-[0_8px_32px_rgba(248,113,113,0.4)]: stronger on hover

/* Buttons */
shadow-red-400/40: red shadow on hover
shadow-2xl: large shadow

/* Rating Card */
shadow-2xl: default shadow
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px   (Small devices, large phones)
md: 768px   (Medium devices, tablets)
lg: 1024px  (Large devices, desktops)
xl: 1280px  (Extra large devices)
2xl: 1536px (2X extra large devices)
```

---

## 🎯 Usage Guidelines

### Color Application
1. **Amber/Orange**: Limited time offers, urgency (badges, highlights)
2. **Red**: Primary CTAs, important actions (Buy buttons)
3. **Pink/Purple**: Trust elements, ratings (stars, social proof)
4. **Gray**: Text, secondary elements, borders

### Button Hierarchy
1. **Primary**: Red gradient buttons (Buy Now)
2. **Secondary**: Red gradient buttons with border (Explore)
3. **Tertiary**: Text links or minimal styling

### Animation Best Practices
1. Keep durations between 200-1000ms
2. Use `easeOut` for natural feel
3. Delay stacked animations by 100-200ms
4. Use `linear` for continuous loops (particles)

---

## 📝 Notes

- All colors should be accessed via Tailwind utility classes
- Custom shadows use rgba for transparency
- Gradients are defined inline with Tailwind utilities
- Animation delays create sequential reveal effect
- Backdrop blur creates depth and modern feel
- Percentage-based spacing ensures consistency across breakpoints

---

## 🔗 Related Files

- `src/components/Hero.tsx` - Main hero component
- `src/app/globals.css` - Global styles and CSS variables
- `tailwind.config.js` - Tailwind configuration

---

**Last Updated:** 2025-11-01
**Version:** 1.0.0


images 
const images = [
  'https://ik.imagekit.io/nq9atqhjb/luxury.png?updatedAt=1761674732245',
  'https://ik.imagekit.io/nq9atqhjb/cute.png?updatedAt=1761674732210',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_29PM.png?updatedAt=1761912072822',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_28PM.png?updatedAt=1761912072772',
  'https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20October%2031,%202025%20-%205_17PM.png?updatedAt=1761912072319'
];