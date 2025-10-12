# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DIDIM Mobile is an Expo-based React Native application using the new architecture (React 19, React Native 0.81). The app features file-based routing with Expo Router and is styled with NativeWind (Tailwind CSS for React Native). This is a monorepo setup where the mobile app connects to a separate backend server (DIDIM-Server) with type-safe API communication.

## Development Commands

### Starting the app
```bash
pnpm start          # Start Expo development server
pnpm android        # Run on Android emulator
pnpm ios            # Run on iOS simulator
pnpm web            # Run in web browser
```

### Code quality
```bash
pnpm lint           # Run ESLint (uses expo lint with Prettier integration)
```

### Package management
This project uses **pnpm** as the package manager.

## Architecture Overview

### Type-Safe API Communication
The app uses **Hono RPC client** for type-safe API calls to the backend:
- Backend types are referenced via TypeScript project references (see `tsconfig.json`)
- API client is configured in `src/lib/api-client.ts` using `hc<AppType>()` from Hono
- The `AppType` is imported directly from `../../../DIDIM-Server/src/app`
- Base URL is configured via environment variables

### Authentication
Authentication is handled via **better-auth** with Expo-specific configuration:
- Client setup in `src/lib/auth-client.ts`
- Uses `expo-secure-store` for secure token storage
- Custom scheme: `didim://` for OAuth callbacks
- Storage prefix: `didim` for all auth-related keys

### Environment Variables
The app uses `@t3-oss/env-core` for type-safe environment variable validation:
- All client-side variables must be prefixed with `EXPO_PUBLIC_`
- Configuration is in `src/env.ts`
- Required variable: `EXPO_PUBLIC_API_URL` (API base URL)
- Access variables via: `import { env } from "@/env"`

### Routing Structure
File-based routing with Expo Router (typed routes enabled):
- Root layout: `src/app/_layout.tsx` (global gradient background, transparent header)
- Two main user flows: `/developer` and `/tester`
- Developer registration flow uses route groups: `/developer/(register)/`
  - Steps: package → info → track
- Path alias: `@/*` maps to `src/*`

### Styling System
NativeWind v4 with custom design tokens:
- Configuration: `tailwind.config.ts`
- Global styles: `src/app/global.css`
- Design system tokens exported via `src/design-system.ts`
- Custom color palette (primary, secondary, gray scale, error)
- Typography system with predefined sizes (title-1 through title-4, desc-1 through desc-3, headline-1, headline-2, body-3, button)
- Access colors programmatically: `import { colors } from "@/design-system"`

### Component Architecture
- Reusable components in `src/components/`
- Key components: `ScreenLayout`, `CTAButton`, `InputField`, `ErrorBottomSheet`, `GroupAccessBottomSheet`, `TrackSelectBottomSheet`
- Bottom sheets use `@gorhom/bottom-sheet` library

### Expo Configuration
- App name: DIDIM
- Custom scheme: `didim://`
- React Compiler enabled (experimental)
- New Architecture enabled
- Edge-to-edge UI on Android
- Custom splash screen with light/dark mode support

## Development Workflow

### Working with API Types
When the backend API changes:
1. Ensure DIDIM-Server is in the correct location (sibling directory)
2. TypeScript will automatically pick up type changes via project references
3. No need to regenerate types manually - they're imported directly

### Adding New Routes
1. Create files in `src/app/` following Expo Router conventions
2. Use `_layout.tsx` files for nested navigation
3. Route groups use parentheses: `(groupName)/`
4. Typed routes are enabled - use `router.push()` with autocomplete

### Styling Components
- Use NativeWind className prop: `className="text-gray-50 text-title-3"`
- For programmatic colors: import from `@/design-system`
- Custom font sizes follow the design system (e.g., `text-title-1`, `text-desc-2`)

### Environment Setup
1. Copy environment variables (see `.env.local` for current setup)
2. Set `EXPO_PUBLIC_API_URL` to point to your backend server
3. Environment variables are validated at runtime via Zod schemas

## Key Technical Details

- **React Compiler**: Experimental React Compiler is enabled - avoid manual memoization unless necessary
- **Import Extensions**: ESLint rule disabled - no need to add file extensions to imports
- **Transparent Navigation**: Custom Android plugins in `src/plugins/` handle transparent navigation bar
- **Gradient Background**: Root layout applies a global gradient background to all screens
- **Safe Area Handling**: Use `useSafeAreaInsets()` from `react-native-safe-area-context` for proper spacing
