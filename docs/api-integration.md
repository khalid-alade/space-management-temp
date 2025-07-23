# API Integration Guide

This guide explains how to integrate the Nithub Space Management System with a real backend API, replacing the current mock data implementation.

## 🎯 Overview

The current system uses mock data stored in the `/data` folder and simulated API responses. This guide provides a roadmap for connecting to a real backend API with proper data persistence, authentication, and business logic.

## 📊 Current Mock Data Structure

### **Mock Data Files**

\`\`\`typescript
// data/coworking-plans.ts
export interface CoworkingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

// data/event-spaces.ts
export interface EventSpace {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  features: string[];
  images: string[];
  availability: string[];
}

// data/user-bookings.ts
export interface Booking {
  id: string;
  type: 'coworking' | 'event';
  spaceName: string;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
}
\`\`\`

## 🗄️ Database Schema

### **Recommended Database Structure**

\`\`\`sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coworking plans table
CREATE TABLE coworking_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    features JSONB,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event spaces table
CREATE TABLE event_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    features JSONB,
    images JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('coworking', 'event')),
    space_id UUID, -- References coworking_plans or event_spaces
    space_name VARCHAR(200) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_reference VARCHAR(255),
    special_requests TEXT,
    calendar_event_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_reference VARCHAR(255),
    gateway_response JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'cancelled')),
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar integrations table
CREATE TABLE calendar_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('google', 'outlook')),
    provider_user_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    calendar_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_calendar_integrations_user_id ON calendar_integrations(user_id);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
\`\`\`

## 🔌 API Endpoints

### **Authentication Endpoints**

\`\`\`typescript
// User Authentication
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234123456789"
}

POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

POST /api/auth/logout
// Invalidates JWT token

GET /api/auth/me
// Returns current user profile

POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

POST /api/auth/reset-password
{
  "token": "reset-token",
  "password": "newpassword123"
}

// Admin Authentication
POST /api/admin/auth/login
{
  "email": "admin@nithub.com",
  "password": "admin123"
}

GET /api/admin/auth/me
// Returns current admin profile
\`\`\`

### **User Management Endpoints**

\`\`\`typescript
// User Profile
GET /api/users/profile
PUT /api/users/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+234123456789"
}

// User Bookings
GET /api/users/bookings?page=1&limit=10&status=confirmed
POST /api/users/bookings
{
  "type": "coworking",
  "spaceId": "uuid",
  "date": "2024-01-15",
  "startTime": "09:00",
  "duration": "8 hours",
  "specialRequests": "Need projector"
}

GET /api/users/bookings/:id
PUT /api/users/bookings/:id
DELETE /api/users/bookings/:id
\`\`\`

### **Space Management Endpoints**

\`\`\`typescript
// Coworking Plans
GET /api/coworking-plans
GET /api/coworking-plans/:id
POST /api/coworking-plans (Admin only)
PUT /api/coworking-plans/:id (Admin only)
DELETE /api/coworking-plans/:id (Admin only)

// Event Spaces
GET /api/event-spaces
GET /api/event-spaces/:id
POST /api/event-spaces (Admin only)
PUT /api/event-spaces/:id (Admin only)
DELETE /api/event-spaces/:id (Admin only)

// Availability Check
GET /api/spaces/availability?type=event&spaceId=uuid&date=2024-01-15&startTime=09:00&endTime=17:00
\`\`\`

### **Booking Management Endpoints**

\`\`\`typescript
// Booking Operations
POST /api/bookings
{
  "type": "event",
  "spaceId": "uuid",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "specialRequests": "Setup for 50 people"
}

GET /api/bookings/:id
PUT /api/bookings/:id/cancel
PUT /api/bookings/:id/confirm (Admin only)

// Conflict Detection
POST /api/bookings/check-conflicts
{
  "type": "event",
  "spaceId": "uuid",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "17:00"
}
\`\`\`

### **Payment Endpoints**

\`\`\`typescript
// Payment Processing
POST /api/payments/initialize
{
  "bookingId": "uuid",
  "amount": 50000,
  "currency": "NGN",
  "paymentMethod": "card"
}

POST /api/payments/verify
{
  "reference": "payment-reference"
}

GET /api/payments/:id
POST /api/payments/:id/refund (Admin only)

// Admin Payment Management
GET /api/admin/payments?status=pending&page=1&limit=20
PUT /api/admin/payments/:id/verify
POST /api/admin/payments/:id/refund
\`\`\`

### **Calendar Integration Endpoints**

\`\`\`typescript
// Calendar Sync
POST /api/calendar/connect
{
  "provider": "google",
  "authCode": "authorization-code"
}

GET /api/calendar/providers
DELETE /api/calendar/providers/:id

POST /api/calendar/sync-event
{
  "bookingId": "uuid",
  "providers": ["google", "outlook"]
}
\`\`\`

### **Admin Endpoints**

\`\`\`typescript
// User Management (Super Admin)
GET /api/admin/users?page=1&limit=20&search=john
GET /api/admin/users/:id
PUT /api/admin/users/:id
{
  "status": "suspended",
  "reason": "Policy violation"
}

// Analytics
GET /api/admin/analytics/overview
GET /api/admin/analytics/revenue?period=monthly&year=2024
GET /api/admin/analytics/bookings?period=weekly&startDate=2024-01-01

// System Settings (Super Admin)
GET /api/admin/settings
PUT /api/admin/settings
{
  "siteName": "Nithub Space Management",
  "contactEmail": "contact@nithub.com",
  "paymentGateway": "paystack",
  "emailProvider": "sendgrid"
}
\`\`\`

## 🔄 Data Migration Strategy

### **Step 1: Create API Client**

\`\`\`typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', this.token);
    return response;
  }

  // Booking methods
  async getBookings(params?: BookingQueryParams) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<{ bookings: Booking[]; total: number; page: number }>(
      `/users/bookings?${queryString}`
    );
  }

  async createBooking(booking: CreateBookingRequest) {
    return this.request<Booking>('/users/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  // Space methods
  async getCoworkingPlans() {
    return this.request<CoworkingPlan[]>('/coworking-plans');
  }

  async getEventSpaces() {
    return this.request<EventSpace[]>('/event-spaces');
  }

  // Payment methods
  async initializePayment(paymentData: PaymentInitRequest) {
    return this.request<PaymentInitResponse>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);
\`\`\`

### **Step 2: Update Custom Hooks**

\`\`\`typescript
// hooks/use-bookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useBookings = (params?: BookingQueryParams) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => apiClient.getBookings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

// hooks/use-auth.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useAuth = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.getCurrentUser(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      apiClient.login(email, password),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem('auth_token');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
};
\`\`\`

### **Step 3: Replace Mock Data**

\`\`\`typescript
// Before (using mock data)
const useCoworkingPlans = () => {
  const [plans, setPlans] = useState(MOCK_COWORKING_PLANS);
  const [loading, setLoading] = useState(false);
  
  return { plans, loading };
};

// After (using API)
const useCoworkingPlans = () => {
  return useQuery({
    queryKey: ['coworking-plans'],
    queryFn: () => apiClient.getCoworkingPlans(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
\`\`\`

### **Step 4: Update Components**

\`\`\`typescript
// components/booking-form.tsx
const BookingForm = () => {
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { data: availability } = useAvailability(selectedDate, selectedSpace);

  const handleSubmit = (formData: BookingFormData) => {
    createBooking(formData, {
      onSuccess: (booking) => {
        toast.success('Booking created successfully!');
        router.push(`/bookings/${booking.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Booking'}
      </Button>
    </form>
  );
};
\`\`\`

## 🔐 Authentication Implementation

### **JWT Token Management**

\`\`\`typescript
// lib/auth.ts
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthManager {
  private tokens: AuthTokens | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored tokens:', error);
        this.clearTokens();
      }
    }
  }

  private saveTokensToStorage() {
    if (this.tokens) {
      localStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
    }
  }

  setTokens(tokens: AuthTokens) {
    this.tokens = tokens;
    this.saveTokensToStorage();
  }

  getAccessToken(): string | null {
    if (!this.tokens) return null;
    
    // Check if token is expired
    if (Date.now() >= this.tokens.expiresAt) {
      this.refreshAccessToken();
      return null;
    }
    
    return this.tokens.accessToken;
  }

  private async refreshAccessToken() {
    if (!this.tokens?.refreshToken) {
      this.clearTokens();
      return;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.tokens.refreshToken }),
      });

      if (response.ok) {
        const newTokens = await response.json();
        this.setTokens(newTokens);
      } else {
        this.clearTokens();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
    }
  }

  clearTokens() {
    this.tokens = null;
    localStorage.removeItem('auth_tokens');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authManager = new AuthManager();
\`\`\`

### **Protected Route Component**

\`\`\`typescript
// components/protected-route.tsx
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'user',
  fallback 
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Unauthorized access</div>;
  }

  return <>{children}</>;
};
\`\`\`

## 📧 Email Integration

### **Email Service Setup**

\`\`\`typescript
// lib/email-service.ts
interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailData {
  to: string;
  template: string;
  variables: Record<string, any>;
}

class EmailService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY!;
    this.baseURL = 'https://api.sendgrid.com/v3';
  }

  async sendEmail(data: EmailData) {
    const template = await this.getTemplate(data.template);
    const processedTemplate = this.processTemplate(template, data.variables);

    const response = await fetch(`${this.baseURL}/mail/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: data.to }],
          subject: processedTemplate.subject,
        }],
        from: { email: 'noreply@nithub.com', name: 'Nithub Space Management' },
        content: [
          { type: 'text/plain', value: processedTemplate.text },
          { type: 'text/html', value: processedTemplate.html },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async getTemplate(templateName: string): Promise<EmailTemplate> {
    // Load email templates from database or file system
    const templates = {
      'booking-confirmation': {
        subject: 'Booking Confirmation - {{spaceName}}',
        html: `
          <h1>Booking Confirmed!</h1>
          <p>Dear {{userName}},</p>
          <p>Your booking for {{spaceName}} has been confirmed.</p>
          <ul>
            <li>Date: {{date}}</li>
            <li>Time: {{time}}</li>
            <li>Duration: {{duration}}</li>
            <li>Amount: {{amount}}</li>
          </ul>
          <p>Thank you for choosing Nithub!</p>
        `,
        text: 'Your booking for {{spaceName}} has been confirmed...',
      },
      'payment-received': {
        subject: 'Payment Received - {{bookingId}}',
        html: `
          <h1>Payment Received</h1>
          <p>We have received your payment of {{amount}} for booking {{bookingId}}.</p>
        `,
        text: 'Payment received for booking {{bookingId}}...',
      },
    };

    return templates[templateName] || templates['booking-confirmation'];
  }

  private processTemplate(template: EmailTemplate, variables: Record<string, any>): EmailTemplate {
    const processString = (str: string) => {
      return Object.entries(variables).reduce((result, [key, value]) => {
        return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }, str);
    };

    return {
      subject: processString(template.subject),
      html: processString(template.html),
      text: processString(template.text),
    };
  }
}

