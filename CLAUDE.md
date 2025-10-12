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
pnpm format         # Format code with Prettier
```

### Package management
This project uses **pnpm** as the package manager.

**IMPORTANT**: After completing any code changes, always run `pnpm format` to ensure consistent code formatting across the project.

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
- Bottom sheets use `@gorhom/bottom-sheet` library
- All components use **CVA (class-variance-authority)** for variant management
- Use the `cn()` utility from `@/lib/utils` for conditional className merging
- Components available: Button, Card, Toast, TopNav, Modal, BoxField, Badge, Dropdown

### Icons
- **ALWAYS use `lucide-react-native` for icons** - do not use other icon libraries
- Import icons from `lucide-react-native`
- Icons are tree-shakeable and optimized for React Native
- Example usage:
```tsx
import { Home, User, Search } from "lucide-react-native";

<Home color="#4F96FF" size={24} />
<User color="#F1F3F3" size={20} strokeWidth={2} />
```

### State Management and Forms

#### TanStack Query
The app uses **TanStack Query v5** for server state management:
- QueryClient is configured in `src/app/_layout.tsx` with retry and refetch options
- Use `useMutation` for data mutations (POST, PUT, DELETE operations)
- Use `useQuery` for data fetching when implementing read operations
- Queries are automatically cached and invalidated

Example mutation:
```tsx
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/api-client";

const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await client.api.endpoint.$post({ json: data });
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  },
  onSuccess: (data) => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});

// Use mutation
mutation.mutate(formData);
```

#### TanStack Form
The app uses **TanStack Form** for form state management:
- Provides type-safe form handling with React Native components
- Use `useForm` hook to create form instances
- Use `form.Field` component to bind form fields to inputs
- Use `form.Subscribe` to reactively access form state

Example form:
```tsx
import { useForm } from "@tanstack/react-form";

const form = useForm({
  defaultValues: {
    email: "",
    password: "",
  },
  onSubmit: async ({ value }) => {
    // Handle form submission
    console.log(value);
  },
});

// In JSX
<form.Field name="email">
  {(field) => (
    <BoxField
      value={field.state.value}
      onChangeText={field.handleChange}
    />
  )}
</form.Field>

<form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
>
  {({ canSubmit, isSubmitting }) => (
    <Button
      disabled={!canSubmit || isSubmitting}
      onPress={form.handleSubmit}
    >
      Submit
    </Button>
  )}
</form.Subscribe>
```

**IMPORTANT Guidelines:**
- Always use TanStack Form for form state management instead of manual useState for form fields
- Use TanStack Query's `useMutation` for API calls instead of manual loading states
- Combine both: TanStack Form for form state + TanStack Query mutation for API submission
- Use `form.setFieldValue` to programmatically update field values
- Use `useMemo` to optimize expensive computations when parsing form data

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
4. Typed routes are enabled - **ALWAYS use `<Link>` component for navigation**

### Navigation Guidelines

**CRITICAL: Always use `<Link>` component for navigation, never `router.push()` with onClick handlers.**

Good example:
```tsx
import { Link } from "expo-router";

<Link href="/developer/create/package" asChild>
  <Pressable className="bg-secondary px-2.5 py-2 rounded-lg">
    <Text>등록하기</Text>
  </Pressable>
</Link>
```

Bad example:
```tsx
// ❌ DON'T DO THIS
const handleNavigate = () => {
  router.push("/developer/create/package");
};

<Pressable onPress={handleNavigate}>
  <Text>등록하기</Text>
</Pressable>
```

**When to use `router` methods:**
- Use `router.replace()` for replacing navigation stack
- Use `router.back()` for programmatic back navigation
- Use `router.push()` ONLY when navigation needs dynamic parameters or conditional logic that cannot be expressed with `<Link>`

### Styling Components
- Use NativeWind className prop: `className="text-gray-50 text-title-3"`
- For programmatic colors: import from `@/design-system`
- Custom font sizes follow the design system (e.g., `text-title-1`, `text-desc-2`)

### Creating New Components
When creating new UI components:
1. Use **class-variance-authority (CVA)** for variant management
2. Use **clsx** (via the `cn()` utility from `@/lib/utils`) for conditional class names
3. Always provide TypeScript types using `VariantProps<typeof yourVariants>`
4. Export variants separately if they need to be reused
5. Support a `className` prop for style overrides

Example:
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        secondary: "other-variant-classes",
      },
      size: {
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

interface ButtonProps
  extends ComponentProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <Pressable className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

### Environment Setup
1. Copy environment variables (see `.env.local` for current setup)
2. Set `EXPO_PUBLIC_API_URL` to point to your backend server
3. Environment variables are validated at runtime via Zod schemas

## Key Technical Details

- **React Compiler**: Experimental React Compiler is enabled - avoid manual memoization unless necessary
- **Import Extensions**: ESLint rule disabled - no need to add file extensions to imports
- **Gradient Background**: Root layout applies a global gradient background to all screens
- **Safe Area Handling**: Use `useSafeAreaInsets()` from `react-native-safe-area-context` for proper spacing

## Type Safety and Code Quality Rules

### NEVER Use Type Assertions

**CRITICAL: Never use `as any`, `as unknown`, or any type assertions to suppress TypeScript errors.**

```tsx
// ❌ NEVER DO THIS
router.push("/some/path" as any);
const value = someFunction() as unknown as SomeType;

// ✅ ALWAYS DO THIS - Fix the actual type issue
router.push("/some/path"); // If this errors, see below about route types
```

### Handling Route Type Errors

**When working with Expo Router typed routes, you may see TypeScript errors for route paths that don't exist yet.**

**IMPORTANT: Route types are generated after the first build. If you see a TypeScript error on a route path:**

1. **DO NOT use `as any` or type assertions**
2. **Ignore the error and continue with the implementation**
3. **The error will disappear after running the app once (the build process generates the route types)**

Example scenario:
```tsx
// You might see: Type '"developer/create/package"' is not assignable to type 'Href'
// This happens because the route types haven't been generated yet

// ❌ DON'T DO THIS
<Link href="/developer/create/package" as any>

// ✅ DO THIS - Just ignore the TypeScript error
<Link href="/developer/create/package">
  {/* The error will resolve after first build */}
</Link>
```

**Why this happens:**
- Expo Router generates route types from your file structure
- These types are created during the build process
- New routes won't have types until you run the app at least once
- The types are stored in `.expo/types/` (generated automatically)

**Summary:**
- Write the correct route path
- Ignore any TypeScript errors about route types
- Run the app - the types will be generated automatically
- The error will disappear after the first build
