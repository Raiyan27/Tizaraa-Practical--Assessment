# 3D Product Customization E-commerce

A modern e-commerce platform featuring real-time 3D product customization, built with Next.js 16 and TypeScript.

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd tizaraa
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:coverage
```

## Architecture Decisions

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **3D Rendering**: Three.js + React Three Fiber
- **Persistence**: IndexedDB (via idb library)
- **Notifications**: react-hot-toast
- **Validation**: Zod schemas for runtime validation + custom TypeScript functions for business logic

### Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # Reusable UI components
├── lib/          # Business logic utilities
├── store/        # Zustand state stores
├── types/        # TypeScript type definitions
├── data/         # Static data and mock APIs
└── hooks/        # Custom React hooks
```

### Key Architectural Choices

- **Server Components by default**: Client components only when necessary (interactivity required)
- **Component composition over inheritance**: Modular, reusable component architecture
- **Centralized state management**: Single source of truth with Zustand stores
- **Offline-first data persistence**: IndexedDB for cart data with localStorage fallback
- **Type-safe development**: Strict TypeScript with no `any` types
- **Performance-first**: Virtual scrolling for large lists, lazy loading for 3D components

## Assumptions Made

### Business Logic

- Products have fixed variant combinations (color/material/size)
- Cart persists across browser sessions using IndexedDB
- Pricing calculations are client-side only
- Stock validation happens at add-to-cart time
- Promo codes are case-insensitive and stackable

### User Experience

- Users expect real-time 3D preview during customization
- Cart operations should be immediate with optimistic updates
- Loading states prevent double-submissions
- Toast notifications replace browser alerts
- Mobile-first responsive design

### Technical Assumptions

- Modern browser support (ES2017+ features)
- WebGL support for 3D rendering
- Service worker support for offline functionality
- Local storage APIs available

## Known Limitations

### Performance

- 3D models load entirely into memory (no streaming)
- Large product catalogs may impact initial load time

### Functionality

- No user authentication or accounts
- No payment processing (checkout shows placeholder)
- No order history or tracking
- No admin panel for product management

### Browser Support

- Requires WebGL for 3D features
- Limited fallback for browsers without IndexedDB
- No IE11 support (ES2017+ requirement)

### Data Management

- All product data is static/client-side
- No real-time inventory synchronization
- No analytics or user behavior tracking
- No error reporting or monitoring

### Scalability

- Single-page application architecture
- No CDN optimization for assets
- No database integration (static data only)
