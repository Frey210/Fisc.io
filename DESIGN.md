---
name: Fisc.io landing
description: Warm editorial finance desk for the public landing page.
colors:
  paper: "#f6f5ee"
  ink: "#173d32"
  muted: "#52695e"
  mint: "#d8e8ce"
  lime: "#d2ee8b"
  rule: "#d2d9cc"
  headline-soft: "#67866c"
  primary-hover: "#2e5641"
  lime-hover: "#e0f3b7"
  focus: "#477044"
  chip-ink: "#355740"
  chip-border: "#9eb598"
  chip-hover: "#c2d8b8"
  tool-active: "#bad2b2"
  receipt-stage: "#e9e8dd"
  receipt-paper: "#fffef8"
  step-fill: "#e2e9d7"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(48px,6.45vw,88px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(30px,3.4vw,46px)"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "27px"
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  action:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 700
  chip:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 600
rounded:
  chip: "6px"
  header-action: "7px"
  action: "8px"
  receipt-stage: "12px"
  device-stage: "14px"
  round: "50%"
spacing:
  compact: "8px"
  small: "16px"
  medium: "24px"
  large: "32px"
  opening: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-closing:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "14px 22px"
  button-closing-hover:
    backgroundColor: "{colors.lime-hover}"
  button-header:
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.header-action}"
    padding: "8px 18px"
  chip-sample:
    textColor: "{colors.chip-ink}"
    typography: "{typography.chip}"
    rounded: "{rounded.chip}"
    padding: "8px 14px"
  chip-sample-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  stage-device:
    backgroundColor: "{colors.mint}"
    rounded: "{rounded.device-stage}"
    padding: "22px 26px 20px"
---

# Design System: Fisc.io landing

## Overview

**Creative North Star: "A conversational finance desk"**

Warm paper, forest ink and a pale mint device stage make everyday finance feel approachable and orderly. Large Manrope headings and open spacing establish an editorial rhythm; ledger rules organize detail without enclosing every item in a card. Lime gives the final account action emphasis.

This system applies only to the public landing page (`app/page.tsx` and `app/landing.css`). Dashboard, login and the shared PWA installation modal retain their incumbent dark styling. These tokens are not a global app theme. The original Fisc.io logo remains the binding identity asset; Indonesian copy and clearly labeled sample data remain product commitments.

**Key Characteristics:**

- Oversized balanced typography, generous paper margins and asymmetric desktop composition.
- Tonal stages, thin ledger dividers and restrained rounded controls.
- Stylized procedural devices with a readable HTML transaction result.
- One slow idle movement; user controls, visibility pausing and reduced-motion support.

## Colors

The palette pairs warm neutral paper with forest greens, using lighter greens to separate product demonstration from reading surfaces.

### Primary

- **Forest Ink** (`ink`): headings, text, primary account actions, selected sample chips and the closing band.
- **Pale Mint** (`mint`): the device stage; its softened green treatment distinguishes the interactive demonstration.
- **Lime** (`lime`): the closing action against Forest Ink.
- **Soft Headline Green** (`headline-soft`): the second hero line, preserving hierarchy without another hue.
- **Muted Green** (`muted`): supporting copy and ledger descriptions.

### Neutral

- **Warm Paper** (`paper`): the landing canvas and text against Forest Ink.
- **Ledger Rule** (`rule`): section boundaries and list dividers.
- **Receipt Stage / Receipt Paper**: a warm gray inset and a brighter paper illustration.

**The Scoped Palette Rule.** Keep these colors within the landing surface. Do not propagate them into dashboard or authentication styles.

## Typography

**Display and Body Font:** Manrope, with sans-serif fallback. The variable font is self-hosted at `public/fonts/manrope.ttf`; its OFL license is kept beside it. It supports weights 200–800 and uses swap loading.

Manrope carries both expressive headings and compact product detail. Headings are balanced, semibold and tightly tracked; amounts use tabular numerals. Use the frontmatter hierarchy as the normative desktop scale.

