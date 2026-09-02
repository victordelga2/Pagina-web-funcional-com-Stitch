---
name: Vicele Store Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 96px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for an underground, premium streetwear ecosystem. It prioritizes a high-fashion editorial aesthetic characterized by "Safe" visual identity—a clean, high-contrast monochrome layout that leverages Swiss-style typography to communicate exclusivity and technical precision.

The brand personality is disciplined, modern, and forward-leaning. It draws heavily from **Minimalism** and **Modern Corporate** influences, stripping away decorative elements to let product photography and technical specifications command attention. The emotional response is one of "Atmospheric Luxury"—an environment that feels both elite and utilitarian.

## Colors

This design system utilizes a strict monochrome palette to ensure the UI remains a neutral vessel for diverse fashion collections.

- **Primary (#000000):** Used for core branding, primary CTAs, and high-impact headlines. It represents the "Underground" foundation.
- **Secondary (#F5F5F5):** An "off-white" surface color used to soften the background, preventing eye strain while maintaining a premium feel.
- **Neutral (#FFFFFF):** Reserved for card backgrounds and elevated surfaces to create subtle tonal separation.
- **Deep Grays & Silver:** Used for technical metadata, borders, and disabled states to maintain a "Technical Gear" aesthetic without introducing hue.

## Typography

Typography is the primary structural element of this design system. It follows a Swiss International style:
- **Headlines:** Set in **Inter**, utilizing tight tracking and bold weights to mimic fashion editorial layouts. Large "Display" sizes should be used sparingly for hero sections.
- **Body:** Set in **Source Sans 3** for maximum legibility in product descriptions and technical specs. The increased line height ensures a spacious, breathable reading experience.
- **Labels:** Small, all-caps metadata (using Inter) provides the "Technical Gear" look, appearing in product SKU tags, sizes, and navigation headers.

## Layout & Spacing

This design system uses a **Fluid Grid** with aggressive negative space. 

- **Grid:** A 12-column grid for desktop, collapsing to a 2-column or 1-column grid for mobile.
- **Rhythm:** Spacing follows a 4px base unit. Wide margins (`64px` on desktop) are critical to achieving the "High-Fashion" look, pushing content toward the center and creating an expansive feel.
- **Mobile-First:** Margins reduce to `20px` on mobile, but vertical spacing between sections remains high (`96px`) to encourage a rhythmic scrolling experience similar to a lookbook.

## Elevation & Depth

To maintain a minimalist and technical aesthetic, this design system avoids traditional drop shadows. Depth is communicated through **Tonal Layers** and **Low-contrast Outlines**:

- **Surfaces:** The primary background is `#F5F5F5`. Overlays and cards use `#FFFFFF`.
- **Outlines:** A 1px solid border (`#E2E2E2`) is the primary method of defining container boundaries. 
- **Translucency:** For sticky navigation and mobile menus, a backdrop-blur (12px) with a semi-transparent white fill is used to create a "Technical Glass" effect, allowing product colors to bleed through subtly as the user scrolls.

## Shapes

The shape language is "Soft-Technical." By using a **roundedness of 1 (0.25rem)**, we maintain the structural integrity of a grid-based design while preventing the UI from feeling sharp or aggressive. 

- **Primary Elements:** Buttons and Input fields use the 4px (Soft) radius.
- **Large Elements:** Product cards and hero containers use 8px (rounded-lg) to subtly differentiate from smaller UI components.
- **Exceptions:** Badge tags (e.g., "Sold Out") may use a pill-shape to contrast against the otherwise rectangular architecture.

## Components

### Buttons
- **Primary:** Solid `#000000` fill with `#FFFFFF` text. No shadow. 4px border radius.
- **Secondary:** Transparent fill with a 1px `#000000` border.
- **Hover State:** Primary buttons shift to `#333333`; Secondary buttons fill with `#000000` and flip text to `#FFFFFF`.

### Product Cards
- **Structure:** Edge-to-edge imagery with metadata (Name, Price) left-aligned below. 
- **Interaction:** On hover, the image should subtly scale (1.05x) within its frame. A "Quick Add" button appears as a translucent overlay at the bottom of the card.

### Navigation
- **Header:** Sticky positioning with a `backdrop-blur`. 
- **Typography:** Navigation links use `label-sm` (uppercase) for a utilitarian, architectural feel.

### Admin/Dashboard Tokens
- **Utility:** The admin area uses a higher density of information. The background shifts to pure white for clarity.
- **Tables:** 1px horizontal dividers only. No vertical lines. Header labels are bold `label-sm`.

### Input Fields
- **Style:** Underline-only or subtle 1px gray border. Focus state is a high-contrast 1px black border. Error states use a technical red text but maintain the black border to stay on-brand.
