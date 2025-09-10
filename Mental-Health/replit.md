# Overview

This is ApnaMann - a comprehensive mental health platform designed specifically for Indian college students. The application provides AI-powered psychological first aid, mental health screening tools (PHQ-9 and GAD-7), counselor booking, peer support forums, educational resources, and crisis intervention capabilities. Built as a full-stack web application, it aims to address the growing mental health challenges in Indian higher education institutions through culturally sensitive, accessible, and stigma-free support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React-based SPA**: Built with React 18 and TypeScript for type safety and modern development practices
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for accessible, customizable UI components
- **Styling**: TailwindCSS with CSS variables for theming and responsive design
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for robust form management

## Backend Architecture
- **Node.js/Express**: RESTful API server with Express.js framework
- **WebSocket Support**: Real-time communication for chat functionality using native WebSocket API
- **Middleware Stack**: JSON parsing, URL encoding, request logging, and error handling middleware
- **API Routes**: Modular route organization for users, screening, appointments, forums, crisis management, and analytics

## Data Storage Solutions
- **PostgreSQL Database**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with schema-first approach
- **Schema Design**: Comprehensive tables for users, screening assessments, appointments, forum posts, mood tracking, crisis alerts, and chat sessions
- **Database Migrations**: Managed through Drizzle Kit for version control and deployment

## Authentication and Authorization
- **Session-based Authentication**: User sessions managed through secure cookies
- **Role-based Access**: Admin and student user roles with appropriate permissions
- **User Profile Management**: Institution-based user registration with course and year tracking

## External Dependencies

### AI and ML Services
- **OpenAI GPT Integration**: AI-powered psychological first aid chatbot using GPT-5 model for contextual mental health support
- **Crisis Detection**: AI-powered analysis of chat messages and screening results for automatic crisis intervention

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **WebSocket Protocol**: Native WebSocket implementation for real-time chat functionality

### UI and Styling
- **Radix UI Primitives**: Accessible component primitives for complex UI interactions
- **Lucide React**: Comprehensive icon library for consistent visual elements
- **TailwindCSS**: Utility-first CSS framework with custom design system

### Development Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimizations for Replit platform

### Validation and Forms
- **Zod**: Runtime type validation for API requests and form data
- **React Hook Form**: Performant form library with minimal re-renders
- **Drizzle-Zod**: Integration between database schema and runtime validation

### Mental Health Tools
- **PHQ-9 Assessment**: Standardized depression screening questionnaire
- **GAD-7 Assessment**: Generalized anxiety disorder screening tool
- **Crisis Intervention Protocols**: Automated detection and response system for high-risk situations
- **Mood Tracking**: Daily mood logging and visualization features