# Getting Started with Nithub Space Management System

This guide will help you set up the development environment and get the Nithub Space Management System running locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### **Required Software**
- **Node.js** (version 18.0 or higher)
  \`\`\`bash
  # Check your Node.js version
  node --version
  \`\`\`
- **npm** (comes with Node.js) or **yarn**
  \`\`\`bash
  # Check npm version
  npm --version
  \`\`\`
- **Git** (for version control)
  \`\`\`bash
  # Check Git version
  git --version
  \`\`\`

### **Recommended Tools**
- **VS Code** - Code editor with excellent TypeScript support
- **Chrome DevTools** - For debugging and testing
- **Postman** or **Insomnia** - For API testing (when backend is implemented)

## 🚀 Installation

### **Step 1: Clone the Repository**

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/nithub-space-management.git

# Navigate to the project directory
cd nithub-space-management
\`\`\`

### **Step 2: Install Dependencies**

\`\`\`bash
# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
\`\`\`

### **Step 3: Environment Setup**

Create a `.env.local` file in the root directory:

\`\`\`bash
# Copy the example environment file
cp .env.example .env.local
\`\`\`

Add the following environment variables:

\`\`\`env
# JWT Secret for admin authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Calendar Integration (for future use)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_OUTLOOK_CLIENT_ID=your-outlook-client-id

# Payment Gateway (for future use)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Email Service (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Database (for future use)
DATABASE_URL=postgresql://username:password@localhost:5432/nithub_db
\`\`\`

### **Step 4: Start Development Server**

\`\`\`bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
\`\`\`

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure Overview

Understanding the project structure will help you navigate and contribute effectively:

\`\`\`
nithub-space-management/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Authentication group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── admin/                   # Admin dashboard
│   │   ├── dashboard/           # Main admin interface
│   │   └── login/               # Admin login
│   ├── bookings/                # Booking management
│   │   ├── receipt/             # Booking receipts
│   │   └── page.tsx             # Bookings list
│   ├── coworking/               # Coworking spaces
│   │   ├── book/                # Booking flow
│   │   └── page.tsx             # Coworking overview
│   ├── event-spaces/            # Event venues
│   │   ├── book/                # Event booking
│   │   └── page.tsx             # Event spaces list
│   ├── settings/                # User settings
│   ├── dashboard/               # User dashboard
│   ├── about/                   # About page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── admin/                   # Admin-specific components
│   │   ├── admin-analytics.tsx  # Analytics dashboard
│   │   ├── payment-verification.tsx
│   │   ├── space-management.tsx
│   │   ├── system-settings.tsx
│   │   └── user-management.tsx
│   ├── ui/                      # shadcn/ui components
│   ├── availability-calendar.tsx
│   ├── calendar-sync.tsx
│   ├── conflict-checker.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── features.tsx
│   ├── nfc-payment.tsx
│   └── theme-provider.tsx
├── data/                        # Mock data and types
│   ├── coworking-plans.ts       # Coworking space data
│   ├── event-spaces.ts          # Event venue data
│   ├── testimonials.ts          # Customer testimonials
│   └── user-bookings.ts         # User booking data
├── hooks/                       # Custom React hooks
│   ├── use-admin-auth.ts        # Admin authentication
│   ├── use-calendar-sync.ts     # Calendar integration
│   ├── use-conflict-detection.ts # Booking conflicts
│   ├── use-mobile.tsx           # Mobile detection
│   ├── use-nfc.ts               # NFC payment handling
│   └── use-toast.ts             # Toast notifications
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
├── config/                      # Configuration files
│   └── site.ts                  # Site configuration
├── docs/                        # Documentation
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
\`\`\`

## 🎯 Key Concepts

### **App Router (Next.js 14)**
This project uses Next.js 14's App Router, which provides:
- File-based routing
- Server and client components
- Nested layouts
- Loading and error boundaries

### **TypeScript**
The entire project is written in TypeScript for:
- Type safety
- Better developer experience
- Improved code documentation
- Easier refactoring

### **Tailwind CSS**
Styling is handled with Tailwind CSS:
- Utility-first approach
- Responsive design
- Dark mode support
- Custom design system

### **shadcn/ui Components**
Pre-built, accessible components:
- Consistent design language
- Accessibility built-in
- Customizable themes
- TypeScript support

## 🔧 Development Workflow

### **1. Running the Application**

\`\`\`bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
\`\`\`

### **2. Code Quality Tools**

The project includes several tools to maintain code quality:

\`\`\`bash
# ESLint - Code linting
npm run lint

# Prettier - Code formatting (auto-runs on save in VS Code)
npm run format

# TypeScript - Type checking
npm run type-check
\`\`\`

### **3. Git Workflow**

\`\`\`bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
\`\`\`

## 🧪 Testing the Application

### **Manual Testing Checklist**

1. **Homepage**
   - [ ] Hero section loads correctly
   - [ ] Features section displays
   - [ ] Navigation works
   - [ ] Dark mode toggle functions

2. **Coworking Booking**
   - [ ] Space selection works
   - [ ] Date/time picker functions
   - [ ] Conflict detection works
   - [ ] Booking form submits

3. **Event Space Booking**
   - [ ] Event spaces display
   - [ ] Booking flow completes
   - [ ] Calendar integration works

4. **Admin System**
   - [ ] Admin login works (`admin@nithub.com` / `admin123`)
   - [ ] Dashboard loads
   - [ ] Payment verification functions
   - [ ] User management works (super admin)

5. **Settings**
   - [ ] Profile settings save
   - [ ] Notification preferences work
   - [ ] Theme switching functions

### **Browser Testing**
Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### **Mobile Testing**
Test responsive design:
- iPhone (various sizes)
- Android devices
- Tablet sizes

## 🎨 Customization

### **Theming**
The application supports extensive theming through Tailwind CSS:

\`\`\`typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Nithub brand colors
        nithub: {
          primary: '#1a365d',
          secondary: '#2d3748',
          accent: '#4299e1',
        }
      }
    }
  }
}
\`\`\`

### **Component Customization**
Components can be customized through props and CSS classes:

\`\`\`tsx
// Example: Custom button styling
<Button 
  variant="outline" 
  size="lg"
  className="bg-nithub-primary hover:bg-nithub-secondary"
>
  Custom Button
</Button>
\`\`\`

## 🔍 Debugging

### **Common Development Issues**

1. **Port Already in Use**
   \`\`\`bash
   # Kill process on port 3000
   npx kill-port 3000
   
   # Or use a different port
   npm run dev -- -p 3001
   \`\`\`

2. **Module Not Found Errors**
   \`\`\`bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

3. **TypeScript Errors**
   \`\`\`bash
   # Run type checking
   npm run type-check
   
   # Check specific file
   npx tsc --noEmit path/to/file.tsx
   \`\`\`

### **Development Tools**

1. **React Developer Tools**
   - Install browser extension
   - Inspect component tree
   - Debug state and props

2. **Next.js DevTools**
   - Built-in performance metrics
   - Bundle analyzer
   - Build optimization hints

3. **Tailwind CSS DevTools**
   - Class name suggestions
   - Design system inspector

## 📚 Learning Resources

### **Next.js**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [App Router Guide](https://nextjs.org/docs/app)

### **React**
- [React Documentation](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript with React](https://react.dev/learn/typescript)

### **Tailwind CSS**
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)

### **shadcn/ui**
- [Component Documentation](https://ui.shadcn.com/docs)
- [Installation Guide](https://ui.shadcn.com/docs/installation)
- [Theming Guide](https://ui.shadcn.com/docs/theming)

## 🆘 Getting Help

If you encounter issues:

1. **Check the Documentation**
   - Read relevant docs sections
   - Check troubleshooting guide

2. **Search Existing Issues**
   - GitHub issues
   - Stack Overflow
   - Community discussions

3. **Create an Issue**
   - Provide detailed description
   - Include error messages
   - Share reproduction steps

4. **Join the Community**
   - GitHub Discussions
   - Discord server (if available)
   - Developer forums

## ✅ Next Steps

After setting up the development environment:

1. **Explore the Codebase**
   - Read through key components
   - Understand the data flow
   - Review the admin system

2. **Make Your First Contribution**
   - Fix a small bug
   - Improve documentation
   - Add a minor feature

3. **Learn the Architecture**
   - Read the [Architecture Guide](./architecture.md)
   - Understand component patterns
   - Review state management

4. **Plan Your Contributions**
   - Check the [Roadmap](./roadmap.md)
   - Review open issues
   - Discuss new features

Welcome to the Nithub Space Management System development team! 🎉
