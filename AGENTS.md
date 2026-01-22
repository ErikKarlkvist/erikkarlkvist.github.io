# Agent Guide & Architectural Decisions

This document outlines the core principles, patterns, and rules for this codebase. Future agents contributing to this project should follow these strictly to maintain consistency.

## Project Goal
A personal website for Erik Karlkvist featuring a high-quality "Explore Components" page that showcases different design themes (Minimalistic, Futuristic, Colorful).

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (using `@theme` and vanilla CSS where appropriate)
- **Deployment**: GitHub Pages (via GitHub Actions)

## Core Architectural Rules

### 1. Component Isolation & Structure
- Components are organized by feature or theme.
- **Path Structure**: `src/components/explore/[theme]/[Component]/[Component].tsx`
- **File Naming**: Use strict PascalCase for component files (e.g., `Button.tsx`, not `index.tsx`). `index.ts` files are allowed for barrel exports *only if necessary*, but direct imports are preferred to avoid circular dependencies.

### 2. Deep Dive: Component Function & Styling
This project enforces a **Strict Style Encapsulation** policy to maintain the integrity of each design theme.

#### No `className` Prop
- **Rule**: Components (Button, Input, IconButton, etc.) **MUST NOT** accept a `className` prop in their interface.
- **Rationale**:
    - **Consistency**: Prevents arbitrary styling overrides that dilute the theme.
    - **Maintainability**: Changes to a component's style are guaranteed to propagate everywhere it's used.
    - **Design System Integrity**: Forces developers to think in terms of "Variants" (semantic meaning) rather than "Styles" (CSS values).
- **Implementation**:
    - **Wrong**: `<Button className="bg-red-500 text-white" />`
    - **Right**: `<Button variant="danger" />` (if 'danger' is a defined variant)

#### Theme-Driven Design
- **Single Source of Truth**: All colors, borders, shadows, and spacing MUST come from the theme's `theme.ts` file (e.g., `src/components/explore/minimalistic/theme.ts`).
- **Usage**:
    - Import the theme object: `import { theme } from '../theme';`
    - Destructure tokens: `const { colors, borders } = theme;`
    - Apply via string interpolation in the `className` string.

#### Functional Composition
- **Props over Classes**: Components are configured via specific props:
    - `variant`: Controls the visual hierarchy (primary, secondary).
    - `isLoading`: Boolean to toggle loading states.
    - `loadingText`: String to customize loading messages.
- **Logic Separation**: Theme components are "dumb" regarding business logic. They simply display data and emit events (`onClick`, `onChange`). Complex logic lives in the parent "Demo" or Page components.

### 3. Demo Components
- Demo logic (state, event handlers to simulate behavior) must be separated from the core primitive components.
- **Location**: Top-level within the theme folder, e.g., `src/components/explore/minimalistic/MinimalisticDemo.tsx`.

### 4. Specific Component Patterns
- **Loading**: Every theme has a dedicated `Loading` component (`Loading.tsx`) used internally by Buttons or independently.
- **Icons**: Use dedicated `IconButton` components for clickable icons. Do not wrap generic SVGs in `div`s with onClick handlers if a button is semantically appropriate.

## Workflow
- **Package Manager**: npm
- **Build**: `npm run build` (must pass strict TypeScript checks with no unused variables).
