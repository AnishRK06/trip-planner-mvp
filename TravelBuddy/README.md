# Trip Planner MVP

A comprehensive AI-powered trip planning application built with React and Node.js. Generate personalized travel itineraries, chat with an AI advisor, and manage your travel plans with an intuitive interface.

## Features

- **Smart Trip Generation**: Create detailed itineraries based on destination, party size, and duration
- **AI Chat Advisor**: Get travel advice and itinerary modifications using OpenAI GPT-4o
- **Activity Swapping**: Replace activities with alternatives that fit your preferences and budget
- **Persistent Storage**: All data saved to PostgreSQL database for session recovery
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Rating System**: Rate activities and provide feedback to improve recommendations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **React Query** for server state management
- **Radix UI** + shadcn/ui components
- **Tailwind CSS** for styling
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Drizzle ORM
- **OpenAI API** for AI chat functionality
- **Zod** for validation

## Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trip-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Add your credentials:
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Application pages
│   │   ├── lib/          # Utilities and types
│   │   └── hooks/        # Custom React hooks
├── server/                # Express backend
│   ├── data/             # Mock data and utilities
│   ├── services/         # Business logic services
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── db.ts            # Database connection
├── shared/               # Shared types and schemas
└── components.json       # shadcn/ui configuration
```

## API Endpoints

- `POST /api/trips` - Generate new trip itinerary
- `GET /api/chat/history/:id` - Get chat history
- `POST /api/chat` - Send chat message to AI advisor
- `POST /api/activities/swap` - Get activity alternatives
- `POST /api/ratings` - Save activity rating

## Database Schema

The application uses PostgreSQL with the following main tables:

- **itineraries** - Store trip plans and generated itineraries
- **chat_messages** - Store conversation history with AI advisor
- **ratings** - Store user ratings and feedback for activities

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for chat functionality
- `NODE_ENV` - Environment (development/production)

## Deployment

The application is configured for deployment on Replit with automatic scaling. The production build serves static files through Express with proper caching headers.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details