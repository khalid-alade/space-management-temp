# Nithub Space Management - Admin System Documentation

## Table of Contents

1. [Overview](#overview)
2. [Admin Roles](#admin-roles)
3. [Admin Dashboard](#admin-dashboard)
4. [Admin Features](#admin-features)
5. [Security Features](#security-features)
6. [API Endpoints](#api-endpoints)
7. [Integration with Main System](#integration-with-main-system)
8. [Future Enhancements](#future-enhancements)
9. [Troubleshooting](#troubleshooting)
10. [Testing Admin System](#testing-admin-system)
11. [Admin Workflows](#admin-workflows)
12. [Implementation Details](#implementation-details)
13. [Database Schema](#database-schema)
14. [Authentication Flow](#authentication-flow)
15. [Security Best Practices](#security-best-practices)
16. [Customization Options](#customization-options)
17. [Performance Considerations](#performance-considerations)
18. [Migration Guide](#migration-guide)

## Overview

The Nithub Space Management Admin System provides a comprehensive interface for administrators to manage the platform. It features role-based access control with two admin types: regular admins and super admins, each with different permission levels.

### Key Features

- **Role-based access control**: Different permissions for regular and super admins
- **Payment verification**: Process and verify user payments
- **User management**: Manage user accounts and permissions
- **Space management**: Configure coworking and event spaces
- **Analytics dashboard**: View system performance metrics
- **System settings**: Configure platform-wide settings

## Admin Roles

### Regular Admin
- **Permissions**: Limited to payment verification and basic analytics
- **Use case**: Front desk staff, customer support representatives
- **Access areas**: Payment verification, basic analytics

### Super Admin
- **Permissions**: Full system access including all settings and configurations
- **Use case**: Business owners, IT administrators, operations managers
- **Access areas**: All admin features including system settings, user management, and financial data

## Admin Dashboard

### Dashboard Layout

The admin dashboard uses a tabbed interface with role-based visibility:

\`\`\`typescript
interface DashboardTab {
  id: string;
  label: string;
  icon: React.ComponentType;
  component: React.ComponentType;
  requiredRole?: 'admin' | 'super_admin';
}

const DASHBOARD_TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    component: AdminAnalytics,
    // Available to all admin roles
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    component: PaymentVerification,
    // Available to all admin roles
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    component: UserManagement,
    requiredRole: 'super_admin' // Super admin only
  },
  {
    id: 'spaces',
    label: 'Spaces',
    icon: Building,
    component: SpaceManagement,
    requiredRole: 'super_admin' // Super admin only
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    component: SystemSettings,
    requiredRole: 'super_admin' // Super admin only
  }
];
\`\`\`

### Permission Checking

\`\`\`typescript
// Permission checking utility
const hasPermission = (adminRole: string, requiredRole?: string) => {
  if (!requiredRole) return true; // No specific role required
  if (adminRole === 'super_admin') return true; // Super admin has all permissions
  return adminRole === requiredRole;
};
\`\`\`

## Admin Features

### 1. Payment Verification (All Admins)

**Purpose**: Verify and manage payment transactions

**Features**:
- View pending payments
- Verify payment status
- Process refunds
- View transaction history
- Search and filter payments

**Interface**:
\`\`\`typescript
interface PaymentVerificationProps {
  // Automatically loads pending payments
}

// Key functions
const verifyPayment = (paymentId: string) => {
  // Mark payment as verified
  // Update booking status
  // Send confirmation email
};

const processRefund = (paymentId: string, amount: number) => {
  // Process refund through payment gateway
  // Update payment status
  // Notify user
};
\`\`\`

### 2. User Management (Super Admin Only)

**Purpose**: Manage user accounts and permissions

**Features**:
- View all users
- Edit user profiles
- Suspend/activate accounts
- View user booking history
- Reset user passwords
- Export user data

**Interface**:
\`\`\`typescript
interface UserManagementProps {
  // Loads all users with pagination
}

// Key functions
const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
  // Update user account status
  // Send notification email
};

const resetUserPassword = (userId: string) => {
  // Generate temporary password
  // Send reset email
};
\`\`\`

### 3. Space Management (Super Admin Only)

**Purpose**: Configure coworking and event spaces

**Features**:
- Add/edit/delete spaces
- Set pricing and availability
- Manage space features
- Upload space images
- Configure booking rules

**Interface**:
\`\`\`typescript
interface SpaceManagementProps {
  // Manages both coworking and event spaces
}

// Key functions
const createSpace = (spaceData: SpaceData) => {
  // Create new space
  // Set default availability
  // Upload images
};

const updatePricing = (spaceId: string, pricing: PricingData) => {
  // Update space pricing
  // Apply to future bookings
};
\`\`\`

### 4. System Analytics (All Admins)

**Purpose**: View system performance and usage statistics

**Metrics Available**:

#### For All Admins:
- Daily/weekly/monthly bookings
- Payment success rates
- Popular spaces
- User activity

#### For Super Admins Only:
- Revenue analytics
- Profit margins
- User growth trends
- System performance metrics
- Financial reports

**Interface**:
\`\`\`typescript
interface AdminAnalyticsProps {
  adminRole: 'admin' | 'super_admin';
}

// Metrics calculation
const calculateMetrics = (role: string) => {
  const baseMetrics = {
    totalBookings: getTotalBookings(),
    activeUsers: getActiveUsers(),
    paymentSuccessRate: getPaymentSuccessRate(),
  };

  if (role === 'super_admin') {
    return {
      ...baseMetrics,
      totalRevenue: getTotalRevenue(),
      profitMargin: getProfitMargin(),
      userGrowth: getUserGrowthRate(),
    };
  }

  return baseMetrics;
};
\`\`\`

### 5. System Settings (Super Admin Only)

**Purpose**: Configure system-wide settings

**Settings Categories**:

#### General Settings
- Site name and description
- Contact information
- Business hours
- Maintenance mode

#### Payment Settings
- Payment gateway configuration
- Supported payment methods
- Transaction fees
- Minimum payment amounts

#### Email Settings
- SMTP configuration
- Email templates
- Notification preferences
- Automated email settings

#### Security Settings
- Password policies
- Session timeouts
- API rate limiting
- Two-factor authentication

#### Appearance Settings
- Brand colors
- Logo and favicon
- Custom CSS
- Theme configuration

## Security Features

### 1. Role-Based Access Control (RBAC)

\`\`\`typescript
// Permission matrix
const PERMISSIONS = {
  'admin': [
    'view_bookings',
    'verify_payments',
    'view_users',
    'view_basic_analytics'
  ],
  'super_admin': [
    'all_admin_permissions',
    'manage_users',
    'manage_spaces',
    'system_settings',
    'financial_reports',
    'manage_admins'
  ]
};

// Permission checking middleware
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const adminRole = req.admin?.role;
    if (!hasPermission(adminRole, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
\`\`\`

### 2. Session Management

\`\`\`typescript
// Session configuration
const SESSION_CONFIG = {
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
};

// Auto-logout on inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
\`\`\`

### 3. Audit Logging

\`\`\`typescript
interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Log admin actions
const logAdminAction = (
  adminId: string,
  action: string,
  resource: string,
  details: any
) => {
  // Save to audit log
  // Monitor for suspicious activity
};
\`\`\`

## API Endpoints

### Authentication Endpoints

\`\`\`typescript
POST /api/admin/auth/login
{
  "email": "admin@nithub.com",
  "password": "admin123"
}

GET /api/admin/auth/me
// Returns current admin profile

POST /api/admin/auth/logout
// Invalidates session
\`\`\`

### Admin Management Endpoints

\`\`\`typescript
// User management (Super Admin only)
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id

// Payment management
GET /api/admin/payments
POST /api/admin/payments/:id/verify
POST /api/admin/payments/:id/refund

// System settings (Super Admin only)
GET /api/admin/settings
PUT /api/admin/settings

// Analytics
GET /api/admin/analytics
GET /api/admin/analytics/revenue (Super Admin only)
\`\`\`

## Integration with Main System

### Header Integration

The main site header includes admin access:

\`\`\`typescript
// In components/header.tsx
const AdminAccess = () => {
  const { admin } = useAdminAuth();
  
  if (admin) {
    return (
      <DropdownMenuItem asChild>
        <Link href="/admin/dashboard">
          <Shield className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Link>
      </DropdownMenuItem>
    );
  }
  
  return (
    <DropdownMenuItem asChild>
      <Link href="/admin/login">
        <Shield className="mr-2 h-4 w-4" />
        Admin Login
      </Link>
    </DropdownMenuItem>
  );
};
\`\`\`

### Protected Routes

\`\`\`typescript
// Admin route protection
const AdminRoute = ({ children, requiredRole }: AdminRouteProps) => {
  const { admin, loading } = useAdminAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!admin) {
    redirect('/admin/login');
    return null;
  }
  
  if (requiredRole && !hasPermission(admin.role, requiredRole)) {
    return <UnauthorizedPage />;
  }
  
  return children;
};
\`\`\`

## Future Enhancements

### 1. Two-Factor Authentication
- SMS-based 2FA
- Authenticator app support
- Backup codes

### 2. Advanced Analytics
- Real-time dashboards
- Custom report builder
- Data export functionality

### 3. Notification System
- Real-time notifications
- Email alerts for critical events
- Mobile push notifications

### 4. Audit Trail
- Comprehensive action logging
- Compliance reporting
- Data retention policies

### 5. Multi-tenant Support
- Multiple organization support
- Isolated admin access
- Tenant-specific settings

## Troubleshooting

### Common Issues

#### 1. Cannot Access Admin Dashboard
**Symptoms**: Redirected to login page
**Solutions**:
- Check if logged in with admin credentials
- Verify session hasn't expired
- Clear browser cache and cookies

#### 2. Permission Denied Errors
**Symptoms**: "Insufficient permissions" message
**Solutions**:
- Verify admin role (regular vs super admin)
- Check if feature requires super admin access
- Contact super admin for role upgrade

#### 3. Payment Verification Not Working
**Symptoms**: Cannot verify payments
**Solutions**:
- Check payment gateway connection
- Verify payment reference exists
- Check network connectivity

### Debug Mode

Enable debug mode for troubleshooting:

\`\`\`typescript
// Set in environment variables
DEBUG_ADMIN=true

// Enables additional logging and error details
\`\`\`

## Testing Admin System

### Unit Tests

\`\`\`typescript
// Test admin authentication
describe('Admin Authentication', () => {
  test('should login with valid credentials', async () => {
    const result = await adminAuth.login('admin@nithub.com', 'admin123');
    expect(result.admin.role).toBe('super_admin');
  });
  
  test('should reject invalid credentials', async () => {
    await expect(
      adminAuth.login('invalid@email.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
  });
});
\`\`\`

### Integration Tests

\`\`\`typescript
// Test admin workflows
describe('Admin Workflows', () => {
  test('should verify payment successfully', async () => {
    const payment = await createTestPayment();
    const result = await adminActions.verifyPayment(payment.id);
    expect(result.status).toBe('verified');
  });
});
\`\`\`

### E2E Tests

\`\`\`typescript
// Test complete admin flows
describe('Admin E2E', () => {
  test('should complete payment verification flow', async () => {
    await page.goto('/admin/login');
    await page.fill('[name="email"]', 'admin@nithub.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.click('[data-tab="payments"]');
    await page.click('[data-action="verify"]:first-child');
    
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
\`\`\`

## Admin Workflows

### Payment Verification Workflow

1. **Login**: Admin logs in with appropriate credentials
2. **Navigate**: Access the Payments tab in the admin dashboard
3. **Review**: View pending payments with transaction details
4. **Verify**: Confirm payment receipt and mark as verified
5. **Notification**: System sends confirmation email to user
6. **Update**: Booking status changes to "confirmed"

\`\`\`typescript
// Payment verification workflow
async function verifyPaymentWorkflow(paymentId: string) {
  try {
    // 1. Fetch payment details
    const payment = await fetchPayment(paymentId);
    
    // 2. Validate payment amount against booking
    const booking = await fetchBooking(payment.bookingId);
    if (payment.amount !== booking.totalAmount) {
      throw new Error('Payment amount mismatch');
    }
    
    // 3. Mark payment as verified
    await updatePaymentStatus(paymentId, 'verified');
    
    // 4. Update booking status
    await updateBookingStatus(booking.id, 'confirmed');
    
    // 5. Send confirmation email
    await sendConfirmationEmail(booking.userId, {
      bookingId: booking.id,
      spaceName: booking.spaceName,
      date: booking.date,
      amount: payment.amount
    });
    
    // 6. Log admin action
    await logAdminAction(
      getCurrentAdminId(),
      'verify_payment',
      'payment',
      { paymentId, bookingId: booking.id }
    );
    
    return { success: true };
  } catch (error) {
    // Log error and return failure
    await logError('payment_verification_failed', error);
    return { success: false, error: error.message };
  }
}
\`\`\`

### User Management Workflow

1. **Access**: Super admin navigates to User Management tab
2. **Search**: Find user by email, name, or ID
3. **Review**: View user details and booking history
4. **Action**: Perform actions like suspend/activate account
5. **Notification**: System notifies user of account changes

\`\`\`typescript
// User suspension workflow
async function suspendUserWorkflow(userId: string, reason: string) {
  try {
    // 1. Fetch user details
    const user = await fetchUser(userId);
    
    // 2. Check for active bookings
    const activeBookings = await fetchActiveBookings(userId);
    
    // 3. Handle active bookings if needed
    if (activeBookings.length > 0) {
      // Option: Cancel bookings or keep them
      await handleActiveBookings(activeBookings);
    }
    
    // 4. Suspend user account
    await updateUserStatus(userId, 'suspended', reason);
    
    // 5. Send notification to user
    await sendUserNotification(userId, {
      type: 'account_suspended',
      reason,
      contactEmail: 'support@nithub.com'
    });
    
    // 6. Log admin action
    await logAdminAction(
      getCurrentAdminId(),
      'suspend_user',
      'user',
      { userId, reason }
    );
    
    return { success: true };
  } catch (error) {
    await logError('user_suspension_failed', error);
    return { success: false, error: error.message };
  }
}
\`\`\`

### Space Management Workflow

1. **Create/Edit**: Super admin configures space details
2. **Pricing**: Set pricing tiers and availability
3. **Features**: Add amenities and space features
4. **Images**: Upload and manage space images
5. **Publish**: Make space available for booking

\`\`\`typescript
// Space creation workflow
async function createSpaceWorkflow(spaceData: SpaceData) {
  try {
    // 1. Validate space data
    validateSpaceData(spaceData);
    
    // 2. Create space record
    const space = await createSpace({
      name: spaceData.name,
      type: spaceData.type,
      capacity: spaceData.capacity,
      description: spaceData.description,
      features: spaceData.features
    });
    
    // 3. Set pricing
    await setPricing(space.id, spaceData.pricing);
    
    // 4. Set availability
    await setAvailability(space.id, spaceData.availability);
    
    // 5. Upload images
    if (spaceData.images && spaceData.images.length > 0) {
      await uploadSpaceImages(space.id, spaceData.images);
    }
    
    // 6. Log admin action
    await logAdminAction(
      getCurrentAdminId(),
      'create_space',
      'space',
      { spaceId: space.id, spaceType: space.type }
    );
    
    return { success: true, spaceId: space.id };
  } catch (error) {
    await logError('space_creation_failed', error);
    return { success: false, error: error.message };
  }
}
\`\`\`

## Implementation Details

### Admin Authentication Implementation

The admin authentication system uses JWT tokens with role-based claims:

\`\`\`typescript
// Admin authentication implementation
import { sign, verify } from 'jsonwebtoken';

// JWT token generation
export const generateAdminToken = (admin: AdminUser): string => {
  return sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: PERMISSIONS[admin.role]
    },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  );
};

// Token verification
export const verifyAdminToken = (token: string): AdminUser | null => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    };
  } catch (error) {
    return null;
  }
};

// Admin authentication hook
export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me');
        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      setAdmin(data.admin);
      return { success: true, admin: data.admin };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    setAdmin(null);
  };
  
  return { admin, loading, login, logout };
};
\`\`\`

### Admin Dashboard Implementation

The admin dashboard uses a tab-based layout with dynamic component rendering:

\`\`\`typescript
// Admin dashboard implementation
export default function AdminDashboard() {
  const { admin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (loading) return <LoadingSpinner />;
  
  if (!admin) {
    redirect('/admin/login');
    return null;
  }
  
  // Filter tabs based on admin role
  const availableTabs = DASHBOARD_TABS.filter(tab => 
    hasPermission(admin.role, tab.requiredRole)
  );
  
  // Find active tab component
  const ActiveTabComponent = availableTabs.find(
    tab => tab.id === activeTab
  )?.component || availableTabs[0].component;
  
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-profile">
          <span>{admin.email}</span>
          <Badge>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</Badge>
        </div>
      </header>
      
      <div className="admin-tabs">
        {availableTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="tab-icon" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="admin-content">
        <ActiveTabComponent adminRole={admin.role} />
      </div>
    </div>
  );
}
\`\`\`

## Database Schema

### Admin Users Table

\`\`\`sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP
);

-- Indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
\`\`\`

### Admin Audit Logs Table

\`\`\`sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON admin_audit_logs(resource);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at);
\`\`\`

### System Settings Table

\`\`\`sql
CREATE TABLE system_settings (
  id VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (id, value, description)
VALUES 
  ('general', '{"siteName":"Nithub Space Management","contactEmail":"info@nithub.com","supportPhone":"+2348012345678","businessHours":"9:00-17:00","maintenanceMode":false}', 'General site settings'),
  ('payment', '{"gateway":"paystack","methods":["card","transfer","ussd"],"minimumAmount":1000,"transactionFee":1.5}', 'Payment settings'),
  ('email', '{"fromName":"Nithub","fromEmail":"no-reply@nithub.com","smtpHost":"smtp.example.com","smtpPort":587}', 'Email settings'),
  ('security', '{"passwordPolicy":{"minLength":8,"requireNumbers":true,"requireSymbols":true},"sessionTimeout":28800,"rateLimiting":true}', 'Security settings'),
  ('appearance', '{"primaryColor":"#0f172a","secondaryColor":"#4f46e5","accentColor":"#f97316","logoUrl":"/images/logo.png"}', 'Appearance settings');
\`\`\`

## Authentication Flow

### Admin Login Flow

1. **Request**: Admin submits email and password
2. **Validation**: Server validates credentials
3. **Token Generation**: Server generates JWT with role claims
4. **Response**: Token returned to client
5. **Storage**: Token stored in HTTP-only cookie
6. **Redirect**: Admin redirected to dashboard

\`\`\`typescript
// Admin login flow
async function handleAdminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    // 1. Find admin by email
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 2. Verify password
    const passwordValid = await verifyPassword(password, admin.password_hash);
    if (!passwordValid) {
      // 3. Log failed attempt
      await logFailedLoginAttempt(email, req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 4. Check account status
    if (admin.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }
    
    // 5. Generate JWT token
    const token = generateAdminToken(admin);
    
    // 6. Update last login timestamp
    await updateLastLogin(admin.id);
    
    // 7. Log successful login
    await logAdminAction(
      admin.id,
      'login',
      'auth',
      { ip: req.ip, userAgent: req.headers['user-agent'] }
    );
    
    // 8. Set HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });
    
    // 9. Return admin data (without sensitive info)
    return res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        firstName: admin.first_name,
        lastName: admin.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
\`\`\`

### Session Verification Flow

\`\`\`typescript
// Middleware to verify admin session
const verifyAdminSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 2. Verify token
    const adminData = verifyAdminToken(token);
    if (!adminData) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    // 3. Check if admin still exists and is active
    const admin = await findAdminById(adminData.id);
    if (!admin || admin.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }
    
    // 4. Attach admin to request
    req.admin = adminData;
    
    // 5. Proceed to next middleware
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
\`\`\`

## Security Best Practices

### Password Security

1. **Hashing**: Use bcrypt with appropriate cost factor
2. **Storage**: Never store plaintext passwords
3. **Validation**: Enforce strong password policies
4. **Reset**: Secure password reset workflow

\`\`\`typescript
// Password hashing
import * as bcrypt from 'bcrypt';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Password validation
export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters
  if (password.length < 8) return false;
  
  // Require at least one number
  if (!/\d/.test(password)) return false;
  
  // Require at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  // Require at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  return true;
};
\`\`\`

### Protection Against Common Attacks

1. **CSRF Protection**: Use CSRF tokens for all state-changing operations
2. **XSS Prevention**: Sanitize all user inputs and use Content Security Policy
3. **SQL Injection**: Use parameterized queries and ORM
4. **Rate Limiting**: Implement rate limiting for login attempts

\`\`\`typescript
// Rate limiting middleware
import rateLimit from 'express-rate-limit';

// Login rate limiting
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiting
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
\`\`\`

### Secure Headers

\`\`\`typescript
// Secure headers middleware
import helmet from 'helmet';

// Apply secure headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https://api.paystack.co'],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
  })
);
\`\`\`

## Customization Options

### Admin Interface Customization

1. **Theme Customization**: Customize admin dashboard colors and branding
2. **Layout Options**: Configure dashboard layout and visible tabs
3. **Custom Roles**: Define additional admin roles with custom permissions

\`\`\`typescript
// Theme customization
interface AdminTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

// Default theme
const defaultAdminTheme: AdminTheme = {
  primaryColor: '#0f172a',
  secondaryColor: '#4f46e5',
  accentColor: '#f97316',
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '0.375rem'
};

// Apply theme
const applyAdminTheme = (theme: AdminTheme) => {
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--admin-${key}`, value);
  });
};
\`\`\`

### Custom Admin Roles

\`\`\`typescript
// Custom role definition
interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdBy: string;
  createdAt: Date;
}

// Create custom role
const createCustomRole = async (roleData: Omit<CustomRole, 'id' | 'createdAt'>): Promise<CustomRole> => {
  const role = {
    id: generateId(),
    ...roleData,
    createdAt: new Date()
  };
  
  await db.customRoles.insert(role);
  return role;
};

// Assign custom role to admin
const assignCustomRole = async (adminId: string, roleId: string): Promise<void> => {
  await db.adminUsers.update(
    { id: adminId },
    { role: roleId, updatedAt: new Date() }
  );
};
\`\`\`

## Performance Considerations

### Optimizing Admin Dashboard Performance

1. **Data Pagination**: Implement pagination for large data sets
2. **Lazy Loading**: Load data only when needed
3. **Caching**: Cache frequently accessed data
4. **Optimized Queries**: Use efficient database queries

\`\`\`typescript
// Pagination implementation
interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Paginated query function
async function getPaginatedUsers(params: PaginationParams): Promise<PaginatedResult<User>> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  // Get total count
  const [{ count }] = await db.users.count();
  
  // Get paginated data
  const data = await db.users
    .select('*')
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset);
  
  return {
    data,
    pagination: {
      total: parseInt(count),
      page,
      limit,
      pages: Math.ceil(parseInt(count) / limit)
    }
  };
}
\`\`\`

### Caching Strategy

\`\`\`typescript
// Cache implementation
import NodeCache from 'node-cache';

// Create cache instance
const adminCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60 // Check for expired keys every minute
});

// Cached data fetching
async function getCachedSystemSettings(): Promise<SystemSettings> {
  const cacheKey = 'system_settings';
  
  // Try to get from cache
  const cachedSettings = adminCache.get<SystemSettings>(cacheKey);
  if (cachedSettings) {
    return cachedSettings;
  }
  
  // Fetch from database
  const settings = await db.systemSettings.findAll();
  
  // Transform to object
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.id] = setting.value;
    return acc;
  }, {} as SystemSettings);
  
  // Store in cache
  adminCache.set(cacheKey, settingsObject);
  
  return settingsObject;
}

// Cache invalidation
function invalidateSettingsCache(): void {
  adminCache.del('system_settings');
}
\`\`\`

## Migration Guide

### Upgrading Admin System

When upgrading the admin system to a new version, follow these steps:

1. **Backup**: Create a backup of the database and configuration
2. **Review Changes**: Check the changelog for breaking changes
3. **Database Migrations**: Run any required database migrations
4. **Update Code**: Update the codebase to the new version
5. **Test**: Test all functionality in a staging environment
6. **Deploy**: Deploy to production during low-traffic hours

\`\`\`bash
# Backup database
pg_dump -U postgres -d nithub > nithub_backup_$(date +%Y%m%d).sql

# Run migrations
npm run migrate:latest

# Update dependencies
npm update

# Build and deploy
npm run build
npm run deploy
\`\`\`

### Adding New Admin Features

To add new features to the admin system:

1. **Define Requirements**: Clearly define the feature requirements
2. **Update Schema**: Make any necessary database schema changes
3. **Implement Backend**: Add required API endpoints and services
4. **Implement Frontend**: Create UI components and integrate with API
5. **Add Permissions**: Update permission system for the new feature
6. **Test**: Thoroughly test the new feature
7. **Document**: Update documentation with the new feature

\`\`\`typescript
// Example: Adding a new admin feature

// 1. Update permission matrix
const UPDATED_PERMISSIONS = {
  ...PERMISSIONS,
  'admin': [
    ...PERMISSIONS.admin,
    'view_reports' // New permission
  ],
  'super_admin': [
    ...PERMISSIONS.super_admin,
    'manage_reports' // New permission
  ]
};

// 2. Create new API endpoints
// app/api/admin/reports/route.ts
export async function GET(req: Request) {
  // Verify admin session
  const admin = await verifyAdminSession(req);
  if (!admin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check permission
  if (!hasPermission(admin.role, 'view_reports')) {
    return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  // Get reports data
  const reports = await getReports();
  
  return Response.json({ reports });
}

// 3. Create frontend component
// components/admin/reports.tsx
export function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/admin/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  // Render reports UI
  return (
    <div className="reports-management">
      <h2>Reports</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ReportsTable reports={reports} />
      )}
    </div>
  );
}

// 4. Add to dashboard tabs
const UPDATED_DASHBOARD_TABS = [
  ...DASHBOARD_TABS,
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    component: ReportsManagement,
    // Available to all admin roles
  }
];
\`\`\`

This comprehensive documentation provides a complete guide to the Nithub Space Management Admin System, covering all aspects from implementation details to security best practices and future enhancements.
