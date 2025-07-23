# Component Documentation

This guide provides comprehensive documentation for all components in the Nithub Space Management System, including usage examples, props interfaces, and best practices.

## 📋 Table of Contents

- [Component Architecture](#component-architecture)
- [Layout Components](#layout-components)
- [Form Components](#form-components)
- [Booking Components](#booking-components)
- [Admin Components](#admin-components)
- [UI Components](#ui-components)
- [Custom Hooks](#custom-hooks)
- [Component Patterns](#component-patterns)
- [Testing Components](#testing-components)

## 🏗️ Component Architecture

### **Component Categories**

\`\`\`
components/
├── layout/           # Layout and navigation components
├── forms/           # Form-related components
├── booking/         # Booking-specific components
├── admin/           # Admin dashboard components
├── ui/              # Base UI components (shadcn/ui)
├── shared/          # Shared utility components
└── providers/       # Context providers
\`\`\`

### **Design Principles**

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs by composing simple components
3. **Props Interface**: Well-defined TypeScript interfaces for all props
4. **Accessibility First**: WCAG 2.1 AA compliance built-in
5. **Performance Optimized**: Memoization and lazy loading where appropriate

## 🎨 Layout Components

### **Header Component**

The main navigation header with authentication, theme toggle, and admin access.

\`\`\`typescript
// components/header.tsx
interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { admin } = useAdminAuth();
  
  return (
    <header className={cn("border-b bg-background/95 backdrop-blur", className)}>
      {/* Navigation content */}
    </header>
  );
};
\`\`\`

**Features:**
- Responsive navigation menu
- User authentication status
- Admin access (when authenticated as admin)
- Dark mode toggle
- Mobile-friendly hamburger menu

**Usage:**
\`\`\`tsx
<Header className="sticky top-0 z-50" />
\`\`\`

### **Footer Component**

Site footer with links, contact information, and social media.

\`\`\`typescript
// components/footer.tsx
interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("border-t bg-muted/50", className)}>
      {/* Footer content */}
    </footer>
  );
};
\`\`\`

**Features:**
- Company information
- Quick links
- Contact details
- Social media links
- Newsletter signup

### **Theme Provider**

Manages dark/light theme state across the application.

\`\`\`typescript
// components/theme-provider.tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
  storageKey?: string;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'nithub-theme'
}: ThemeProviderProps) => {
  // Theme management logic
};
\`\`\`

**Usage:**
\`\`\`tsx
// app/layout.tsx
<ThemeProvider defaultTheme="system" storageKey="nithub-theme">
  <App />
</ThemeProvider>
\`\`\`

## 📝 Form Components

### **Booking Form**

Comprehensive form for creating space bookings.

\`\`\`typescript
// components/forms/booking-form.tsx
interface BookingFormProps {
  spaceType: 'coworking' | 'event';
  spaceId?: string;
  onSubmit: (data: BookingFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<BookingFormData>;
  isLoading?: boolean;
}

interface BookingFormData {
  spaceId: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  attendees?: number;
  specialRequests?: string;
  calendarSync?: boolean;
  selectedProviders?: string[];
}

export const BookingForm = ({
  spaceType,
  spaceId,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}: BookingFormProps) => {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
      </form>
    </Form>
  );
};
\`\`\`

**Features:**
- Real-time validation with Zod
- Conflict detection integration
- Calendar sync options
- Responsive design
- Accessibility compliant

**Usage:**
\`\`\`tsx
const handleBookingSubmit = (data: BookingFormData) => {
  createBooking(data);
};

<BookingForm
  spaceType="event"
  spaceId="space-123"
  onSubmit={handleBookingSubmit}
  isLoading={isCreating}
/>
\`\`\`

### **Contact Form**

Contact form with validation and submission handling.

\`\`\`typescript
// components/forms/contact-form.tsx
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm = ({ onSubmit, className }: ContactFormProps) => {
  // Form implementation
};
\`\`\`

**Features:**
- Email validation
- Character limits
- Spam protection
- Success/error states

## 📅 Booking Components

### **Availability Calendar**

Interactive calendar showing space availability.

\`\`\`typescript
// components/availability-calendar.tsx
interface AvailabilityCalendarProps {
  spaceId: string;
  spaceType: 'coworking' | 'event';
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  onTimeSelect?: (time: string) => void;
  className?: string;
}

export const AvailabilityCalendar = ({
  spaceId,
  spaceType,
  selectedDate,
  onDateSelect,
  onTimeSelect,
  className
}: AvailabilityCalendarProps) => {
  const { data: availability } = useAvailability(spaceId, spaceType);
  
  return (
    <div className={cn("availability-calendar", className)}>
      {/* Calendar implementation */}
    </div>
  );
};
\`\`\`

**Features:**
- Real-time availability data
- Visual availability indicators
- Date and time selection
- Conflict highlighting
- Mobile-responsive

**Usage:**
\`\`\`tsx
<AvailabilityCalendar
  spaceId="space-123"
  spaceType="event"
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
  onTimeSelect={setSelectedTime}
/>
\`\`\`

### **Conflict Checker**

Component that checks and displays booking conflicts.

\`\`\`typescript
// components/conflict-checker.tsx
interface ConflictCheckerProps {
  spaceId: string;
  spaceType: 'coworking' | 'event';
  date: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  onConflictDetected?: (conflicts: Conflict[]) => void;
  className?: string;
}

interface Conflict {
  id: string;
  type: 'overlap' | 'capacity' | 'maintenance';
  message: string;
  severity: 'warning' | 'error';
  suggestions?: string[];
}

export const ConflictChecker = ({
  spaceId,
  spaceType,
  date,
  startTime,
  endTime,
  duration,
  onConflictDetected,
  className
}: ConflictCheckerProps) => {
  const { conflicts, isChecking } = useConflictDetection({
    spaceId,
    spaceType,
    date,
    startTime,
    endTime,
    duration,
  });

  useEffect(() => {
    if (conflicts.length > 0 && onConflictDetected) {
      onConflictDetected(conflicts);
    }
  }, [conflicts, onConflictDetected]);

  if (isChecking) {
    return <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Checking availability...
    </div>;
  }

  if (conflicts.length === 0) {
    return <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="h-4 w-4" />
      No conflicts detected
    </div>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {conflicts.map((conflict) => (
        <Alert key={conflict.id} variant={conflict.severity === 'error' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {conflict.severity === 'error' ? 'Booking Conflict' : 'Warning'}
          </AlertTitle>
          <AlertDescription>
            {conflict.message}
            {conflict.suggestions && (
              <ul className="mt-2 list-disc list-inside">
                {conflict.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
\`\`\`

**Features:**
- Real-time conflict detection
- Multiple conflict types
- Severity levels
- Suggested alternatives
- Visual feedback

### **Calendar Sync Component**

Manages calendar integration and synchronization.

\`\`\`typescript
// components/calendar-sync.tsx
interface CalendarSyncProps {
  bookingId?: string;
  onProvidersChange?: (providers: string[]) => void;
  className?: string;
}

export const CalendarSync = ({
  bookingId,
  onProvidersChange,
  className
}: CalendarSyncProps) => {
  const {
    providers,
    connectedProviders,
    connectProvider,
    disconnectProvider,
    syncEvent,
    isConnecting,
    isSyncing
  } = useCalendarSync();

  return (
    <div className={cn("calendar-sync", className)}>
      {/* Calendar sync UI */}
    </div>
  );
};
\`\`\`

**Features:**
- Multiple provider support (Google, Outlook)
- OAuth authentication flow
- Real-time sync status
- Provider management
- Event creation/updates

## 👨‍💼 Admin Components

### **Payment Verification**

Admin component for verifying and managing payments.

\`\`\`typescript
// components/admin/payment-verification.tsx
interface PaymentVerificationProps {
  className?: string;
}

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'verified' | 'failed';
  paymentMethod: string;
  reference: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export const PaymentVerification = ({ className }: PaymentVerificationProps) => {
  const { data: payments, isLoading } = usePayments({ status: 'pending' });
  const { mutate: verifyPayment } = useVerifyPayment();
  const { mutate: processRefund } = useProcessRefund();

  const handleVerifyPayment = (paymentId: string) => {
    verifyPayment(paymentId, {
      onSuccess: () => {
        toast.success('Payment verified successfully');
      },
      onError: (error) => {
        toast.error(`Verification failed: ${error.message}`);
      },
    });
  };

  return (
    <div className={cn("payment-verification", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment Verification</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {payments?.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={payment.status === 'pending' ? 'secondary' : 'default'}>
                        {payment.status}
                      </Badge>
                      <span className="font-medium">#{payment.reference}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.user.name} • {payment.user.email}
                    </p>
                    <p className="text-lg font-semibold">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerifyPayment(payment.id)}
                      disabled={payment.status !== 'pending'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* View details */}}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
\`\`\`

**Features:**
- Real-time payment status
- Bulk operations
- Payment verification
- Refund processing
- Export functionality
- Search and filtering

### **User Management**

Admin component for managing user accounts (Super Admin only).

\`\`\`typescript
// components/admin/user-management.tsx
interface UserManagementProps {
  className?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastLogin: string;
  totalBookings: number;
  totalSpent: number;
}

export const UserManagement = ({ className }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: users, isLoading } = useUsers({
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  return (
    <div className={cn("user-management", className)}>
      {/* User management UI */}
    </div>
  );
};
\`\`\`

**Features:**
- User search and filtering
- Account status management
- Bulk operations
- User activity tracking
- Export user data
- Password reset functionality

### **Space Management**

Admin component for managing coworking and event spaces.

\`\`\`typescript
// components/admin/space-management.tsx
interface SpaceManagementProps {
  className?: string;
}

export const SpaceManagement = ({ className }: SpaceManagementProps) => {
  const [activeTab, setActiveTab] = useState<'coworking' | 'event'>('coworking');
  
  return (
    <div className={cn("space-management", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="coworking">Coworking Spaces</TabsTrigger>
          <TabsTrigger value="event">Event Spaces</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coworking">
          <CoworkingSpaceManager />
        </TabsContent>
        
        <TabsContent value="event">
          <EventSpaceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
\`\`\`

**Features:**
- Space creation and editing
- Pricing management
- Feature configuration
- Image upload
- Availability settings
- Analytics per space

## 🎨 UI Components

### **Custom Button Variants**

Extended button component with additional variants.

\`\`\`typescript
// components/ui/button.tsx (extended)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Custom variants
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
        nithub: "bg-nithub-primary text-white hover:bg-nithub-primary/90",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
        xl: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
\`\`\`

### **Loading States**

Reusable loading components for different scenarios.

\`\`\`typescript
// components/ui/loading.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export const LoadingSkeleton = ({ lines = 3, className }: LoadingSkeletonProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
};

interface LoadingCardProps {
  count?: number;
  className?: string;
}

export const LoadingCard = ({ count = 1, className }: LoadingCardProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
\`\`\`

### **Error States**

Components for displaying error states and messages.

\`\`\`typescript
// components/ui/error-state.tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
  className
}: ErrorStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorBoundaryFallback = ({ error, resetError }: ErrorBoundaryFallbackProps) => {
  return (
    <ErrorState
      title="Application Error"
      message={error.message || 'The application encountered an unexpected error.'}
      action={{
        label: 'Try Again',
        onClick: resetError,
      }}
    />
  );
};
\`\`\`

## 🪝 Custom Hooks

### **useBookings Hook**

Manages booking data and operations.

\`\`\`typescript
// hooks/use-bookings.ts
interface UseBookingsOptions {
  status?: 'pending' | 'confirmed' | 'cancelled';
  type?: 'coworking' | 'event';
  page?: number;
  limit?: number;
}

interface UseBookingsReturn {
  bookings: Booking[];
  total: number;
  page: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  updateBooking: (id: string, data: UpdateBookingData) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
}

export const useBookings = (options: UseBookingsOptions = {}): UseBookingsReturn => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookings', options],
    queryFn: () => apiClient.getBookings(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createBookingMutation = useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingData }) =>
      apiClient.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: apiClient.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });

  return {
    bookings: data?.bookings || [],
    total: data?.total || 0,
    page: data?.page || 1,
    isLoading,
    error,
    refetch,
    createBooking: createBookingMutation.mutateAsync,
    updateBooking: updateBookingMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
  };
};
\`\`\`

### **useAuth Hook**

Manages user authentication state.

\`\`\`typescript
// hooks/use-auth.ts
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: apiClient.getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      authManager.setTokens(data.tokens);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiClient.logout,
    onSuccess: () => {
      queryClient.clear();
      authManager.clearTokens();
    },
  });

  const registerMutation = useMutation({
    mutationFn: apiClient.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      authManager.setTokens(data.tokens);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: apiClient.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'me'], updatedUser);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    register: registerMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  };
};
\`\`\`

### **useLocalStorage Hook**

Manages local storage with TypeScript support.

\`\`\`typescript
// hooks/use-local-storage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
\`\`\`

## 🎭 Component Patterns

### **Compound Components**

Building complex components with multiple parts.

\`\`\`typescript
// components/ui/card.tsx (compound pattern)
interface CardContextValue {
  variant?: 'default' | 'outlined' | 'elevated';
}

const CardContext = createContext<CardContextValue>({});

const Card = ({ variant = 'default', className, ...props }: CardProps) => {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          variant === 'elevated' && 'shadow-lg',
          variant === 'outlined' && 'border-2',
          className
        )}
        {...props}
      />
    </CardContext.Provider>
  );
};

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  const { variant } = useContext(CardContext);
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        variant === 'elevated' && 'pb-4',
        className
      )}
      {...props}
    />
  );
};

// Usage
<Card variant="elevated">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card>
\`\`\`

### **Render Props Pattern**

Flexible component composition with render props.

\`\`\`typescript
// components/data-provider.tsx
interface DataProviderProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (props: {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

export function DataProvider<T>({ queryKey, queryFn, children }: DataProviderProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  return <>{children({ data, isLoading, error, refetch })}</>;
}

// Usage
<DataProvider
  queryKey={['bookings']}
  queryFn={() => apiClient.getBookings()}
>
  {({ data: bookings, isLoading, error }) => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorState />;
    return <BookingsList bookings={bookings} />;
  }}
</DataProvider>
\`\`\`

### **Higher-Order Components (HOCs)**

Component enhancement with HOCs.

\`\`\`typescript
// components/hoc/with-auth.tsx
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'user' | 'admin' | 'super_admin'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <ErrorState title="Unauthorized" message="You don't have permission to access this page." />;
    }

    return <Component {...props} />;
  };
}

// Usage
const ProtectedBookingPage = withAuth(BookingPage, 'user');
const AdminDashboard = withAuth(AdminDashboardPage, 'admin');
\`\`\`

## 🧪 Testing Components

### **Component Testing Setup**

\`\`\`typescript
// __tests__/components/booking-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookingForm } from '@/components/forms/booking-form';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('BookingForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields', () => {
    renderWithProviders(
      <BookingForm
        spaceType="coworking"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    renderWithProviders(
      <BookingForm
        spaceType="coworking"
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /book now/i }));

    await waitFor(() => {
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    renderWithProviders(
      <BookingForm
        spaceType="coworking"
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-01-15' },
    });
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '09:00' },
    });

    fireEvent.click(screen.getByRole('button', { name: /book now/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        date: '2024-01-15',
        startTime: '09:00',
        // ... other form data
      });
    });
  });
});
\`\`\`

### **Hook Testing**

\`\`\`typescript
// __tests__/hooks/use-bookings.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBookings } from '@/hooks/use-bookings';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useBookings', () => {
  it('should fetch bookings', async () => {
    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookings).toHaveLength(2);
    expect(result.current.bookings[0]).toMatchObject({
      id: expect.any(String),
      type: expect.stringMatching(/^(coworking|event)$/),
      status: expect.stringMatching(/^(pending|confirmed|cancelled)$/),
    });
  });
});
\`\`\`

### **Visual Testing**

\`\`\`typescript
// __tests__/visual/components.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BookingForm } from '@/components/forms/booking-form';

const meta: Meta<typeof BookingForm> = {
  title: 'Forms/BookingForm',
  component: BookingForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    spaceType: 'coworking',
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};

export const EventBooking: Story = {
  args: {
    spaceType: 'event',
    onSubmit: (data) => console.log('Event booking:', data),
  },
};

export const WithInitialData: Story = {
  args: {
    spaceType: 'coworking',
    initialData: {
      date: '2024-01-15',
      startTime: '09:00',
      duration: '8 hours',
    },
    onSubmit: (data) => console.log('Form with initial data:', data),
  },
};

export const Loading: Story = {
  args: {
    spaceType: 'coworking',
    isLoading: true,
    onSubmit: (data) => console.log('Loading state:', data),
  },
};
\`\`\`

## 📝 Component Documentation Standards

### **JSDoc Comments**

\`\`\`typescript
/**
 * BookingForm component for creating space reservations
 * 
 * @example
 * \`\`\`tsx
 * <BookingForm
 *   spaceType="event"
 *   spaceId="space-123"
 *   onSubmit={handleSubmit}
 *   isLoading={isCreating}
 * />
 * ```
 */
export const BookingForm = ({
  spaceType,
  spaceId,
  onSubmit,
  isLoading = false
}: BookingFormProps) => {
  // Component implementation
};
\`\`\`

### **Props Documentation**

\`\`\`typescript
interface BookingFormProps {
  /** Type of space being booked */
  spaceType: 'coworking' | 'event';
  
  /** Optional space ID to pre-select */
  spaceId?: string;
  
  /** Callback function called when form is submitted */
  onSubmit: (data: BookingFormData) => void;
  
  /** Optional callback for form cancellation */
  onCancel?: () => void;
  
  /** Initial form data for editing existing bookings */
  initialData?: Partial<BookingFormData>;
  
  /** Loading state to disable form during submission */
  isLoading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}
\`\`\`

This comprehensive component documentation provides everything needed to understand, use, and extend the components in the Nithub Space Management System. Each component is designed to be reusable, accessible, and well-tested.
