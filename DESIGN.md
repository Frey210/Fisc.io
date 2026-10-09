---
name: Fisc.io landing
description: Dark, focused personal-finance interface with emerald product signals.
colors:
  canvas: "#020617"
  surface: "#0f172a"
  surface-raised: "#1e293b"
  text: "#f8fafc"
  text-muted: "#94a3b8"
  emerald: "#34d399"
  emerald-deep: "#064e3b"
  sky: "#38bdf8"
  border: "rgba(148,163,184,0.18)"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem,5vw,3.75rem)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.7
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
rounded:
  control: "0.75rem"
  card: "1rem"
  stage: "1.5rem"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.875rem 1.75rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  device-stage:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.stage}"
    padding: "1.25rem"
---

# Design System: Fisc.io landing

## Overview

This file describes the public landing page only. Dashboard, login and the existing PWA instruction modal keep their own incumbent treatment. The landing page uses a quiet near-black canvas, concentrated emerald signals and product demonstrations inside dark panels.

## Colors

Slate surfaces carry nearly the whole page. White establishes hierarchy; muted slate supports reading; emerald identifies actions, successful values and active interaction. Sky and amber appear only where account types or data categories need distinction.

## Typography

Use the existing system sans stack. Display copy is heavy and compact; body copy stays regular with generous line height. Labels are small and bold. Monospace is reserved for receipt and numeric data inside the product demonstrations.

## Layout

The page uses a centered `max-w-7xl` shell. The desktop hero splits evenly between copy and product; below 1024px it stacks. Feature sections use an asymmetric bento grid, while setup and trust content use equal columns that collapse on mobile.

## Elevation & Depth

Depth comes from tonal layers, restrained translucent borders and soft shadows. The 3D stage may use backdrop blur because it represents an interactive product surface. Avoid glowing every container.

## Shapes

Controls use 12px corners; feature cards use 16px; the 3D stage uses 24px. Pills are reserved for compact status labels and mode chips.

## Components

Primary actions use emerald with dark text. Secondary actions use a slate surface and quiet border. The interactive stage contains three sample chips, a live result, orbit controls and a labeled illustrative-data note. All controls expose focus and selected state.

## Do's and Don'ts

- Do keep emerald scarce enough to identify actions and successful values.
- Do preserve readable dark-surface contrast and keyboard focus.
- Do keep illustrative values labeled as examples.
- Don't introduce a second light editorial identity on this route.
- Don't publish unverified latency, uptime or infrastructure claims.
