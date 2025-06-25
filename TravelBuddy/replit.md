# Trip Planner MVP

## Overview

This is a comprehensive Trip Planner MVP built with React and Node.js that allows users to generate personalized travel itineraries with AI assistance. The application features trip planning forms, itinerary generation, activity swapping functionality, and an integrated AI chatbot advisor.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React state with React Query for server state
- **UI Components**: Radix UI with shadcn/ui components and Tailwind CSS
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints for trip management and chat functionality
- **Development**: Hot module replacement with Vite middleware in development
- **Production**: Static file serving with Express

### Data Storage
- **Primary Storage**: PostgreSQL database with Drizzle ORM for persistent data storage
- **Database**: PostgreSQL with tables for itineraries, chat messages, and ratings
- **Session Management**: Database-backed storage with proper relations and indexes
- **Fallback**: Browser localStorage for client-side caching and offline support

## Key Components

### Trip Planning System
- **Form Validation**: Zod schemas for type-safe form validation
- **Trip Generation**: Algorithm to create balanced itineraries within budget constraints
- **Activity Management**: Swap functionality with cost and time filtering
- **Persistence**: Automatic saving/loading of trip data from localStorage

### AI Integration
- **OpenAI Service**: GPT-4o integration for chat responses and itinerary modifications
- **Chat System**: Persistent chat widget with message history
- **Context Awareness**: AI maintains knowledge of current itinerary for relevant suggestions

### UI/UX Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Comprehensive shadcn/ui component system
- **Loading States**: Overlay components for async operations
- **Error Handling**: Toast notifications and inline error messages

## Data Flow

1. **Trip Creation**: User fills form → Validation → Server generates itinerary → Client stores in localStorage
2. **Activity Swapping**: User requests swap → Server provides alternatives → User selects → Client updates itinerary
3. **Chat Interaction**: User sends message → OpenAI processes with context → Response updates chat history
4. **Persistence**: All user actions automatically saved to localStorage for session recovery

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React Query for server state, React Hook Form for forms
- **UI Library**: Radix UI primitives with Tailwind CSS styling
- **Validation**: Zod for runtime type checking and validation
- **Database**: Drizzle ORM with PostgreSQL adapter (Neon serverless)
- **AI Integration**: OpenAI SDK for chat completions

### Development Tools
- **TypeScript**: Full type safety across client and server
- **ESBuild**: Fast bundling for production server code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: PostgreSQL 16 module in Replit
- **Environment**: Node.js 20 runtime

### Production Build
- **Client**: Vite builds optimized static assets to `dist/public`
- **Server**: ESBuild bundles Node.js application to `dist/index.js`
- **Deployment**: Replit autoscale deployment with external port 80

### Configuration
- **Environment Variables**: Database URL, OpenAI API key
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)
- **Asset Handling**: Static file serving with proper caching headers

## Changelog

- June 25, 2025: Added PostgreSQL database integration with Drizzle ORM
  - Created database schema with tables for itineraries, chat messages, and ratings
  - Implemented DatabaseStorage class replacing in-memory storage
  - Set up proper database relations and constraints
  - Updated storage layer to persist all application data
- June 25, 2025: Initial setup with React frontend and Node.js backend

## User Preferences

Preferred communication style: Simple, everyday language.