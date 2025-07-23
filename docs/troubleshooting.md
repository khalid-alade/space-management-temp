# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Nithub Space Management System.

## 📋 Table of Contents

- [Common Issues](#common-issues)
- [Development Environment](#development-environment)
- [Build and Deployment](#build-and-deployment)
- [Authentication Issues](#authentication-issues)
- [Database Problems](#database-problems)
- [Performance Issues](#performance-issues)
- [Integration Problems](#integration-problems)
- [Error Messages](#error-messages)
- [Debugging Tools](#debugging-tools)
- [Getting Help](#getting-help)

## 🔧 Common Issues

### Application Won't Start

**Symptoms:**
- Server fails to start
- Port already in use error
- Module not found errors

**Solutions:**

1. **Port Already in Use**
   \`\`\`bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   
   # Or use a different port
   npm run dev -- -p 3001
   \`\`\`

2. **Module Not Found**
   \`\`\`bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear Next.js cache
   rm -rf .next
   npm run build
   \`\`\`

3. **Environment Variables Missing**
   \`\`\`bash
   # Check if .env.local exists
   ls -la .env*
   
   # Copy from example
   cp .env.example .env.local
   
   # Verify required variables are set
   echo $JWT_SECRET
   \`\`\`

### Page Not Loading

**Symptoms:**
- Blank white page
- 404 errors
- Infinite loading states

**Solutions:**

1. **Check Route Configuration**
   \`\`\`bash
   # Verify file structure
   ls -la app/
   
   # Check for page.tsx files
   find app/ -name "page.tsx"
   
   # Verify route naming conventions
   # app/about/page.tsx -> /about
   # app/bookings/[id]/page.tsx -> /bookings/123
   \`\`\`

2. **Client-Side Hydration Issues**
   \`\`\`typescript
   // Check for hydration mismatches
   // Look for console errors like:
   // "Text content does not match server-rendered HTML"
   
   // Fix by ensuring consistent rendering
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   if (!mounted) return null;
   \`\`\`

3. **JavaScript Errors**
   \`\`\`bash
   # Check browser console for errors
   # Common issues:
   # - Undefined variables
   # - Import/export errors
   # - Type errors
   
   # Enable source maps for debugging
   # next.config.mjs
   const nextConfig = {
     productionBrowserSourceMaps: true,
   };
   \`\`\`

### Styling Issues

**Symptoms:**
- Styles not applying
- Layout broken
- Dark mode not working

**Solutions:**

1. **Tailwind CSS Not Working**
   \`\`\`bash
   # Check Tailwind configuration
   npx tailwindcss -i ./app/globals.css -o ./output.css --watch
   
   # Verify content paths in tailwind.config.ts
   content: [
     './pages/**/*.{js,ts,jsx,tsx,mdx}',
     './components/**/*.{js,ts,jsx,tsx,mdx}',
     './app/**/*.{js,ts,jsx,tsx,mdx}',
   ]
   
   # Clear Tailwind cache
   rm -rf .next
   npm run build
   \`\`\`

2. **CSS Import Issues**
   \`\`\`typescript
   // Ensure globals.css is imported in layout.tsx
   import './globals.css'
   
   // Check for CSS conflicts
   // Use browser dev tools to inspect styles
   \`\`\`

3. **Theme Provider Issues**
   \`\`\`typescript
   // Verify ThemeProvider wraps the app
   // app/layout.tsx
   <ThemeProvider defaultTheme="system">
     {children}
   </ThemeProvider>
   
   // Check localStorage for theme persistence
   localStorage.getItem('theme')
   \`\`\`

## 💻 Development Environment

### TypeScript Errors

**Common TypeScript Issues:**

1. **Type Import Errors**
   \`\`\`typescript
   // ❌ Wrong
   import { User } from './types';
   
   // ✅ Correct
   import type { User } from './types';
   // or
   import { type User } from './types';
   \`\`\`

2. **Missing Type Definitions**
   \`\`\`bash
   # Install missing types
   npm install --save-dev @types/node @types/react @types/react-dom
   
   # Check tsconfig.json paths
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   \`\`\`

3. **Strict Mode Errors**
   \`\`\`typescript
   // Handle potential undefined values
   // ❌ Wrong
   const user = users.find(u => u.id === id);
   return user.name; // Error: user might be undefined
   
   // ✅ Correct
   const user = users.find(u => u.id === id);
   return user?.name ?? 'Unknown';
   \`\`\`

### ESLint and Prettier Issues

**Configuration Problems:**

1. **ESLint Not Running**
   \`\`\`bash
   # Check ESLint configuration
   npx eslint --print-config .
   
   # Run ESLint manually
   npx eslint . --ext .ts,.tsx,.js,.jsx
   
   # Fix auto-fixable issues
   npx eslint . --fix
   \`\`\`

2. **Prettier Conflicts**
   \`\`\`bash
   # Install eslint-config-prettier to disable conflicting rules
   npm install --save-dev eslint-config-prettier
   
   # Update .eslintrc.json
   {
     "extends": [
       "next/core-web-vitals",
       "prettier"
     ]
   }
   \`\`\`

3. **VS Code Integration**
   \`\`\`json
   // .vscode/settings.json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   \`\`\`

## 🏗️ Build and Deployment

### Build Failures

**Common Build Issues:**

1. **Memory Issues**
   \`\`\`bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   
   # Or add to package.json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }
   \`\`\`

2. **Import/Export Errors**
   \`\`\`typescript
   // Check for circular dependencies
   // Use madge to detect circular imports
   npx madge --circular --extensions ts,tsx ./
   
   // Fix by restructuring imports
   // Create index files for cleaner imports
   // components/index.ts
   export { Button } from './ui/button';
   export { Card } from './ui/card';
   \`\`\`

3. **Environment Variable Issues**
   \`\`\`bash
   # Check environment variables during build
   echo "Building with NODE_ENV: $NODE_ENV"
   
   # Verify NEXT_PUBLIC_ prefix for client-side variables
   NEXT_PUBLIC_API_URL=https://api.example.com
   
   # Use env validation
   const envSchema = z.object({
     NEXT_PUBLIC_API_URL: z.string().url(),
   });
   \`\`\`

### Deployment Issues

**Vercel Deployment Problems:**

1. **Build Timeout**
   \`\`\`json
   // vercel.json
   {
     "functions": {
       "app/**/*.ts": {
         "maxDuration": 30
       }
     },
     "build": {
       "env": {
         "NODE_OPTIONS": "--max-old-space-size=4096"
       }
     }
   }
   \`\`\`

2. **Environment Variables Not Set**
   \`\`\`bash
   # Check Vercel environment variables
   vercel env ls
   
   # Add missing variables
   vercel env add NEXT_PUBLIC_API_URL production
   
   # Pull environment variables locally
   vercel env pull .env.local
   \`\`\`

3. **Function Size Limits**
   \`\`\`typescript
   // Reduce bundle size by code splitting
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   
   // Use dynamic imports for large libraries
   const loadLibrary = async () => {
     const lib = await import('heavy-library');
     return lib.default;
   };
   \`\`\`

## 🔐 Authentication Issues

### JWT Token Problems

**Common JWT Issues:**

1. **Token Expiration**
   \`\`\`typescript
   // Check token expiration
   const isTokenExpired = (token: string) => {
     try {
       const decoded = jwt.decode(token) as any;
       return Date.now() >= decoded.exp * 1000;
     } catch {
       return true;
     }
   };
   
   // Implement token refresh
   const refreshToken = async () => {
     try {
       const response = await fetch('/api/auth/refresh', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${refreshToken}`,
         },
       });
       const { token } = await response.json();
       localStorage.setItem('token', token);
     } catch (error) {
       // Redirect to login
       window.location.href = '/login';
     }
   };
   \`\`\`

2. **CORS Issues**
   \`\`\`typescript
   // next.config.mjs
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: '*' },
             { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
             { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
           ],
         },
       ];
     },
   };
   \`\`\`

3. **Session Storage Issues**
   \`\`\`typescript
   // Check for localStorage availability
   const isLocalStorageAvailable = () => {
     try {
       const test = '__localStorage_test__';
       localStorage.setItem(test, test);
       localStorage.removeItem(test);
       return true;
     } catch {
       return false;
     }
   };
   
   // Fallback to sessionStorage or cookies
   const storage = isLocalStorageAvailable() ? localStorage : sessionStorage;
   \`\`\`

### Admin Access Issues

**Admin Authentication Problems:**

1. **Role-Based Access**
   \`\`\`typescript
   // Debug role checking
   const checkAdminRole = (user: User) => {
     console.log('User role:', user.role);
     console.log('Required roles:', ['admin', 'super_admin']);
     return ['admin', 'super_admin'].includes(user.role);
   };
   
   // Verify JWT payload
   const verifyAdminToken = (token: string) => {
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
       console.log('Decoded token:', decoded);
       return decoded.role === 'admin' || decoded.role === 'super_admin';
     } catch (error) {
       console.error('Token verification failed:', error);
       return false;
     }
   };
   \`\`\`

2. **Admin Route Protection**
   \`\`\`typescript
   // Check middleware configuration
   // middleware.ts
   export function middleware(request: NextRequest) {
     if (request.nextUrl.pathname.startsWith('/admin')) {
       const token = request.cookies.get('admin-token')?.value;
       
       if (!token || !verifyAdminToken(token)) {
         return NextResponse.redirect(new URL('/admin/login', request.url));
       }
     }
   }
   \`\`\`

## 🗄️ Database Problems

### Connection Issues

**Database Connection Problems:**

1. **Connection String Format**
   \`\`\`bash
   # Verify connection string format
   # PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   
   # Test connection
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Check for special characters in password
   # URL encode special characters: @ -> %40, # -> %23
   \`\`\`

2. **Connection Pool Exhaustion**
   \`\`\`typescript
   // Monitor connection pool
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20, // Maximum number of connections
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   
   // Log pool status
   console.log('Total connections:', pool.totalCount);
   console.log('Idle connections:', pool.idleCount);
   console.log('Waiting clients:', pool.waitingCount);
   \`\`\`

3. **SSL Certificate Issues**
   \`\`\`typescript
   // For production databases with SSL
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: process.env.NODE_ENV === 'production' ? {
       rejectUnauthorized: false
     } : false,
   });
   \`\`\`

### Query Issues

**Common Query Problems:**

1. **SQL Syntax Errors**
   \`\`\`sql
   -- Check for common syntax issues
   -- Missing quotes around strings
   SELECT * FROM users WHERE name = 'John'; -- ✅
   SELECT * FROM users WHERE name = John;   -- ❌
   
   -- Incorrect column names
   SELECT email FROM users; -- ✅ (if column exists)
   SELECT mail FROM users;  -- ❌ (if column doesn't exist)
   \`\`\`

2. **Parameter Binding**
   \`\`\`typescript
   // Use parameterized queries to prevent SQL injection
   // ❌ Wrong - SQL injection risk
   const query = `SELECT * FROM users WHERE id = ${userId}`;
   
   // ✅ Correct - parameterized query
   const query = 'SELECT * FROM users WHERE id = $1';
   const result = await pool.query(query, [userId]);
   \`\`\`

3. **Transaction Issues**
   \`\`\`typescript
   // Proper transaction handling
   const client = await pool.connect();
   try {
     await client.query('BEGIN');
     
     const result1 = await client.query('INSERT INTO bookings ...');
     const result2 = await client.query('UPDATE spaces ...');
     
     await client.query('COMMIT');
   } catch (error) {
     await client.query('ROLLBACK');
     throw error;
   } finally {
     client.release();
   }
   \`\`\`

## ⚡ Performance Issues

### Slow Page Loading

**Performance Optimization:**

1. **Bundle Analysis**
   \`\`\`bash
   # Analyze bundle size
   ANALYZE=true npm run build
   
   # Check for large dependencies
   npx webpack-bundle-analyzer .next/static/chunks/*.js
   
   # Use dynamic imports for large components
   const HeavyChart = dynamic(() => import('./HeavyChart'), {
     ssr: false,
     loading: () => <div>Loading chart...</div>
   });
   \`\`\`

2. **Image Optimization**
   \`\`\`typescript
   // Use Next.js Image component
   import Image from 'next/image';
   
   // ❌ Wrong
   <img src="/large-image.jpg" alt="Large image" />
   
   // ✅ Correct
   <Image
     src="/large-image.jpg"
     alt="Large image"
     width={800}
     height={600}
     placeholder="blur"
     blurDataURL="data:image/jpeg;base64,..."
   />
   \`\`\`

3. **Database Query Optimization**
   \`\`\`sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_bookings_user_id ON bookings(user_id);
   CREATE INDEX idx_bookings_date ON bookings(booking_date);
   
   -- Use EXPLAIN to analyze query performance
   EXPLAIN ANALYZE SELECT * FROM bookings WHERE user_id = $1;
   \`\`\`

### Memory Leaks

**Memory Management:**

1. **React Hook Cleanup**
   \`\`\`typescript
   // Clean up event listeners and timers
   useEffect(() => {
     const timer = setInterval(() => {
       // Do something
     }, 1000);
     
     return () => {
       clearInterval(timer);
     };
   }, []);
   
   // Clean up subscriptions
   useEffect(() => {
     const subscription = eventBus.subscribe('event', handler);
     
     return () => {
       subscription.unsubscribe();
     };
   }, []);
   \`\`\`

2. **Memory Monitoring**
   \`\`\`typescript
   // Monitor memory usage
   const logMemoryUsage = () => {
     const usage = process.memoryUsage();
     console.log('Memory usage:', {
       rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
       heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
       heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
     });
   };
   
   // Log memory usage periodically
   setInterval(logMemoryUsage, 30000);
   \`\`\`

## 🔌 Integration Problems

### Calendar Integration Issues

**Google Calendar/Outlook Problems:**

1. **OAuth Configuration**
   \`\`\`typescript
   // Verify OAuth credentials
   const googleConfig = {
     clientId: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
   };
   
   // Check scopes
   const scopes = [
     'https://www.googleapis.com/auth/calendar',
     'https://www.googleapis.com/auth/calendar.events',
   ];
   \`\`\`

2. **API Rate Limits**
   \`\`\`typescript
   // Implement exponential backoff
   const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
     for (let i = 0; i &lt; maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status === 429 && i &lt; maxRetries - 1) {
           const delay = Math.pow(2, i) * 1000; // Exponential backoff
           await new Promise(resolve => setTimeout(resolve, delay));
           continue;
         }
         throw error;
       }
     }
   };
   \`\`\`

3. **Token Refresh**
   \`\`\`typescript
   // Handle expired tokens
   const refreshCalendarToken = async (refreshToken: string) => {
     try {
       const response = await fetch('https://oauth2.googleapis.com/token', {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: new URLSearchParams({
           client_id: process.env.GOOGLE_CLIENT_ID!,
           client_secret: process.env.GOOGLE_CLIENT_SECRET!,
           refresh_token: refreshToken,
           grant_type: 'refresh_token',
         }),
       });
       
       const tokens = await response.json();
       return tokens;
     } catch (error) {
       console.error('Token refresh failed:', error);
       throw error;
     }
   };
   \`\`\`

### Payment Gateway Issues

**Payment Integration Problems:**

1. **Webhook Verification**
   \`\`\`typescript
   // Verify webhook signatures
   const verifyPaystackWebhook = (payload: string, signature: string) => {
     const hash = crypto
       .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
       .update(payload)
       .digest('hex');
     
     return hash === signature;
   };
   
   // Handle webhook endpoint
   export async function POST(request: Request) {
     const signature = request.headers.get('x-paystack-signature');
     const payload = await request.text();
     
     if (!verifyPaystackWebhook(payload, signature)) {
       return new Response('Invalid signature', { status: 400 });
     }
     
     // Process webhook
   }
   \`\`\`

2. **Payment Status Sync**
   \`\`\`typescript
   // Implement payment status polling
   const pollPaymentStatus = async (reference: string) => {
     const maxAttempts = 10;
     const interval = 5000; // 5 seconds
     
     for (let i = 0; i &lt; maxAttempts; i++) {
       try {
         const status = await checkPaymentStatus(reference);
         if (status === 'success' || status === 'failed') {
           return status;
         }
         await new Promise(resolve => setTimeout(resolve, interval));
       } catch (error) {
         console.error('Payment status check failed:', error);
       }
     }
     
     throw new Error('Payment status check timeout');
   };
   \`\`\`

## ❌ Error Messages

### Common Error Codes

**HTTP Status Codes:**

1. **400 Bad Request**
   \`\`\`typescript
   // Check request validation
   const validateBookingData = (data: any) => {
     const schema = z.object({
       spaceId: z.string().uuid(),
       date: z.string().datetime(),
       startTime: z.string(),
     });
     
     try {
       return schema.parse(data);
     } catch (error) {
       throw new Error(`Validation failed: ${error.message}`);
     }
   };
   \`\`\`

2. **401 Unauthorized**
   \`\`\`typescript
   // Check authentication
   const verifyAuth = (request: Request) => {
     const authHeader = request.headers.get('Authorization');
     if (!authHeader?.startsWith('Bearer ')) {
       throw new Error('Missing or invalid authorization header');
     }
     
     const token = authHeader.substring(7);
     try {
       return jwt.verify(token, process.env.JWT_SECRET!);
     } catch (error) {
       throw new Error('Invalid or expired token');
     }
   };
   \`\`\`

3. **500 Internal Server Error**
   \`\`\`typescript
   // Implement proper error handling
   export async function POST(request: Request) {
     try {
       // Your code here
     } catch (error) {
       console.error('API Error:', error);
       
       // Don't expose internal errors to client
       return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
       );
     }
   }
   \`\`\`

### React Error Boundaries

**Error Boundary Implementation:**

\`\`\`typescript
// components/error-boundary.tsx
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
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

## 🛠️ Debugging Tools

### Browser DevTools

**Debugging Techniques:**

1. **Console Debugging**
   \`\`\`typescript
   // Use console methods effectively
   console.log('Simple log');
   console.warn('Warning message');
   console.error('Error message');
   console.table(arrayOfObjects);
   console.group('Group label');
   console.groupEnd();
   
   // Conditional logging
   const DEBUG = process.env.NODE_ENV === 'development';
   if (DEBUG) {
     console.log('Debug info:', data);
   }
   \`\`\`

2. **Network Tab**
   \`\`\`typescript
   // Add request/response logging
   const apiClient = {
     async request(url: string, options: RequestInit = {}) {
       console.log('API Request:', { url, options });
       
       const response = await fetch(url, options);
       
       console.log('API Response:', {
         status: response.status,
         headers: Object.fromEntries(response.headers.entries()),
       });
       
       return response;
     }
   };
   \`\`\`

3. **React DevTools**
   \`\`\`typescript
   // Add displayName for better debugging
   const BookingForm = () => {
     // Component logic
   };
   BookingForm.displayName = 'BookingForm';
   
   // Use React DevTools Profiler
   import { Profiler } from 'react';
   
   const onRenderCallback = (id, phase, actualDuration) => {
     console.log('Profiler:', { id, phase, actualDuration });
   };
   
   <Profiler id="BookingForm" onRender={onRenderCallback}>
     <BookingForm />
   </Profiler>
   \`\`\`

### Server-Side Debugging

**Node.js Debugging:**

1. **Debug Mode**
   \`\`\`bash
   # Start with debugger
   node --inspect-brk=0.0.0.0:9229 node_modules/.bin/next dev
   
   # Connect with Chrome DevTools
   # Open chrome://inspect in Chrome
   \`\`\`

2. **Logging Configuration**
   \`\`\`typescript
   // lib/logger.ts
   import debug from 'debug';
   
   const log = debug('nithub:app');
   const dbLog = debug('nithub:db');
   const authLog = debug('nithub:auth');
   
   // Usage
   log('Application started');
   dbLog('Database query: %s', query);
   authLog('User authenticated: %o', user);
   
   // Enable specific loggers
   // DEBUG=nithub:* npm run dev
   // DEBUG=nithub:db npm run dev
   \`\`\`

### Testing and Debugging

**Test Debugging:**

1. **Jest Debugging**
   \`\`\`bash
   # Debug specific test
   node --inspect-brk node_modules/.bin/jest --runInBand test-file.test.ts
   
   # Run tests with verbose output
   npm test -- --verbose
   
   # Run tests in watch mode
   npm test -- --watch
   \`\`\`

2. **Component Testing**
   \`\`\`typescript
   // Debug component rendering
   import { screen, render } from '@testing-library/react';
   import { debug } from '@testing-library/react';
   
   test('debug component', () => {
     render(<BookingForm />);
     
     // Print DOM tree
     screen.debug();
     
     // Print specific element
     const button = screen.getByRole('button');
     screen.debug(button);
   });
   \`\`\`

## 🆘 Getting Help

### Before Asking for Help

**Information to Gather:**

1. **Environment Details**
   \`\`\`bash
   # System information
   node --version
   npm --version
   npx next --version
   
   # Operating system
   uname -a  # Linux/macOS
   systeminfo  # Windows
   
   # Browser information
   # Include browser name and version
   \`\`\`

2. **Error Information**
   \`\`\`typescript
   // Capture full error details
   try {
     // Code that fails
   } catch (error) {
     console.error('Error details:', {
       message: error.message,
       stack: error.stack,
       name: error.name,
       cause: error.cause,
     });
   }
   \`\`\`

3. **Reproduction Steps**
   \`\`\`markdown
   ## Steps to Reproduce
   1. Go to page X
   2. Click button Y
   3. Fill form with data Z
   4. Submit form
   5. Error occurs
   
   ## Expected Behavior
   Form should submit successfully
   
   ## Actual Behavior
   Error message appears: "..."
   
   ## Environment
   - OS: macOS 14.0
   - Browser: Chrome 120.0
   - Node.js: 18.17.0
   - Next.js: 14.0.0
   \`\`\`

### Community Resources

**Where to Get Help:**

1. **GitHub Issues**
   - Search existing issues first
   - Use issue templates
   - Provide minimal reproduction case

2. **Stack Overflow**
   - Tag questions with relevant technologies
   - Include code examples
   - Show what you've tried

3. **Discord/Slack Communities**
   - Real-time help
   - Share screenshots/code snippets
   - Follow community guidelines

4. **Documentation**
   - Check official docs first
   - Look for similar use cases
   - Review API references

### Creating Minimal Reproductions

**CodeSandbox Example:**

\`\`\`typescript
// Create minimal reproduction
// Include only essential code
// Remove unnecessary dependencies
// Provide clear steps to reproduce

// Example minimal booking form
import { useState } from 'react';

export default function MinimalBookingForm() {
  const [date, setDate] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This is where the error occurs
    console.log('Submitting:', date);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

---

This troubleshooting guide covers the most common issues you might encounter while developing or deploying the Nithub Space Management System. If you can't find a solution here, please check our [GitHub Issues](https://github.com/your-org/nithub-space-management/issues) or create a new issue with detailed information about your problem.

Remember to always:
- Check the console for error messages
- Verify your environment configuration
- Test in a clean environment
- Provide detailed reproduction steps when asking for help

Happy debugging! 🐛🔧
