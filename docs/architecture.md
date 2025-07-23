# Architecture Guide

This document provides a comprehensive overview of the Nithub Space Management System architecture, design patterns, and technical decisions.

## 🏗️ System Architecture

### **High-Level Architecture**

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Future)      │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Node.js/      │    │ • Google Cal    │
│ • TypeScript    │    │   Python/Go     │    │ • Outlook       │
│ • Tailwind CSS │    │ • PostgreSQL    │    │ • Payment APIs  │
│ • shadcn/ui     │    │ • Redis Cache   │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

### **Current Implementation (Frontend-Only)**

The current system is a frontend-only implementation with:
- Mock data for demonstration
- Simulated API responses
- Local state management
- Client-side routing

## 🎯 Design Principles

### **1. Component-Driven Development**
- Reusable, composable components
- Single responsibility principle
- Props-based configuration
- Consistent API patterns

### **2. Type Safety**
- TypeScript throughout the codebase
- Strict type checking
- Interface-driven development
- Runtime type validation (planned)

### **3. Performance First**
- Server-side rendering (SSR)
- Static site generation (SSG)
- Code splitting and lazy loading
- Image optimization
- Caching strategies

### **4. Accessibility**
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support

### **5. Mobile-First Design**
- Responsive layouts
- Touch-friendly interfaces
- Progressive Web App (PWA) capabilities
- Offline functionality (planned)

## 📁 Directory Structure

### **App Directory (Next.js 14 App Router)**

