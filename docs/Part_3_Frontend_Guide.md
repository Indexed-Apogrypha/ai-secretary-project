# Part 3: Frontend Guide
## Complete Technical Reference

**Document Type:** Technical Implementation Guide  
**Version:** 1.0.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Milestone 1: React Setup](#milestone-1-react-setup)
5. [Milestone 2: Authentication UI](#milestone-2-authentication-ui)
6. [Milestone 3: Chat Interface](#milestone-3-chat-interface)
7. [Milestone 4: Conversation Management](#milestone-4-conversation-management)
8. [Milestone 5: Deployment](#milestone-5-deployment)
9. [Complete Component Code](#complete-component-code)
10. [Troubleshooting](#troubleshooting)

---

## Overview

In Part 3, you'll build a React web application that:
- Provides user registration and login UI
- Displays a chat interface for conversations
- Manages multiple conversations
- Connects to your Part 2 backend API
- Deploys to Vercel

**Why React?**
- Component-based architecture (reusable UI pieces)
- Industry standard (great for portfolio)
- Large ecosystem and community
- Works well with Vercel deployment

**Duration:** 6-8 hours

---

## Prerequisites

### Required Software
- **Node.js 18+**
- **npm**
- **Git**
- **VSCode**

### Required
- **Part 2 API deployed** - You need the API URL from Part 2

### Development Environment Location
```
B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project\part3-frontend
```

---

## Architecture

### Component Hierarchy

```
App
├── AuthContext (state management)
├── LoginPage
│   └── LoginForm
├── RegisterPage
│   └── RegisterForm
└── ChatPage (protected route)
    ├── Sidebar
    │   ├── ConversationList
    │   └── NewConversationButton
    └── ChatArea
        ├── Header
        ├── MessageList
        │   └── Message (x many)
        └── MessageInput
```

### Data Flow

```
User Action → Component → API Service → Backend API
                ↓              ↓
            Local State    Server Response
                ↓              ↓
            Update UI  ← Parse & Store
```

---

## Milestone 1: React Setup

### 1.1 Create React Project

```powershell
cd "B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project"
npm create vite@latest part3-frontend -- --template react
cd part3-frontend
```

### 1.2 Install Dependencies

```powershell
npm install
npm install react-router-dom
```

**Packages:**
| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | React rendering |
| `react-router-dom` | Routing/navigation |
| `vite` | Build tool (already included) |

### 1.3 Configure Tailwind CSS

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.4 Create .env File

```bash
VITE_API_URL=http://localhost:3000
```

**For production**, you'll change this to your Vercel API URL.

### 1.5 Clean Up Starter Files

Delete these files:
- `src/App.css`
- `src/assets/react.svg`

Update `src/App.jsx`:

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Secretary
        </h1>
        <p className="mt-2 text-gray-600">
          Your personal AI assistant
        </p>
      </div>
    </div>
  );
}

export default App;
```

### 1.6 Test Development Server

```powershell
npm run dev
```

Visit `http://localhost:5173` - you should see "AI Secretary" heading.

**✅ Milestone 1 Complete**

---

## Milestone 2: Authentication UI

### 2.1 Create API Service

Create `src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.session?.access_token) {
      this.setToken(data.session.access_token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Conversation endpoints
  async getConversations() {
    return this.request('/conversations');
  }

  async createConversation(title) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteConversation(id) {
    return this.request(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async getMessages(conversationId) {
    return this.request(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId, content) {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const api = new ApiService();
```

### 2.2 Create Auth Context

Create `src/contexts/AuthContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.setToken(token);
        const data = await api.getCurrentUser();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.clearToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  }

  async function register(email, password) {
    const data = await api.register(email, password);
    // After registration, log them in
    return login(email, password);
  }

  function logout() {
    api.clearToken();
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 2.3 Create Login Page

Create `src/pages/LoginPage.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            AI Secretary
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 2.4 Create Register Page

Create `src/pages/RegisterPage.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            AI Secretary
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 2.5 Update App.jsx with Routing

Update `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <div className="p-8">Chat Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 2.6 Test Authentication

1. Start dev server: `npm run dev`
2. Start your backend: (in part2-backend) `npm start`
3. Visit `http://localhost:5173`
4. Click "Register" and create an account
5. You should be redirected to `/chat`

**✅ Milestone 2 Complete**

---

## Milestone 3: Chat Interface

### 3.1 Create Message Component

Create `src/components/Message.jsx`:

```jsx
export function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Create Message Input Component

Create `src/components/MessageInput.jsx`:

```jsx
import { useState } from 'react';

export function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
}
```

### 3.3 Create Message List Component

Create `src/components/MessageList.jsx`:

```jsx
import { useEffect, useRef } from 'react';
import { Message } from './Message';

export function MessageList({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">👋 Welcome!</p>
          <p>Start a conversation with your AI Secretary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 rounded-lg px-4 py-2">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
```

### 3.4 Create Chat Page

Create `src/pages/ChatPage.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';

export function ChatPage() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  async function loadConversations() {
    try {
      const data = await api.getConversations();
      setConversations(data.conversations);
      
      // Select first conversation if available
      if (data.conversations.length > 0 && !currentConversation) {
        setCurrentConversation(data.conversations[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }

  async function loadMessages(conversationId) {
    try {
      const data = await api.getMessages(conversationId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async function handleNewConversation() {
    try {
      const data = await api.createConversation('New Conversation');
      setConversations([data.conversation, ...conversations]);
      setCurrentConversation(data.conversation);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  }

  async function handleSendMessage(content) {
    if (!currentConversation) {
      await handleNewConversation();
      return;
    }

    setLoading(true);

    try {
      const data = await api.sendMessage(currentConversation.id, content);
      setMessages([...messages, data.userMessage, data.assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Secretary</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={logout}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={handleNewConversation}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + New Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversation(conv)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b ${
                  currentConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {conv.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <MessageList messages={messages} loading={loading} />
          <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
```

### 3.5 Update App.jsx

Update the chat route in `src/App.jsx`:

```jsx
import { ChatPage } from './pages/ChatPage';

// Replace the chat route with:
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>
```

### 3.6 Test Complete Flow

1. Make sure backend is running
2. Run frontend: `npm run dev`
3. Register/Login
4. Click "+ New Chat"
5. Send a message
6. See Claude's response!

**✅ Milestone 3 Complete**

---

## Milestone 4: Conversation Management

### 4.1 Add Delete Conversation

Update `src/pages/ChatPage.jsx`, add this function:

```jsx
async function handleDeleteConversation(id) {
  if (!confirm('Delete this conversation?')) return;

  try {
    await api.deleteConversation(id);
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    
    if (currentConversation?.id === id) {
      setCurrentConversation(updated[0] || null);
      setMessages([]);
    }
  } catch (error) {
    console.error('Failed to delete:', error);
  }
}
```

Update the conversation list item to add a delete button:

```jsx
<button
  key={conv.id}
  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b flex justify-between items-center ${
    currentConversation?.id === conv.id ? 'bg-blue-50' : ''
  }`}
>
  <div
    onClick={() => setCurrentConversation(conv)}
    className="flex-1"
  >
    <div className="font-medium text-gray-900 truncate">
      {conv.title}
    </div>
    <div className="text-xs text-gray-500">
      {new Date(conv.updated_at).toLocaleDateString()}
    </div>
  </div>
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteConversation(conv.id);
    }}
    className="text-red-500 hover:text-red-700 p-1"
  >
    🗑️
  </button>
</button>
```

### 4.2 Add Empty State

When no conversations exist, show helpful message. Add to `ChatPage.jsx`:

```jsx
{conversations.length === 0 && (
  <div className="flex-1 flex items-center justify-center text-gray-500">
    <div className="text-center">
      <p className="text-xl mb-4">No conversations yet</p>
      <button
        onClick={handleNewConversation}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Start Your First Chat
      </button>
    </div>
  </div>
)}
```

**✅ Milestone 4 Complete**

---

## Milestone 5: Deployment

### 5.1 Update .env for Production

Create `.env.production`:

```bash
VITE_API_URL=https://your-api.vercel.app
```

Replace with your actual Part 2 API URL from Vercel.

### 5.2 Create vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works on Vercel.

### 5.3 Test Production Build

```powershell
npm run build
npm run preview
```

Visit the preview URL and test everything works.

### 5.4 Deploy to Vercel

```powershell
vercel
```

Follow prompts:
- Project name: `ai-secretary-frontend`
- Framework: Vite
- Override settings? **N**

### 5.5 Deploy Production

```powershell
vercel --prod
```

### 5.6 Update Backend CORS

In your Part 2 backend `index.js`, update CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app' // Add your frontend URL
  ],
  credentials: true
}));
```

Redeploy backend: `vercel --prod`

### 5.7 Test Live Application

1. Visit your Vercel frontend URL
2. Register a new account
3. Create a conversation
4. Send messages
5. Everything should work!

**✅ Milestone 5 Complete**

---

## Complete Component Code

### Project Structure

```
part3-frontend/
├── src/
│   ├── components/
│   │   ├── Message.jsx
│   │   ├── MessageInput.jsx
│   │   └── MessageList.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── ChatPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.production
├── package.json
├── tailwind.config.js
└── vercel.json
```

---

## Troubleshooting

### CORS Errors

**Error:** "Access to fetch blocked by CORS policy"

**Solution:**
- Check backend CORS config includes frontend URL
- Verify no trailing slashes in URLs
- Redeploy backend after changes

### Authentication Issues

**Error:** Redirect loop or "Not authenticated"

**Solution:**
- Check token is stored: `localStorage.getItem('token')`
- Verify API_URL is correct
- Check network tab for 401 errors

### API Connection Failed

**Error:** "Failed to fetch" or network errors

**Solution:**
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Test backend health endpoint manually

### Build Errors

**Error:** Module not found or build fails

**Solution:**
```powershell
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styling Not Working

**Error:** Tailwind classes not applied

**Solution:**
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
- Restart dev server

---

## Part 3 Complete! 🎉

You've built a full React application with:
- ✅ User authentication UI
- ✅ Chat interface with real-time messaging
- ✅ Conversation management
- ✅ Professional UI/UX
- ✅ Deployed to Vercel

---

## 🏆 Full Course Complete!

You now have:
1. **Part 1:** CLI Secretary Bot
2. **Part 2:** REST API Backend
3. **Part 3:** React Web Frontend

**All three parts connected and deployed!**

Your AI Secretary is now live and portfolio-ready! 🚀