- **Display:** hero heading. At the mobile threshold it changes to `clamp(38px,8.5vw,62px)` with 1.12 line height.
- **Headline:** section and closing headings.
- **Title:** feature headings; setup-step titles are smaller (19px).
- **Body:** the landing base. Hero supporting copy uses 1.85 line height and a 350px desktop measure, extending to 480px on mobile.
- **Action / Chip:** compact sentence-case controls. Supporting annotations range from 10–12px; they do not carry the main proposition.

## Layout

The centered container caps at 1248px and leaves 56px on each desktop edge. The header is 98px tall. The hero combines an open introduction and a larger device stage on a 0.8fr / 1.45fr grid, separated by 74px. Feature content uses a 1.35fr / 1fr spread; setup steps use three columns. Sections are separated by thin rules and generous vertical spacing.

At 1100px and below, outer margins narrow to 32px and desktop gaps tighten. At 760px and below, margins become 20px; hero, feature, setup and trust content stack. The header becomes 78px tall, section links hide and the account action remains visible. At 390px and below, margins narrow to 16px, the receipt illustration stacks and the transaction result may wrap. At 1600px and above, the device scene grows to 390px high. Intermediate scene heights are 350px desktop, 310px compact, 290px mobile and 250px narrow mobile.

Maintain at least 44px targets for sample selectors and scene controls. Keep the transaction result readable outside the 3D canvas, including when WebGL is unavailable.

## Elevation & Depth

Most surfaces are flat: contrast comes from tone, whitespace and divider rules. The receipt illustration alone uses a soft paper shadow (`0 14px 26px #173d3214`) and a slight rotation. Procedural devices create their own depth through geometry, lighting and material; no glass overlay or card shadow is needed around the stage.

**The Flat Reading Surface Rule.** Text sections and ledger rows remain flat. Reserve physical depth for product illustrations.

## Shapes

Controls use modest rounded corners, progressing from sample chips to action buttons. Large tonal stages use a little more rounding. Scene tools and step indices are circular. Keep the receipt silhouette square and paper-like rather than treating it as another rounded card.

## Components

### Buttons

The primary action is compact and confident: Forest Ink on Warm Paper, semibold action type, 54px minimum height and a small trailing arrow. Hover darkens the green and lifts the control by 2px with a 180ms transition. The closing variant uses Lime against the dark band. Header access is a 44px outlined action that fills with Forest Ink on hover.

All landing links and buttons receive a visible 3px focus outline with a 5px offset. Reduced-motion mode removes CSS transitions. Text links underline on hover rather than acquiring a container.

### Chips

Sample chips are outlined green selectors on the mint stage. Selection uses Forest Ink with Warm Paper text and `aria-pressed`; unselected hover uses the softer chip fill. They have 44px minimum height, and horizontal padding tightens to 11px on mobile. The HTML result announces the selected example through a polite live region.

### Cards / Containers

The device stage is mint and the receipt feature is warm gray. They are content-specific tonal containers; insight lists and setup content remain open. Receipt-stage padding is 34px desktop, 26px compact and 22px at the narrow threshold. Device-stage padding narrows with the viewport.

### Navigation

Keep the existing logo and wordmark on the left, short section links in the center and account access on the right. Section links use 13px semibold type and hover underlines. Mobile retains the wordmark and account action. A visible-on-focus skip link provides direct access to the main content.

### Finance desk

The phone and dashboard are stylized procedural geometry with canvas-drawn sample screens, not raster mockups. Selecting a sample updates both screens and the readable ledger result. Drag rotates within constrained angles; clicking the assembly cycles samples. Circular controls separate devices, reset the view and pause/play movement.

The idle movement is a small sinusoidal float; expansion uses damping rather than an entrance flourish. Movement stops when paused, offscreen, in a hidden tab or when reduced motion is requested. A deliberate play action can opt into movement. Canvas failure leaves the HTML examples available.

## Do's and Don'ts

- **Do** use paper, forest ink and open ledger rows as the landing foundation.
- **Do** retain readable HTML demonstration data alongside the device scene.
- **Do** preserve keyboard focus, 44px targets and motion controls.
- **Do** reuse the existing logo and self-hosted Manrope.
- **Don't** apply the landing tokens to dashboard, login or shared dark modal styling.
- **Don't** add shadows around ordinary reading sections or ledger rows.
- **Don't** show private account data in the demonstration.
- **Don't** present procedural sample screens as screenshots of live user data.