\`\`\`
app/
├── (auth)/                 # Route groups for authentication
│   ├── login/             # Login page
│   └── register/          # Registration page
├── admin/                 # Admin dashboard routes
│   ├── dashboard/         # Main admin interface
│   └── login/             # Admin authentication
├── bookings/              # Booking management
├── coworking/             # Coworking space routes
├── event-spaces/          # Event venue routes
├── settings/              # User settings
├── dashboard/             # User dashboard
├── about/                 # Static pages
├── globals.css            # Global styles
├── layout.tsx             # Root layout component
└── page.tsx               # Homepage
\`\`\`

**Key Features:**
- **Route Groups**: `(auth)` groups related routes without affecting URL structure
- **Nested Layouts**: Each directory can have its own layout
- **Loading States**: `loading.tsx` files provide loading UI
- **Error Boundaries**: `error.tsx` files handle route-level errors

### **Components Architecture**

\`\`\`
components/
├── admin/                 # Admin-specific components
│   ├── admin-analytics.tsx
│   ├── payment-verification.tsx
│   ├── space-management.tsx
│   ├── system-settings.tsx
│   └── user-management.tsx
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/                # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── navigation.tsx
├── forms/                 # Form components
├── booking/               # Booking-related components
└── shared/                # Shared utility components
\`\`\`

**Component Patterns:**

1. **Compound Components**
   \`\`\`tsx
   <Card>
     <Card.Header>
       <Card.Title>Title</Card.Title>
     </Card.Header>
     <Card.Content>Content</Card.Content>
   </Card>
   \`\`\`

2. **Render Props**
   \`\`\`tsx
   <DataProvider>
     {({ data, loading, error }) => (
       <div>{loading ? 'Loading...' : data}</div>
     )}
   </DataProvider>
   \`\`\`

3. **Custom Hooks**
   \`\`\`tsx
   const { bookings, createBooking, loading } = useBookings();
   \`\`\`

## 🔄 State Management

### **Current Approach: React Hooks + Context**

\`\`\`typescript
// Context for global state
const AppContext = createContext<AppState | undefined>(undefined);

// Custom hook for accessing context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);
  
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};
\`\`\`

### **State Categories**

1. **Server State** (Future)
   - API data
   - Caching
   - Synchronization
   - Background updates

2. **Client State**
   - UI state
   - Form data
   - User preferences
   - Navigation state

3. **URL State**
   - Route parameters
   - Query strings
   - Search filters
   - Pagination

### **Future State Management Options**

When backend is implemented, consider:

1. **TanStack Query (React Query)**
   \`\`\`typescript
   const { data, isLoading, error } = useQuery({
     queryKey: ['bookings'],
     queryFn: fetchBookings,
   });
   \`\`\`

2. **SWR**
   \`\`\`typescript
   const { data, error, isLoading } = useSWR('/api/bookings', fetcher);
   \`\`\`

3. **Zustand** (for complex client state)
   \`\`\`typescript
   const useStore = create((set) => ({
     bookings: [],
     addBooking: (booking) => set((state) => ({ 
       bookings: [...state.bookings, booking] 
     })),
   }));
   \`\`\`

## 🎨 Styling Architecture

### **Tailwind CSS Configuration**

\`\`\`typescript
// tailwind.config.ts
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        nithub: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Dark mode colors
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
\`\`\`

### **CSS Architecture Patterns**

1. **Utility-First Approach**
   \`\`\`tsx
   <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
   \`\`\`

2. **Component Classes** (when needed)
   \`\`\`css
   @layer components {
     .btn-primary {
       @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors;
     }
   }
   \`\`\`

3. **CSS Variables for Theming**
   \`\`\`css
   :root {
     --color-primary: 59 130 246;
     --color-background: 255 255 255;
   }
   
   .dark {
     --color-primary: 96 165 250;
     --color-background: 10 10 10;
   }
   \`\`\`

## 🔐 Authentication & Authorization

### **Current Implementation (Mock)**

\`\`\`typescript
// hooks/use-admin-auth.ts
interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
}

const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  
  const login = async (email: string, password: string) => {
    // Mock authentication
    const mockAdmin = MOCK_ADMINS.find(a => a.email === email);
    if (mockAdmin && password === 'admin123') {
      setAdmin(mockAdmin);
      return { success: true };
    }
    throw new Error('Invalid credentials');
  };
  
  return { admin, login, logout };
};
\`\`\`

### **Future Authentication Architecture**

\`\`\`typescript
// Future JWT-based authentication
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);
  
  const login = async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const { token, user } = await response.json();
    
    // Store token securely
    localStorage.setItem('token', token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };
  
  return { ...state, login, logout, refreshToken };
};
\`\`\`

### **Role-Based Access Control (RBAC)**

\`\`\`typescript
// Permission system
enum Permission {
  VIEW_BOOKINGS = 'view_bookings',
  MANAGE_USERS = 'manage_users',
  VERIFY_PAYMENTS = 'verify_payments',
  SYSTEM_SETTINGS = 'system_settings',
}

const ROLE_PERMISSIONS = {
  admin: [Permission.VIEW_BOOKINGS, Permission.VERIFY_PAYMENTS],
  super_admin: Object.values(Permission),
};

const hasPermission = (userRole: string, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

// Usage in components
const PaymentVerification = () => {
  const { admin } = useAdminAuth();
  
  if (!hasPermission(admin?.role, Permission.VERIFY_PAYMENTS)) {
    return <UnauthorizedMessage />;
  }
  
  return <PaymentVerificationContent />;
};
\`\`\`

## 📊 Data Flow Architecture

### **Current Data Flow (Mock Data)**

\`\`\`
Component → Custom Hook → Mock Data → Component State → UI Update
\`\`\`

Example:
\`\`\`typescript
// 1. Component requests data
const BookingsList = () => {
  const { bookings, loading } = useBookings();
  
  // 4. UI updates based on state
  if (loading) return <LoadingSpinner />;
  return <BookingTable bookings={bookings} />;
};

// 2. Custom hook manages data
const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 3. Mock data is loaded
    setBookings(MOCK_BOOKINGS);
    setLoading(false);
  }, []);
  
  return { bookings, loading };
};
\`\`\`

### **Future Data Flow (With Backend)**

\`\`\`
Component → Custom Hook → API Call → Cache → Component State → UI Update
                ↓
        Background Sync ← Server State Management
\`\`\`

Example with React Query:
\`\`\`typescript
// API layer
const bookingApi = {
  getAll: () => fetch('/api/bookings').then(res => res.json()),
  create: (booking) => fetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  }),
};

// Custom hook with caching
const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation for creating bookings
const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
  });
};
\`\`\`

## 🔌 Integration Architecture

### **Calendar Integration**

\`\`\`typescript
// Abstract calendar provider interface
interface CalendarProvider {
  name: string;
  authenticate(): Promise<void>;
  createEvent(event: CalendarEvent): Promise<string>;
  updateEvent(id: string, event: CalendarEvent): Promise<void>;
  deleteEvent(id: string): Promise<void>;
  getEvents(dateRange: DateRange): Promise<CalendarEvent[]>;
}

// Google Calendar implementation
class GoogleCalendarProvider implements CalendarProvider {
  name = 'google';
  
  async authenticate() {
    // OAuth 2.0 flow
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    this.client = await auth.getClient();
  }
  
  async createEvent(event: CalendarEvent) {
    const response = await this.client.request({
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      method: 'POST',
      data: this.formatEvent(event),
    });
    return response.data.id;
  }
}

// Calendar sync hook
const useCalendarSync = () => {
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  
  const syncEvent = async (event: CalendarEvent) => {
    const promises = providers.map(provider => 
      provider.createEvent(event)
    );
    return Promise.allSettled(promises);
  };
  
  return { providers, syncEvent, addProvider, removeProvider };
};
\`\`\`

### **Payment Integration**

\`\`\`typescript
// Payment gateway abstraction
interface PaymentGateway {
  name: string;
  initialize(config: PaymentConfig): void;
  createPayment(amount: number, currency: string): Promise<PaymentIntent>;
  verifyPayment(reference: string): Promise<PaymentStatus>;
  processRefund(paymentId: string, amount?: number): Promise<RefundResult>;
}

// Paystack implementation
class PaystackGateway implements PaymentGateway {
  name = 'paystack';
  
  async createPayment(amount: number, currency: string) {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        currency,
        callback_url: `${window.location.origin}/payment/callback`,
      }),
    });
    
    return response.json();
  }
}

// Payment hook
const usePayment = () => {
  const [gateway, setGateway] = useState<PaymentGateway>();
  
  const processPayment = async (amount: number, currency: string) => {
    if (!gateway) throw new Error('No payment gateway configured');
    
    const payment = await gateway.createPayment(amount, currency);
    
    // Redirect to payment page or show payment modal
    window.location.href = payment.authorization_url;
  };
  
  return { processPayment, setGateway };
};
\`\`\`

## 🚀 Performance Architecture

### **Code Splitting Strategy**

\`\`\`typescript
// Route-based code splitting (automatic with App Router)
const AdminDashboard = lazy(() => import('./admin/dashboard/page'));
const BookingForm = lazy(() => import('./components/booking-form'));

// Component-based code splitting
const HeavyComponent = lazy(() => import('./heavy-component'));

const MyPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
\`\`\`

### **Image Optimization**

\`\`\`typescript
// Next.js Image component with optimization
import Image from 'next/image';

const SpaceCard = ({ space }) => (
  <div className="space-card">
    <Image
      src={space.image || "/placeholder.svg"}
      alt={space.name}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
);
\`\`\`

### **Caching Strategy**

\`\`\`typescript
// API route caching (future)
export async function GET() {
  const bookings = await getBookings();
  
  return Response.json(bookings, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

// Client-side caching with React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
\`\`\`

## 🧪 Testing Architecture

### **Testing Strategy**

1. **Unit Tests** - Individual components and functions
2. **Integration Tests** - Component interactions
3. **E2E Tests** - Complete user workflows
4. **Visual Regression Tests** - UI consistency

### **Testing Setup (Future)**

\`\`\`typescript
// Jest configuration
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
};

// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingForm } from './booking-form';

describe('BookingForm', () => {
  it('should submit booking data', async () => {
    const onSubmit = jest.fn();
    render(<BookingForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-01-15' },
    });
    
    fireEvent.click(screen.getByText('Book Now'));
    
    expect(onSubmit).toHaveBeenCalledWith({
      date: '2024-01-15',
      // ... other form data
    });
  });
});

// E2E testing with Playwright
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  await page.goto('/coworking');
  await page.click('[data-testid="book-space"]');
  await page.fill('[name="date"]', '2024-01-15');
  await page.click('[data-testid="submit-booking"]');
  
  await expect(page.locator('.success-message')).toBeVisible();
});
\`\`\`

## 📱 Mobile Architecture

### **Responsive Design Strategy**

\`\`\`typescript
// Mobile-first breakpoints
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
};

// Responsive component example
const ResponsiveGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Grid items */}
  </div>
);
\`\`\`

### **Touch Interactions**

\`\`\`typescript
// Touch-friendly components
const TouchButton = ({ children, ...props }) => (
  <button
    className="min-h-[44px] min-w-[44px] touch-manipulation"
    {...props}
  >
    {children}
  </button>
);

// Swipe gestures (future)
const useSwipeGesture = (onSwipe: (direction: string) => void) => {
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    
    if (Math.abs(distance) > 50) {
      onSwipe(distance > 0 ? 'left' : 'right');
    }
  };
  
  return { handleTouchStart, handleTouchEnd };
};
\`\`\`

## 🔮 Future Architecture Considerations

### **Microservices Architecture**

When scaling, consider breaking into services:

\`\`\`
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   User Service  │  │ Booking Service │  │ Payment Service │
│                 │  │                 │  │                 │
│ • Authentication│  │ • Space mgmt    │  │ • Transactions  │
│ • User profiles │  │ • Reservations  │  │ • Billing       │
│ • Permissions   │  │ • Availability  │  │ • Refunds       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    ┌─────────────────┐
                    │  API Gateway    │
                    │                 │
                    │ • Routing       │
                    │ • Rate limiting │
                    │ • Authentication│
                    └─────────────────┘
\`\`\`

### **Event-Driven Architecture**

\`\`\`typescript
// Event system for decoupled communication
interface DomainEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  version: number;
}

class EventBus {
  private handlers = new Map<string, Function[]>();
  
  subscribe(eventType: string, handler: Function) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
  
  publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }
}

// Usage
eventBus.subscribe('booking.created', (event) => {
  // Send confirmation email
  // Update calendar
  // Process payment
});

eventBus.publish({
  id: uuid(),
  type: 'booking.created',
  payload: { bookingId: '123', userId: '456' },
  timestamp: new Date(),
  version: 1,
});
\`\`\`

### **Progressive Web App (PWA)**

\`\`\`typescript
// Service worker for offline functionality
// public/sw.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

// PWA manifest
// public/manifest.json
{
  "name": "Nithub Space Management",
  "short_name": "Nithub",
  "description": "Manage coworking spaces and events",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
\`\`\`

This architecture provides a solid foundation for the current implementation while being flexible enough to accommodate future growth and feature additions.
