# Part 2: Backend API

REST API backend for the AI Secretary application with user authentication, conversation persistence, and Claude API integration.

## Features

- ?? User authentication with JWT
- ?? Persistent conversation storage (Supabase/PostgreSQL)
- ?? Claude API integration
- ?? RESTful API design
- ?? Serverless deployment ready (Vercel)

## Prerequisites

- Node.js 18+
- Anthropic API key
- Supabase account

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Get JWT token | No |
| GET | /conversations | List user's conversations | Yes |
| POST | /conversations | Create conversation | Yes |
| GET | /conversations/:id/messages | Get messages | Yes |
| POST | /conversations/:id/messages | Send message | Yes |

## Setup Instructions

See the [Part 2 Guide](../docs/Part_2_Backend_API_Guide.md) for complete step-by-step instructions.

## Technologies Used

- Express.js
- Supabase (PostgreSQL + Auth)
- Anthropic Claude API
- Vercel (Deployment)

## Part of AI Secretary Project

This is Part 2 of a 3-part project. See the main [project README](../README.md) for the complete course structure.

**Previous:** Part 1 - CLI Bot  
**Next:** Part 3 - Web Frontend
