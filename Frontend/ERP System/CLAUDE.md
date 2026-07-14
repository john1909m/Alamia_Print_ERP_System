# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Start development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`
- Run lint fixes: `npx eslint . --fix`

## Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Shared UI components
│   ├── ui/           # Primitive shadcn/ui components (button, input, modal, etc.)
│   └── common/       # Shared components used across features (ListPage, StatusBadge, etc.)
├── features/         # Feature modules (domain-driven)
│   ├── companies/    # Company management feature
│   │   ├── components/   pages/    # Page components (CompaniesPage)
│   │   ├── services/ # Service functions (companyService)
│   │   ├── mock/     # Mock data (companiesMockData)
│   │   └── components/ # Feature-specific components (CompanyForm)
│   ├── suppliers/    # Supplier management feature (similar structure)
│   ├── materials/    # Materials inventory feature
│   ├── productionOrders/ # Production orders feature (this module)
│   │   ├── pages/    # Page components (ProductionOrdersPage, CreateProductionOrderPage, etc.)
│   │   ├── components/ # Feature-specific components (ProductionOrderForm)
│   │   ├── services/ # Service functions (productionOrderService)
│   │   └── mock/     # Mock data (productionOrdersMockData)
│   ├── dashboard/    # Dashboard analytics
│   └── shared/       # Shared components, hooks, utils used by multiple features
├── hooks/            # Custom React hooks
├── layouts/          # Layout components (Navbar, Sidebar, DashboardLayout)
├── pages/            # Page-level components (route components)
├── routes/           # Route definitions and lazy loading utilities
├── services/         # API service instances (productService, productionService)
├── store/            # State management (Zustand)
├── styles/           # Global CSS and Tailwind configuration
└── utils/            # Utility functions (cn for class merging, formatStatus, etc.)
```

## Architecture Overview

- **State Management**: Zustand for global UI state (see `src/store/uiStore.js`)
- **Styling**: Tailwind CSS with `cn` utility (`src/utils/cn.js`) for conditional class merging
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM v7 with lazy loading via `src/routes/LazyPage.jsx`
- **API Services**: Axios instances in `src/services/` (base config in `api.js`, resource-specific services)
- **UI Components**: 
  - Primitive components in `src/components/ui/` (following shadcn/ui/radix primitives)
  - Shared feature-agnostic components in `src/features/shared/components/` (DataTable, PageHeader, FormModal, etc.)
  - Feature-specific components in `features/[feature]/components/`
- **Feature Organization**: Each feature follows a consistent structure:
  - `pages/` - Route components
  - `services/` - API service functions
  - `mock/` - Mock data for development
  - `components/` - Feature-specific UI components
  - `hooks/` - Feature-specific custom hooks (if needed)

## Key Patterns

### Data Fetching
- Services return promises with mock data using `Promise.resolve()` or delayed resolution
- Components use `useEffect` to fetch data on mount
- Loading and error states handled in components

### Forms
- Built with `react-hook-form` and `zod` resolver
- Validation schemas defined using Zod with Arabic error messages
- Form components reusable across create/edit pages

### UI Consistency
- Reuse existing components from `src/components/ui/` and `src/features/shared/components/`
- Follow existing Tailwind class naming and component patterns
- Use predefined badge variants for status indicators
- Maintain RTL layout compatibility (Arabic language)

### Mock Data
- Features use their own mock data in `features/[feature]/mock/`
- Service functions return resolved promises with mock data
- TODO comments indicate where backend API calls will replace mocks

## Naming Conventions

- Components: PascalCase (e.g., `ProductForm.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useFetchData.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `STATUS_LABELS`)
- Services: camelCase with `Service` suffix (e.g., `productService.js`)
- Files: `.jsx` for React components, `.js` for plain JavaScript

## Guidelines

1. **Reusability**: Always check `src/components/ui/` and `src/features/shared/components/` before creating new UI components
2. **Consistency**: Follow existing patterns for state management, data fetching, and error handling
3. **Modularity**: Keep components focused and reusable; extract complex logic into custom hooks
4. **RTL & Arabic**: Ensure UI respects right-to-left layout; all user-facing text must be in Arabic
5. **Performance**: Use React.memo judiciously; lazy-load routes and consider code-splitting for large components
6. **Error Handling**: Handle loading, empty, and error states consistently using shared components
7. **Extensibility**: Design components and services to be easily replaced with backend implementations