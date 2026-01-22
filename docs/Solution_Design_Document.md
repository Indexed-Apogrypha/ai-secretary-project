# AI Secretary SaaS Course
## Solution Design Document

**Document Type:** Technical Architecture  
**Framework Phase:** Design  
**Status:** ✅ Approved  
**Last Updated:** January 2026

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Design](#component-design)
3. [Data Architecture](#data-architecture)
4. [API Specification](#api-specification)
5. [Security Design](#security-design)
6. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Part 1     │    │   Part 3     │    │   Future     │     │
│   │   CLI Bot    │    │   React Web  │    │   Mobile     │     │
│   │   (Local)    │    │   (Vercel)   │    │   (TBD)      │     │
│   └──────┬───────┘    └──────┬───────┘    └──────────────┘     │
│          │                   │                                  │
└──────────┼───────────────────┼──────────────────────────────────┘
           │                   │
           │    ┌──────────────┘
           │    │
┌──────────┼────┼─────────────────────────────────────────────────┐
│          │    │           API LAYER                              │
├──────────┼────┼─────────────────────────────────────────────────┤
│          │    │                                                  │
│          │    │    ┌────────────────────────────────────┐       │
│          │    └───►│         Part 2                      │       │
│          │         │       Express.js API                │       │
│          │         │        (Vercel)                     │       │
│          │         └──────────────┬─────────────────────┘       │
│          │                        │                              │
└──────────┼────────────────────────┼──────────────────────────────┘
           │                        │
┌──────────┼────────────────────────┼──────────────────────────────┐
│          │       SERVICE LAYER    │                              │
├──────────┼────────────────────────┼──────────────────────────────┤
│          │                        │                              │
│          ▼                        ▼                              │
│   ┌──────────────┐    ┌────────────────────────────────────┐   │
│   │  Anthropic   │    │           Supabase                  │   │
│   │  Claude API  │    │  ┌─────────────┐  ┌─────────────┐  │   │
│   │              │    │  │ PostgreSQL  │  │    Auth     │  │   │
│   └──────────────┘    │  │  Database   │  │   Service   │  │   │
│                       │  └─────────────┘  └─────────────┘  │   │
│                       └────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | User interface |
| Styling | Tailwind CSS | Responsive design |
| Backend | Express.js | REST API |
| Runtime | Node.js 18+ | Server runtime |
| Database | PostgreSQL | Data storage |
| Auth | Supabase Auth | Authentication |
| AI | Claude API | LLM responses |
| Hosting | Vercel | Deployment |

---

## Component Design

### Part 1: CLI Bot

```
┌─────────────────────────────────────────┐
│              index.js                    │
├─────────────────────────────────────────┤
│                                          │
│  ┌─────────────────────────────────┐    │
│  │       Main Function              │    │
│  │  • Initialize readline           │    │
│  │  • Event loop                    │    │
│  │  • Command handling              │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │     Anthropic Client             │    │
│  │  • API authentication            │    │
│  │  • Message creation              │    │
│  │  • Response handling             │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │   Conversation History           │    │
│  │  • Message storage               │    │
│  │  • Context management            │    │
│  │  • Clear functionality           │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │      Helper Functions            │    │
│  │  • displayTokenUsage()           │    │
│  │  • showHelp()                    │    │
│  │  • Error handlers                │    │
│  └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

### Part 2: Backend API

```
backend/
├── src/
│   ├── index.js           # Entry point
│   ├── config/
│   │   └── supabase.js    # Supabase client
│   ├── middleware/
│   │   ├── auth.js        # JWT validation
│   │   └── error.js       # Error handling
│   ├── routes/
│   │   ├── auth.js        # Auth endpoints
│   │   ├── conversations.js
│   │   └── messages.js
│   └── services/
│       ├── anthropic.js   # Claude integration
│       └── database.js    # DB operations
├── .env
├── package.json
└── vercel.json
```

### Part 3: Frontend

```
frontend/
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Root component
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Message.jsx
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   └── Layout/
│   │       ├── Sidebar.jsx
│   │       └── Header.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useConversations.js
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── index.css
├── .env
├── package.json
└── vercel.json
```

---

## Data Architecture

### Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- auth.users (built-in)

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can only see their conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only see messages in their conversations"
  ON messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
```

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Users       │     │  Conversations  │     │    Messages     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │──┐  │ id (PK)         │──┐  │ id (PK)         │
│ email           │  │  │ user_id (FK)    │  │  │ conversation_id │
│ created_at      │  └─►│ title           │  └─►│ role            │
│ ...             │     │ created_at      │     │ content         │
└─────────────────┘     │ updated_at      │     │ tokens_used     │
                        └─────────────────┘     │ created_at      │
                                                └─────────────────┘
        1                       *                       *
      User  ──────────────►  Conversations  ──────────────►  Messages
```

---

## API Specification

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Get JWT token | No |
| POST | /auth/logout | Invalidate token | Yes |
| GET | /auth/me | Get current user | Yes |

### Conversation Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /conversations | List user's conversations | Yes |
| POST | /conversations | Create new conversation | Yes |
| GET | /conversations/:id | Get single conversation | Yes |
| DELETE | /conversations/:id | Delete conversation | Yes |

### Message Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /conversations/:id/messages | Get messages | Yes |
| POST | /conversations/:id/messages | Send message | Yes |

### Request/Response Examples

**POST /auth/register**
```json
// Request
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response (201)
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**POST /conversations/:id/messages**
```json
// Request
{
  "content": "Draft an email about the meeting"
}

// Response (201)
{
  "userMessage": {
    "id": "uuid",
    "role": "user",
    "content": "Draft an email..."
  },
  "assistantMessage": {
    "id": "uuid",
    "role": "assistant",
    "content": "Subject: Meeting Tomorrow..."
  },
  "usage": {
    "input_tokens": 150,
    "output_tokens": 200
  }
}
```

---

## Security Design

### Authentication Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Client │     │  API   │     │Supabase│     │ Claude │
└───┬────┘     └───┬────┘     └───┬────┘     └───┬────┘
    │              │              │              │
    │  1. Login    │              │              │
    │─────────────►│              │              │
    │              │  2. Verify   │              │
    │              │─────────────►│              │
    │              │  3. JWT      │              │
    │              │◄─────────────│              │
    │  4. Token    │              │              │
    │◄─────────────│              │              │
    │              │              │              │
    │  5. Request  │              │              │
    │  (+ Bearer)  │              │              │
    │─────────────►│              │              │
    │              │  6. Validate │              │
    │              │─────────────►│              │
    │              │  7. OK       │              │
    │              │◄─────────────│              │
    │              │              │              │
    │              │  8. Claude   │              │
    │              │─────────────────────────────►
    │              │  9. Response │              │
    │              │◄─────────────────────────────
    │  10. Data    │              │              │
    │◄─────────────│              │              │
```

### Security Measures

| Measure | Implementation |
|---------|----------------|
| **Password Hashing** | Supabase (bcrypt) |
| **JWT Tokens** | Supabase Auth |
| **HTTPS** | Vercel (automatic) |
| **API Key Protection** | Environment variables |
| **Row Level Security** | Supabase RLS |
| **Input Validation** | Express middleware |
| **CORS** | Configured origins |

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌───────────────────────┐    ┌───────────────────────┐   │
│   │      Frontend         │    │       Backend          │   │
│   │   (Static + React)    │    │    (Serverless)        │   │
│   │                       │    │                        │   │
│   │  ai-secretary.        │    │  ai-secretary-api.     │   │
│   │  vercel.app           │    │  vercel.app            │   │
│   └───────────────────────┘    └───────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────┼─────────────────────────────────┐
│                             │      External Services          │
├─────────────────────────────┼─────────────────────────────────┤
│                             │                                  │
│   ┌─────────────────────────┼────────────────────────────┐   │
│   │                         ▼                             │   │
│   │                  ┌─────────────┐                     │   │
│   │                  │  Supabase   │                     │   │
│   │                  │ PostgreSQL  │                     │   │
│   │                  │    Auth     │                     │   │
│   │                  └─────────────┘                     │   │
│   │                                                       │   │
│   │                  ┌─────────────┐                     │   │
│   │                  │  Anthropic  │                     │   │
│   │                  │  Claude API │                     │   │
│   │                  └─────────────┘                     │   │
│   │                                                       │   │
│   └───────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Environment Variables

**Backend (.env)**
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=...
```

**Frontend (.env)**
```
VITE_API_URL=https://api.vercel.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Design Decisions

### Why This Architecture?

| Decision | Rationale |
|----------|-----------|
| **Monolithic API** | Simpler for learning, sufficient for scale |
| **Supabase** | Database + Auth in one, generous free tier |
| **Vercel** | Easy deployment, serverless scaling |
| **React** | Industry standard, component model |
| **REST** | Simpler than GraphQL for this use case |

### Trade-offs Accepted

| Trade-off | Accepted Because |
|-----------|------------------|
| No real-time | Polling sufficient for MVP |
| No caching | Simplicity over optimization |
| Single region | Free tier limitation |
| No CDN | Vercel handles static assets |

---

*This architecture supports the learning objectives while remaining simple enough to understand and extend.*
