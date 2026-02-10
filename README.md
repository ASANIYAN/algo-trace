# AlgoTrace

**AI-Powered Algorithm Visualization Platform**

AlgoTrace is an interactive web application that transforms complex algorithmic problems into visual, step-by-step representations. Built to bridge the gap between abstract algorithmic thinking and concrete understanding, it helps visualize algorithms in action.

## Purpose & Vision

Understanding algorithms can be challenging when dealing with abstract concepts and complex data transformations. AlgoTrace was created to:

- **Visualize Complex Logic**: Transform algorithmic problems into interactive visual representations
- **Enhance Learning**: Help students and developers understand algorithm behavior through step-by-step visualization
- **Problem Solving**: Provide visual debugging and analysis tools for algorithmic solutions
- **Educational Support**: Offer educators a powerful tool for teaching algorithmic concepts

## Architecture

### Backend: Supabase

- **Database**: PostgreSQL for user management, usage tracking, and data persistence
- **Authentication**: Built-in auth system with email/password and OAuth providers
- **Row Level Security**: Fine-grained access control for user data

_Why Supabase?_ Provides a complete backend-as-a-service solution with excellent TypeScript support, reducing infrastructure complexity and suitable for a mini-project of this scale.

### Frontend: React + TypeScript

Built with modern React patterns focusing on separation of concerns:

#### Service Layer Pattern

- **Custom Hooks**: Business logic encapsulated in reusable hooks (`useHome`, `useLoginForm`, `useSignupForm`)
- **Service Functions**: External API calls and data processing separated from UI components
- **State Management**: Zustand for global state, React Query for server state
- **Validation**: Zod schemas for type-safe form validation and data integrity

#### UI Layer

- **Component Library**: Custom components built with Tailwind CSS and Radix UI primitives
- **Design System**: Consistent theming with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Base components (buttons, forms, modals)
│   ├── layout/          # Layout components (main-layout, protected-route)
│   ├── ui/              # Shadcn/ui components (dialog, sonner)
│   └── visualisation/   # Visualization components (graphs, trees, arrays)
├── contexts/            # React contexts (auth-context)
├── lib/                 # Utilities and configurations
│   ├── ai-service.ts    # AI integration service
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Helper functions
├── modules/             # Feature-based modules
│   ├── auth/            # Authentication module
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth business logic hooks
│   │   ├── utils/       # Auth utilities and validation
│   │   └── views/       # Auth page components
│   └── home/            # Home module
│       ├── components/  # Home-specific components
│       ├── hooks/       # Home business logic hooks
│       └── views/       # Home page components
├── providers/           # App-level providers
├── router/              # React Router configuration
└── store/               # Global state management (Zustand)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service Configuration (if using external AI APIs)
VITE_AI_API_KEY=your_ai_api_key
VITE_AI_API_URL=your_ai_service_endpoint
```

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/ASANIYAN/algo-trace.git
cd algo-trace

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Supabase Setup

1. Create a new Supabase project
2. Run the provided SQL migrations (if any)
3. Configure authentication providers
4. Set up Row Level Security policies
5. Add your Supabase URL and anon key to `.env.local`

## Tech Stack

**Frontend:**

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query for server state
- Zustand for client state
- React Hook Form + Zod for forms
- Sonner for notifications

**Backend:**

- Supabase (PostgreSQL + Auth)
- AI Integration for algorithm analysis

**Development:**

- ESLint + TypeScript for code quality

## Key Features

- **Algorithm Visualization**: Interactive step-by-step algorithm execution
- **Multiple Data Structures**: Support for arrays, trees, graphs, and more
- **User Authentication**: Secure user accounts with usage tracking
- **Responsive Design**: Works seamlessly on desktop and mobile
