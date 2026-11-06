---
name: SentinelChain
description: Aerospace-grade Autonomous Semiconductor Supply Chain Remediation & ERP Intelligence Control Tower
colors:
  primary: "#F4511E"
  primary-hover: "#E64212"
  primary-soft: "#FFF4ED"
  primary-dark: "#FF713B"
  primary-dark-hover: "#FF8A5C"
  neutral-bg: "#F8F9FA"
  neutral-bg-dark: "#080808"
  surface: "#FFFFFF"
  surface-dark: "#111111"
  surface-secondary: "#F5F5F5"
  surface-secondary-dark: "#181818"
  border: "#E8E8E8"
  border-dark: "#222222"
  risk-critical: "#DC2626"
  risk-high: "#EA580C"
  risk-medium: "#D97706"
  risk-low: "#16A34A"
  risk-neutral: "#64748B"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.surface-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: The Global Silicon Ledger

SentinelChain is an enterprise semiconductor supply-chain control tower and ERP autonomous remediation platform bridging real-world disruption telemetry (USGS, BIS EAR, SEC EDGAR, Foundry IR) with SAP S/4HANA BOM calculations and automated SAP Ariba purchase requisition guardrails.

## Overview

- **Design Metaphor**: **The Global Silicon Ledger** / **Aerospace Mission Control & Wall Street Trading Terminal Rigidity**.
- **Anti-References**: Playful B2C SaaS gradients, excessive whitespace, pillowy bubbly cards, and low-contrast decorative elements.
- **Personality**: Vigilant, authoritative, real-time, precision-engineered.
- **Elevation**: Tactile & Lifted — subtle 1px borders (`border-neutral-200` / `dark:border-white/[0.08]`), discrete inner shadows, and muted backdrop blurs.
- **Controls**: Refined & Restrained — compact, high-density buttons, segmented pills, tabular-num typography, and monospaced telemetry gauges.

## Colors

The palette balances clean enterprise neutrals with high-contrast, unambiguous semantic risk status indicators:

- **Primary Accent (`#F4511E` light / `#FF713B` dark)**: Used strictly for primary actions (Run Threat Triage, Export Verified SAP PR) and active status indicators.
- **Surface Hierarchy**:
  - Light mode: Canvas (`#F8F9FA`), Card Surface (`#FFFFFF`), Secondary Container (`#F5F5F5`), Border (`#E8E8E8`).
  - Dark mode: Canvas (`#080808`), Card Surface (`#111111`), Secondary Container (`#181818`), Border (`#222222`).
- **Semantic Risk & Status**:
  - `risk-critical` (`#DC2626` / red-600): Immediate line stoppage, Tier 1 single-source failure, price spikes >50%.
  - `risk-high` (`#EA580C` / orange-600): Imminent disruption within lead-time window, allocation limits.
  - `risk-medium` (`#D97706` / amber-600): Secondary supplier strain, logistical transit delay.
  - `risk-low` / `success` (`#16A34A` / green-600): Normal operation, automated PR executed, buffer adequate.
  - `risk-neutral` (`#64748B` / slate-500): Monitored baseline, historical telemetry.

## Typography

Typography prioritizes information density, instant readability under crisis conditions, and numeric alignment:

- **Typeface Stack**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, sans-serif.
- **Monospace Stack**: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, monospace for part numbers, SAP material codes, timestamps, and coordinates.
- **Tabular Figures**: Always enforce `font-mono tabular-nums` for financial metrics, risk exposure, percentages, and latencies.
- **Hierarchy Floor**: Minimum text size is `11px` (`text-[11px]`) for badges/labels; body text is `13px`–`14px`; section headers are `16px`–`18px`; hero metrics are `28px`–`32px`.

## Layout

- **Viewport Grid**: Multi-column responsive layout anchored by a 240px fixed collapsible sidebar.
- **Executive Threat Matrix**: 4-column balanced grid displaying daily revenue exposure, assembly buffers, active telemetry feeds, and autonomous settlement rate.
- **Silcon Corridor Radar & Capital Preservation**: 12-column responsive split (7-col interactive 3D Globe telemetry & 5-col Capital Protected terminal chart).
- **SAP S/4HANA BOM Explorer**: High-density interactive data table with sorting, plant filters, Days of Supply (DoS) color-coded progress bars, and single-click triage linking.
- **Tactile Padding**: Standard container padding is `p-4` or `p-6` with tight internal component spacing (`gap-3`, `gap-4`).

## Elevation & Depth

- **Surfaces**: Crisp borders (`border border-neutral-200 dark:border-white/[0.08]`) with subtle background shifts between canvas and cards.
- **Shadows**:
  - Light mode: `shadow-subtle` (`0 1px 2px rgba(0,0,0,0.05)`), `shadow-card` (`0 2px 8px rgba(0,0,0,0.06)`).
  - Dark mode: `shadow-dark-subtle` (`0 1px 2px rgba(0,0,0,0.3)`), `shadow-dark-card` (`0 2px 12px rgba(0,0,0,0.35)`).
- **Backdrop Blur**: Modals, sticky headers, and command palettes use `backdrop-blur-md bg-white/90 dark:bg-[#0D0D0D]/90`.

## Shapes

- **Corner Radii**:
  - Buttons and Inputs: `rounded-lg` (8px).
  - Badges and Pills: `rounded-md` (4px–6px) or `rounded-full` for status dots.
  - Panels and Cards: `rounded-xl` (12px) with 1px border.
  - Modals and Drawers: `rounded-2xl` (16px).

## Components

- **Executive Threat Cards**: Top-level KPI cards with subtle accent top borders, bold tabular figures, secondary contextual metrics, and drill-down links.
- **Status Badges (`StatusBadge.js`)**: Minimum `11px` font with subtle background tint, solid semantic dot, and bold text label.
- **Navigation (`Navbar.jsx`)**: Global fab timezone indicators (Taipei TSMC, Frankfurt Saxony, Austin), live breadcrumbs, `⌘K` command shortcut, and SAP S/4HANA synchronization status.
- **Sidebar (`Sidebar.jsx`)**: System health telemetry, active disruption count badges, SAP OData status ribbon, and keyboard navigable routes.
- **Spend / Capital Chart (`SpendProtectedChart.jsx`)**: Interactive Catmull-Rom SVG spline with mouse crosshair tracking, timeframe selection tabs, and downtime savings readout.

## Do's and Don'ts

### Do:
- Always use `font-mono tabular-nums` for numbers, currencies, and timestamps.
- Ensure all text labels meet craft floor standards (minimum 11px, high contrast).
- Provide immediate tactile feedback for asynchronous actions (spinning state, countdown reset, status toast).
- Maintain dual-theme parity: test every view in both crisp light and tactical dark mode.
- Respect enterprise data constraints: preserve SAP material numbers, MPNs, and price ceiling validations.

### Don't:
- Never use soft candy gradients or playful pastel drop shadows.
- Never use non-functional decorative UI elements (e.g., auto-spinning globe without zoom or interaction).
- Never allow table columns or metrics to cause layout shifts or truncation of critical part numbers.
- Never reset interactive state without user confirmation.
- Never hardcode dark colors without corresponding light mode variants.