export const emailService = new EmailService();
\`\`\`

### **Email Notification Hooks**

\`\`\`typescript
// hooks/use-email-notifications.ts
import { useMutation } from '@tanstack/react-query';
import { emailService } from '@/lib/email-service';

export const useEmailNotifications = () => {
  const sendBookingConfirmation = useMutation({
    mutationFn: async (booking: Booking) => {
      return emailService.sendEmail({
        to: booking.userEmail,
        template: 'booking-confirmation',
        variables: {
          userName: booking.userName,
          spaceName: booking.spaceName,
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          amount: booking.amount,
        },
      });
    },
  });

  const sendPaymentConfirmation = useMutation({
    mutationFn: async (payment: Payment) => {
      return emailService.sendEmail({
        to: payment.userEmail,
        template: 'payment-received',
        variables: {
          bookingId: payment.bookingId,
          amount: payment.amount,
        },
      });
    },
  });

  return {
    sendBookingConfirmation: sendBookingConfirmation.mutate,
    sendPaymentConfirmation: sendPaymentConfirmation.mutate,
  };
};
\`\`\`

## 🔄 Real-time Updates

### **WebSocket Integration**

\`\`\`typescript
// lib/websocket-client.ts
class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(url);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleMessage(data: any) {
    // Emit events for different message types
    switch (data.type) {
      case 'booking_updated':
        window.dispatchEvent(new CustomEvent('booking_updated', { detail: data.payload }));
        break;
      case 'payment_verified':
        window.dispatchEvent(new CustomEvent('payment_verified', { detail: data.payload }));
        break;
      case 'space_availability_changed':
        window.dispatchEvent(new CustomEvent('space_availability_changed', { detail: data.payload }));
        break;
    }
  }

  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(url);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient();
\`\`\`

### **Real-time Hooks**

\`\`\`typescript
// hooks/use-real-time-updates.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient } from '@/lib/websocket-client';

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect(process.env.NEXT_PUBLIC_WS_URL!);

    // Listen for booking updates
    const handleBookingUpdate = (event: CustomEvent) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.setQueryData(['booking', event.detail.id], event.detail);
    };

    // Listen for payment verification
    const handlePaymentVerified = (event: CustomEvent) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    };

    // Listen for availability changes
    const handleAvailabilityChange = (event: CustomEvent) => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    };

    window.addEventListener('booking_updated', handleBookingUpdate);
    window.addEventListener('payment_verified', handlePaymentVerified);
    window.addEventListener('space_availability_changed', handleAvailabilityChange);

    return () => {
      window.removeEventListener('booking_updated', handleBookingUpdate);
      window.removeEventListener('payment_verified', handlePaymentVerified);
      window.removeEventListener('space_availability_changed', handleAvailabilityChange);
      wsClient.disconnect();
    };
  }, [queryClient]);
};
\`\`\`

## 📊 Error Handling & Logging

### **Error Handling Strategy**

\`\`\`typescript
// lib/error-handler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        toast.error('Invalid data provided');
        break;
      case 500:
        toast.error('Server error. Please try again later');
        break;
      default:
        toast.error(error.message || 'An unexpected error occurred');
    }
  } else {
    toast.error('Network error. Please check your connection');
  }
};

// Global error boundary
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send error to logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

### **Logging Service**

\`\`\`typescript
// lib/logger.ts
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private log(level: LogEntry['level'], message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(entry);
    }

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      console[level](message, metadata);
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }
}

export const logger = new Logger();
\`\`\`

## 🧪 Testing with Real API

### **API Testing Setup**

\`\`\`typescript
// __tests__/api/bookings.test.ts
import { apiClient } from '@/lib/api-client';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/bookings', (req, res, ctx) => {
    return res(
      ctx.json({
        bookings: [
          {
            id: '1',
            type: 'coworking',
            spaceName: 'Hot Desk',
            date: '2024-01-15',
            status: 'confirmed',
          },
        ],
        total: 1,
        page: 1,
      })
    );
  }),

  rest.post('/api/bookings', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '2',
        type: 'event',
        spaceName: 'Conference Room A',
        date: '2024-01-16',
        status: 'pending',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Bookings API', () => {
  test('should fetch bookings', async () => {
    const result = await apiClient.getBookings();
    expect(result.bookings).toHaveLength(1);
    expect(result.bookings[0].spaceName).toBe('Hot Desk');
  });

  test('should create booking', async () => {
    const bookingData = {
      type: 'event',
      spaceId: 'space-1',
      date: '2024-01-16',
      startTime: '09:00',
      endTime: '17:00',
    };

    const result = await apiClient.createBooking(bookingData);
    expect(result.id).toBe('2');
    expect(result.spaceName).toBe('Conference Room A');
  });
});
\`\`\`

### **Integration Testing**

\`\`\`typescript
// __tests__/integration/booking-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookingForm } from '@/components/booking-form';

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

describe('Booking Flow Integration', () => {
  test('should complete booking flow', async () => {
    renderWithProviders(<BookingForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-01-15' },
    });
    fireEvent.change(screen.getByLabelText('Start Time'), {
      target: { value: '09:00' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Booking'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Booking created successfully!')).toBeInTheDocument();
    });
  });
});
\`\`\`

## 🚀 Deployment Considerations

### **Environment Variables**

\`\`\`bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.nithub.com
NEXT_PUBLIC_WS_URL=wss://ws.nithub.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/nithub_prod

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@nithub.com

# Payment Gateways
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...

# Calendar APIs
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
\`\`\`

### **API Rate Limiting**

\`\`\`typescript
// middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit(limit: number, windowMs: number) {
  return (req: NextRequest) => {
    const ip = req.ip || 'anonymous';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    const requests = rateLimitMap.get(ip) || [];
    const validRequests = requests.filter((time: number) => time > windowStart);

    if (validRequests.length >= limit) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);

    return null; // Allow request
  };
}

// Usage in API routes
export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(10, 60000)(req); // 10 requests per minute
  if (rateLimitResult) return rateLimitResult;

  // Handle request
}
\`\`\`

This comprehensive API integration guide provides everything needed to transition from the current mock data implementation to a fully functional backend-connected system. The modular approach ensures that components can be updated incrementally without breaking the existing functionality.
