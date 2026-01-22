# Part 2: Backend API Guide
## Complete Technical Reference

**Document Type:** Technical Implementation Guide  
**Version:** 1.0.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Milestone 1: Express.js Setup](#milestone-1-expressjs-setup)
5. [Milestone 2: Supabase Integration](#milestone-2-supabase-integration)
6. [Milestone 3: Authentication](#milestone-3-authentication)
7. [Milestone 4: API Endpoints](#milestone-4-api-endpoints)
8. [Milestone 5: Deployment](#milestone-5-deployment)
9. [Complete Final Code](#complete-final-code)
10. [Testing Guide](#testing-guide)
11. [Troubleshooting](#troubleshooting)

---

## Overview

In Part 2, you'll build a REST API backend that:
- Handles user authentication
- Stores conversations and messages in a database
- Integrates with Claude API
- Deploys as serverless functions on Vercel

**Why a backend?**
- Persistent storage (conversations survive browser refresh)
- Multi-device access (same account on phone/laptop)
- User authentication (private conversations)
- Foundation for the web frontend (Part 3)

**Duration:** 6-8 hours

---

## Prerequisites

### Required Software
- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control
- **VSCode** - Code editor

### Required Accounts
- **Supabase** - Database and authentication
- **Vercel** - API hosting

### Verify Installation
```powershell
node --version    # v18.x.x or higher
npm --version     # 9.x.x or higher
```

### Development Environment Location
```
B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project\part2-backend
```

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Backend API                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Client Request                                             │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────────┐                                          │
│   │   Express    │                                          │
│   │   Server     │                                          │
│   └──────┬───────┘                                          │
│          │                                                   │
│          ├──────► Auth Middleware                           │
│          │                                                   │
│          ├──────► Routes                                    │
│          │        ├── /auth                                 │
│          │        ├── /conversations                        │
│          │        └── /messages                             │
│          │                                                   │
│          ├──────► Supabase Client                           │
│          │        ├── Database queries                      │
│          │        └── JWT validation                        │
│          │                                                   │
│          └──────► Anthropic Client                          │
│                   └── Claude API calls                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Create account | No |
| POST | /auth/login | Get JWT token | No |
| GET | /conversations | List user's conversations | Yes |
| POST | /conversations | Create conversation | Yes |
| GET | /conversations/:id | Get single conversation | Yes |
| DELETE | /conversations/:id | Delete conversation | Yes |
| GET | /conversations/:id/messages | Get messages | Yes |
| POST | /conversations/:id/messages | Send message | Yes |

---

## Milestone 1: Express.js Setup

### 1.1 Create Project Directory

```powershell
cd "B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project"
cd part2-backend
```

### 1.2 Initialize Node.js Project

```powershell
npm init -y
```

### 1.3 Configure package.json

Edit `package.json`:

```json
{
  "name": "part2-backend-api",
  "version": "1.0.0",
  "type": "module",
  "description": "Backend API for AI Secretary",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "keywords": ["api", "express", "claude", "supabase"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 1.4 Install Dependencies

```powershell
npm install express cors dotenv @anthropic-ai/sdk @supabase/supabase-js
```

**Packages:**
| Package | Purpose |
|---------|---------|
| `express` | Web framework for API |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variables |
| `@anthropic-ai/sdk` | Claude API client |
| `@supabase/supabase-js` | Database client |

### 1.5 Create .env File

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here

# Server
PORT=3000
```

**Get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project (or use existing)
3. Settings → API → Copy URL and service_role key

### 1.6 Create .gitignore

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel
```

### 1.7 Create Basic Server

Create `index.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 1.8 Test Server

```powershell
npm start
```

Visit `http://localhost:3000/health` in browser or:

```powershell
curl http://localhost:3000/health
```

Expected output:
```json
{"status":"ok","message":"API is running"}
```

**✅ Milestone 1 Complete**

---

## Milestone 2: Supabase Integration

### 2.1 Create Database Tables

Go to Supabase Dashboard → SQL Editor, run this:

```sql
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
  tokens_input INTEGER,
  tokens_output INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Policies: Users can only access messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );
```

### 2.2 Create Supabase Config

Create `config/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 2.3 Create Anthropic Config

Create `config/anthropic.js`:

```javascript
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY');
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

### 2.4 Test Database Connection

Update `index.js` to import and test Supabase:

```javascript
import { supabase } from './config/supabase.js';

// Add after middleware
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('count');
    
    if (error) throw error;
    
    res.json({ status: 'ok', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Test: `http://localhost:3000/test-db`

**✅ Milestone 2 Complete**

---

## Milestone 3: Authentication

### 3.1 Create Auth Middleware

Create `middleware/auth.js`:

```javascript
import { supabase } from '../config/supabase.js';

export async function authenticateToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
```

### 3.2 Create Auth Routes

Create `routes/auth.js`:

```javascript
import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
```

### 3.3 Register Routes in index.js

Update `index.js`:

```javascript
import authRoutes from './routes/auth.js';

// Add after middleware
app.use('/auth', authRoutes);
```

### 3.4 Test Authentication

**Register:**
```powershell
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

**Login:**
```powershell
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

Save the `access_token` from the response!

**✅ Milestone 3 Complete**

---

## Milestone 4: API Endpoints

### 4.1 Create Conversation Routes

Create `routes/conversations.js`:

```javascript
import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all conversations for user
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({ conversations: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new conversation
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: req.user.id,
        title: title || 'New Conversation'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ conversation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single conversation
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### 4.2 Create Message Routes

Create `routes/messages.js`:

```javascript
import express from 'express';
import { supabase } from '../config/supabase.js';
import { anthropic } from '../config/anthropic.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Secretary system prompt
const SYSTEM_PROMPT = `You are a professional personal secretary assistant. Your role is to:

- Draft professional emails, messages, and documents
- Create organized task lists and agendas
- Maintain a polite, professional, and helpful tone
- Be concise but thorough
- Anticipate needs and offer proactive suggestions

When drafting communications, use proper formatting and structure. When creating lists, organize them logically with priorities.`;

// Get all messages in a conversation
router.get('/:conversationId', async (req, res) => {
  try {
    // Verify conversation belongs to user
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', req.params.conversationId)
      .eq('user_id', req.user.id)
      .single();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get messages
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', req.params.conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ messages: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message and get Claude's response
router.post('/:conversationId', async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;

    if (!content) {
      return res.status(400).json({ error: 'Message content required' });
    }

    // Verify conversation belongs to user
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', req.user.id)
      .single();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get conversation history
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Build message history for Claude
    const messageHistory = previousMessages || [];
    messageHistory.push({ role: 'user', content });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messageHistory
    });

    const assistantMessage = response.content[0].text;

    // Save user message
    const { data: userMsg, error: userError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: content,
        tokens_input: response.usage.input_tokens
      })
      .select()
      .single();

    if (userError) throw userError;

    // Save assistant message
    const { data: assistantMsg, error: assistantError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
        tokens_output: response.usage.output_tokens
      })
      .select()
      .single();

    if (assistantError) throw assistantError;

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Return both messages and usage
    res.status(201).json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### 4.3 Register Routes in index.js

Update `index.js`:

```javascript
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';

// Add after auth routes
app.use('/conversations', conversationRoutes);
app.use('/conversations', messageRoutes);
```

### 4.4 Test Complete Flow

**1. Register/Login** (get token)

**2. Create conversation:**
```powershell
curl -X POST http://localhost:3000/conversations `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Chat\"}'
```

**3. Send message:**
```powershell
curl -X POST http://localhost:3000/conversations/CONVERSATION_ID `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"content\":\"Draft an email about tomorrow meeting\"}'
```

**4. Get messages:**
```powershell
curl http://localhost:3000/conversations/CONVERSATION_ID `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**✅ Milestone 4 Complete**

---

## Milestone 5: Deployment

### 5.1 Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 5.2 Update index.js for Vercel

Change the bottom of `index.js`:

```javascript
// For Vercel serverless
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
```

### 5.3 Install Vercel CLI

```powershell
npm install -g vercel
```

### 5.4 Deploy

```powershell
vercel
```

Follow prompts:
- Link to existing project? **N**
- Project name: `ai-secretary-api`
- Directory: `./`
- Override settings? **N**

### 5.5 Set Environment Variables

```powershell
vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
```

Paste values when prompted.

### 5.6 Deploy Production

```powershell
vercel --prod
```

Copy the production URL!

### 5.7 Test Production API

```powershell
curl https://your-api.vercel.app/health
```

**✅ Milestone 5 Complete**

---

## Complete Final Code

### Project Structure

```
part2-backend/
├── config/
│   ├── supabase.js
│   └── anthropic.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── conversations.js
│   └── messages.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── vercel.json
```

### Final index.js

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/auth', authRoutes);
app.use('/conversations', conversationRoutes);
app.use('/conversations/:conversationId/messages', messageRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server (local only)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
```

---

## Testing Guide

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new requests:

**Register:**
- Method: POST
- URL: `http://localhost:3000/auth/register`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Login:**
- Method: POST
- URL: `http://localhost:3000/auth/login`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Copy `access_token` from response

**Create Conversation:**
- Method: POST
- URL: `http://localhost:3000/conversations`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "title": "My First Chat"
}
```
- Copy conversation `id`

**Send Message:**
- Method: POST
- URL: `http://localhost:3000/conversations/CONVERSATION_ID/messages`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "content": "Draft an email about tomorrow's meeting"
}
```

**Get Messages:**
- Method: GET
- URL: `http://localhost:3000/conversations/CONVERSATION_ID/messages`
- Headers: `Authorization: Bearer YOUR_TOKEN`

---

## Troubleshooting

### Database Connection Issues

**Error: Invalid Supabase URL**
- Check `.env` has correct `SUPABASE_URL`
- Should start with `https://`
- No trailing slash

**Error: relation does not exist**
- Run the SQL scripts in Supabase SQL Editor
- Make sure you're in the right project

### Authentication Issues

**Error: 401 Unauthorized**
- Token expired (re-login)
- Wrong token format (should be `Bearer TOKEN`)
- Check authorization header spelling

### API Issues

**Error: CORS blocked**
- Add frontend URL to CORS config:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-app.vercel.app']
}));
```

**Error: 500 Internal Server Error**
- Check server logs
- Verify environment variables are set
- Test database connection

### Deployment Issues

**Vercel build fails**
- Check all dependencies in package.json
- Verify vercel.json syntax
- Check environment variables are set in Vercel dashboard

---

## Part 2 Complete! 🎉

You've built a production-ready REST API with:
- ✅ User authentication
- ✅ Database persistence
- ✅ Claude API integration
- ✅ RESTful endpoints
- ✅ Deployed to Vercel

**Next:** Part 3 - Build the React frontend!
