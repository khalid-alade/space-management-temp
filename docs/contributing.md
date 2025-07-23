# Contributing to Nithub Space Management System

Thank you for your interest in contributing to the Nithub Space Management System! This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@nithub.com. All complaints will be reviewed and investigated promptly and fairly.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **Git** for version control
- **VS Code** (recommended) with suggested extensions
- Basic knowledge of **React**, **TypeScript**, and **Next.js**

### Development Setup

1. **Fork the Repository**
   \`\`\`bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/nithub-space-management.git
   cd nithub-space-management
   \`\`\`

2. **Add Upstream Remote**
   \`\`\`bash
   git remote add upstream https://github.com/original-org/nithub-space-management.git
   \`\`\`

3. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

4. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

### First-Time Contributors

If you're new to the project, look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `bug` - Bug fixes (start with simple ones)

## 🔄 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branch types:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features
- **`bugfix/*`** - Bug fixes
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation

### Creating a Feature Branch

\`\`\`bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
\`\`\`

### Commit Message Convention

We follow the **Conventional Commits** specification:

\`\`\`
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
\`\`\`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
\`\`\`bash
feat(booking): add calendar sync functionality
fix(auth): resolve login redirect issue
docs(api): update integration guide
style(components): format booking form
refactor(hooks): simplify useAuth implementation
test(booking): add conflict detection tests
chore(deps): update dependencies
\`\`\`

### Keeping Your Fork Updated

\`\`\`bash
# Fetch upstream changes
git fetch upstream

# Update develop branch
git checkout develop
git merge upstream/develop

# Update your feature branch
git checkout feature/your-feature-name
git rebase develop
\`\`\`

## 📝 Coding Standards

### TypeScript Guidelines

1. **Strict Type Checking**
   \`\`\`typescript
   // ✅ Good - Explicit types
   interface BookingFormData {
     spaceId: string;
     date: string;
     startTime: string;
     endTime?: string;
   }

   // ❌ Bad - Any types
   const handleSubmit = (data: any) => {
     // ...
   };
   \`\`\`

2. **Interface Naming**
   \`\`\`typescript
   // ✅ Good - Descriptive interface names
   interface UserBooking {
     id: string;
     userId: string;
     spaceId: string;
   }

   // ✅ Good - Props interfaces
   interface BookingFormProps {
     onSubmit: (data: BookingFormData) => void;
     isLoading?: boolean;
   }
   \`\`\`

3. **Enum Usage**
   \`\`\`typescript
   // ✅ Good - Use enums for constants
   enum BookingStatus {
     PENDING = 'pending',
     CONFIRMED = 'confirmed',
     CANCELLED = 'cancelled',
   }

   // ❌ Bad - String literals everywhere
   const status = 'pending'; // What are the valid values?
   \`\`\`

### React Component Guidelines

1. **Component Structure**
   \`\`\`typescript
   // ✅ Good - Well-structured component
   interface ComponentProps {
     // Props interface first
   }

   export const Component = ({ prop1, prop2 }: ComponentProps) => {
     // Hooks at the top
     const [state, setState] = useState();
     const { data } = useQuery();

     // Event handlers
     const handleClick = () => {
       // ...
     };

     // Early returns
     if (loading) return <LoadingSpinner />;

     // Main render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   };
   \`\`\`

2. **Props Destructuring**
   \`\`\`typescript
   // ✅ Good - Destructure props
   const BookingCard = ({ booking, onEdit, onCancel }: BookingCardProps) => {
     return <div>{booking.spaceName}</div>;
   };

   // ❌ Bad - Using props object
   const BookingCard = (props: BookingCardProps) => {
     return <div>{props.booking.spaceName}</div>;
   };
   \`\`\`

3. **Event Handler Naming**
   \`\`\`typescript
   // ✅ Good - Descriptive handler names
   const handleBookingSubmit = () => {};
   const handleDateChange = () => {};
   const handleCancelClick = () => {};

   // ❌ Bad - Generic names
   const onClick = () => {};
   const onChange = () => {};
   \`\`\`

### CSS/Styling Guidelines

1. **Tailwind CSS Classes**
   \`\`\`typescript
   // ✅ Good - Organized class names
   <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">

   // ✅ Good - Use cn utility for conditional classes
   <Button className={cn(
     "w-full",
     isLoading && "opacity-50 cursor-not-allowed",
     variant === "primary" && "bg-blue-500 hover:bg-blue-600"
   )}>
   \`\`\`

2. **Component Styling**
   \`\`\`typescript
   // ✅ Good - Consistent spacing and sizing
   const Card = ({ className, ...props }: CardProps) => (
     <div
       className={cn(
         "rounded-lg border bg-card text-card-foreground shadow-sm",
         className
       )}
       {...props}
     />
   );
   \`\`\`

### File Organization

\`\`\`
components/
├── forms/              # Form components
│   ├── booking-form.tsx
│   └── contact-form.tsx
├── layout/             # Layout components
│   ├── header.tsx
│   └── footer.tsx
├── ui/                 # Base UI components
│   ├── button.tsx
│   └── card.tsx
└── shared/             # Shared components
    ├── loading-spinner.tsx
    └── error-boundary.tsx
\`\`\`

### Import Organization

\`\`\`typescript
// ✅ Good - Organized imports
// 1. React and Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Internal utilities and hooks
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// 4. Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. Types and interfaces
import type { Booking } from '@/types/booking';
\`\`\`

## 🧪 Testing Guidelines

### Testing Strategy

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test complete user workflows

### Writing Tests

1. **Component Testing**
   \`\`\`typescript
   // __tests__/components/booking-form.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { BookingForm } from '@/components/forms/booking-form';

   describe('BookingForm', () => {
     it('should render form fields', () => {
       render(<BookingForm onSubmit={jest.fn()} />);
       
       expect(screen.getByLabelText('Date')).toBeInTheDocument();
       expect(screen.getByLabelText('Time')).toBeInTheDocument();
     });

     it('should call onSubmit with form data', () => {
       const mockSubmit = jest.fn();
       render(<BookingForm onSubmit={mockSubmit} />);
       
       fireEvent.change(screen.getByLabelText('Date'), {
         target: { value: '2024-01-15' }
       });
       fireEvent.click(screen.getByText('Submit'));
       
       expect(mockSubmit).toHaveBeenCalledWith({
         date: '2024-01-15',
         // ... other data
       });
     });
   });
   \`\`\`

2. **Hook Testing**
   \`\`\`typescript
   // __tests__/hooks/use-bookings.test.ts
   import { renderHook, waitFor } from '@testing-library/react';
   import { useBookings } from '@/hooks/use-bookings';

   describe('useBookings', () => {
     it('should fetch bookings', async () => {
       const { result } = renderHook(() => useBookings());
       
       await waitFor(() => {
         expect(result.current.isLoading).toBe(false);
       });
       
       expect(result.current.bookings).toHaveLength(2);
     });
   });
   \`\`\`

3. **API Testing**
   \`\`\`typescript
   // __tests__/api/bookings.test.ts
   import { apiClient } from '@/lib/api-client';

   describe('Bookings API', () => {
     it('should create booking', async () => {
       const bookingData = {
         spaceId: 'space-1',
         date: '2024-01-15',
         startTime: '09:00',
       };

       const result = await apiClient.createBooking(bookingData);
       
       expect(result).toMatchObject({
         id: expect.any(String),
         spaceId: 'space-1',
         status: 'pending',
       });
     });
   });
   \`\`\`

### Test Commands

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test booking-form.test.tsx
\`\`\`

### Test Coverage Requirements

- **Minimum 80% code coverage** for new features
- **100% coverage** for utility functions
- **Critical paths** must be fully tested
- **Error scenarios** should be tested

## 🔍 Pull Request Process

### Before Creating a PR

1. **Ensure your code follows our standards**
   \`\`\`bash
   npm run lint
   npm run type-check
   npm test
   \`\`\`

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Test your changes** thoroughly

### PR Template

When creating a PR, use this template:

\`\`\`markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] E2E tests pass (if applicable)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Related Issues
Closes #(issue number)
\`\`\`

### PR Review Process

1. **Automated Checks**
   - Linting and formatting
   - Type checking
   - Test execution
   - Build verification

2. **Code Review**
   - At least **2 approvals** required
   - **1 approval** from a core maintainer
   - Address all review comments

3. **Merge Requirements**
   - All checks must pass
   - No merge conflicts
   - Up-to-date with target branch

### Review Guidelines

**For Reviewers:**
- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when ready, request changes when needed
- Focus on code quality, not personal preferences

**For Authors:**
- Respond to all comments
- Ask for clarification if needed
- Make requested changes promptly
- Thank reviewers for their time

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Try the latest version** to see if it's already fixed

### Bug Reports

Use the bug report template:

\`\`\`markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]

## Additional Context
Add any other context about the problem here.
\`\`\`

### Feature Requests

Use the feature request template:

\`\`\`markdown
## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
A clear description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternatives Considered
A clear description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Implementation Ideas
If you have ideas about how this could be implemented, please share them.
\`\`\`

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue or pull request already exists
- `invalid` - This doesn't seem right

## 📚 Documentation

### Documentation Standards

1. **Clear and Concise** - Write for your audience
2. **Examples Included** - Show, don't just tell
3. **Up-to-Date** - Keep docs current with code changes
4. **Well-Organized** - Logical structure and navigation

### Types of Documentation

1. **API Documentation** - Function and component APIs
2. **User Guides** - How to use features
3. **Developer Guides** - How to contribute and extend
4. **Architecture Docs** - System design and decisions

### Writing Guidelines

\`\`\`markdown
# Use Clear Headings

## Organize Content Logically

### Provide Code Examples

\`\`\`typescript
// Always include working examples
const example = () => {
  return "This helps users understand";
};
\`\`\`

### Explain the Why

Don't just show what to do, explain why it's done this way.

### Keep It Updated

When you change code, update the related documentation.
\`\`\`

### Documentation Workflow

1. **Write docs** alongside code changes
2. **Review docs** as part of PR process
3. **Test examples** to ensure they work
4. **Update navigation** if adding new sections

## 🌟 Recognition

### Contributor Recognition

We recognize contributors in several ways:

1. **Contributors List** - All contributors listed in README
2. **Release Notes** - Major contributions highlighted
3. **Social Media** - Shoutouts for significant contributions
4. **Swag** - Stickers and merchandise for active contributors

### Becoming a Maintainer

Active contributors may be invited to become maintainers based on:

- **Consistent contributions** over time
- **High-quality code** and reviews
- **Helpful community participation**
- **Understanding of project goals**

## 🎯 Development Focus Areas

### Current Priorities

1. **Backend Integration** - Moving from mock data to real APIs
2. **Testing Coverage** - Improving test coverage across the codebase
3. **Performance** - Optimizing loading times and user experience
4. **Accessibility** - Ensuring WCAG 2.1 AA compliance
5. **Mobile Experience** - Improving mobile responsiveness

### Future Roadmap

1. **Mobile App** - React Native implementation
2. **Advanced Analytics** - Enhanced reporting and insights
3. **AI Features** - Smart recommendations and automation
4. **Multi-tenant** - Support for multiple organizations
5. **Internationalization** - Multi-language support

## 🤝 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat and collaboration
- **Email** - Direct contact for sensitive issues

### Community Guidelines

1. **Be Respectful** - Treat everyone with respect
2. **Be Helpful** - Help others when you can
3. **Be Patient** - Remember everyone is learning
4. **Be Constructive** - Provide actionable feedback
5. **Be Inclusive** - Welcome newcomers and diverse perspectives

### Getting Help

1. **Check Documentation** - Start with the docs
2. **Search Issues** - Look for existing solutions
3. **Ask Questions** - Use GitHub Discussions
4. **Join Discord** - Get real-time help
5. **Contact Maintainers** - For urgent issues

### Mentorship Program

We offer mentorship for new contributors:

- **Pairing Sessions** - Work with experienced contributors
- **Code Reviews** - Detailed feedback on contributions
- **Project Guidance** - Help choosing appropriate issues
- **Career Advice** - Open source career development

## 📞 Contact

- **Project Lead**: [lead@nithub.com](mailto:lead@nithub.com)
- **Technical Questions**: [tech@nithub.com](mailto:tech@nithub.com)
- **Code of Conduct**: [conduct@nithub.com](mailto:conduct@nithub.com)
- **Security Issues**: [security@nithub.com](mailto:security@nithub.com)

---

Thank you for contributing to the Nithub Space Management System! Your contributions help make this project better for everyone. 🎉
