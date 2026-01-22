# Part 1: CLI Secretary Bot Guide
## Complete Technical Reference

**Document Type:** Technical Implementation Guide  
**Version:** 1.0.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Milestone 1: Project Setup](#milestone-1-project-setup)
5. [Milestone 2: Basic API Integration](#milestone-2-basic-api-integration)
6. [Milestone 3: Conversation Context](#milestone-3-conversation-context)
7. [Milestone 4: Professional Features](#milestone-4-professional-features)
8. [Complete Final Code](#complete-final-code)
9. [Git & Documentation](#git--documentation)
10. [API Reference](#api-reference)
11. [Troubleshooting](#troubleshooting)

---

## Overview

In Part 1, you'll build a command-line interface (CLI) chatbot that uses Claude AI to act as your personal secretary. This project teaches you the fundamentals of:
- API integration
- Conversation management
- Error handling
- Token usage tracking

**Why start with CLI?**
- Simpler than web interfaces
- Focus on core AI integration
- Faster to build and test
- Essential foundation for Parts 2 & 3

> **ðŸ’¡ Tip:** For a more guided, step-by-step experience with validation checkpoints at every step, see the [Interactive Walkthrough](Part_1_Interactive_Walkthrough.md). Use this guide for technical reference and complete code examples.

---

## Prerequisites

### Required Software
- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager (comes with Node.js)
- **Git** - Version control
- **VSCode** - Code editor (recommended)

### Required Accounts
- **Anthropic** - API key for Claude

### Verify Installation
```powershell
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.x.x
```

### Development Environment Location
All project files should be created in your development environment:
```
B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project
```

**Folder Structure:**
```
B:\DEVELOPMENT ENVIRONMENT\
├── Git\                    # Git installation
├── Microsoft VS Code\      # VSCode installation
├── nodejs\                 # Node.js installation
├── Notepad++\              # Notepad++ installation
└── ai-secretary-project\   # Your project
    ├── docs\               # Documentation
    ├── part1-cli\          # Part 1 - CLI Bot (you are here)
    ├── part2-backend\      # Part 2 - Backend API
    └── part3-frontend\     # Part 3 - React Frontend
```

### API Key
Your Anthropic API key should be saved at:
```
~/api-keys/anthropic.txt
```
or
```
C:\Users\YOUR_USERNAME\api-keys\anthropic.txt
```

If you haven't completed Part 0 (Environment Setup), do that first.

---

## Architecture

### System Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                     CLI Secretary Bot                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                             â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚  â”‚   User      â”‚â”€â”€â”€>â”‚   Node.js   â”‚â”€â”€â”€>â”‚  Anthropic  â”‚     â”‚
â”‚  â”‚   Input     â”‚    â”‚   Runtime   â”‚    â”‚  Claude API â”‚     â”‚
â”‚  â”‚  (Terminal) â”‚<â”€â”€â”€â”‚   (index.js)â”‚<â”€â”€â”€â”‚             â”‚     â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚                            â”‚                                â”‚
â”‚                     â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”                        â”‚
â”‚                     â”‚   Packages  â”‚                        â”‚
â”‚                     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                        â”‚
â”‚                     â”‚ @anthropic- â”‚                        â”‚
â”‚                     â”‚ ai/sdk      â”‚                        â”‚
â”‚                     â”‚ dotenv      â”‚                        â”‚
â”‚                     â”‚ readline    â”‚                        â”‚
â”‚                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                        â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Data Flow

```
1. User types message in terminal
         â†“
2. readline captures input
         â†“
3. Message added to conversationHistory array
         â†“
4. Full history sent to Claude API
         â†“
5. Claude processes with system prompt context
         â†“
6. Response returned via API
         â†“
7. Response added to conversationHistory
         â†“
8. Response displayed to user
         â†“
9. Loop back to step 1
```

### Key Concepts

**Conversation History**
```javascript
// Array structure - maintains context
const conversationHistory = [
  { role: 'user', content: 'My name is Matthew' },
  { role: 'assistant', content: 'Nice to meet you!' },
  { role: 'user', content: 'What is my name?' },
  { role: 'assistant', content: 'Your name is Matthew.' }
];
```

**System Prompt**
- Defines Claude's persona and behavior
- Sent with every API request
- Not visible in conversation history

**Token Management**
- Input tokens: Your messages + conversation history
- Output tokens: Claude's responses
- Cost = (input Ã— input_rate) + (output Ã— output_rate)

---

## Milestone 1: Project Setup

### 1.1 Create Project Structure

```powershell
# Navigate to development environment on B: drive
cd "B:\DEVELOPMENT ENVIRONMENT"

# Create AI Secretary project folder (if not already created)
mkdir ai-secretary-project -ErrorAction SilentlyContinue
cd ai-secretary-project

# Navigate to Part 1 CLI folder
cd part1-cli
```

> **Note:** Your development environment is on `B:\DEVELOPMENT ENVIRONMENT`. All project files should be created here to keep your workspace organized. The full path is:
> ```
> B:\DEVELOPMENT ENVIRONMENT\ai-secretary-project\part1-cli
> ```

### 1.2 Initialize Node.js Project

```powershell
npm init -y
```

This creates `package.json` with default settings.

### 1.3 Configure ES6 Modules

Edit `package.json`:

```json
{
  "name": "part1-cli-bot",
  "version": "1.0.0",
  "type": "module",
  "description": "CLI chatbot using Claude API",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "keywords": ["claude", "ai", "chatbot", "cli"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Key settings:**
- `"type": "module"` - Enables ES6 import/export syntax
- `scripts.start` - Runs with `npm start`
- `scripts.dev` - Auto-restarts on file changes

### 1.4 Install Dependencies

```powershell
npm install @anthropic-ai/sdk dotenv
```

**Packages installed:**
| Package | Purpose |
|---------|---------|
| `@anthropic-ai/sdk` | Official Anthropic SDK for Claude API |
| `dotenv` | Loads environment variables from .env file |

**Note:** `readline` is built into Node.js - no installation needed.

### 1.5 Create Environment File

Create `.env` in project root:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```

**Get your key:**
```powershell
Get-Content "$HOME\api-keys\anthropic.txt"
```

**Important rules:**
- No quotes around the value
- No spaces around the `=`
- Key starts with `sk-ant-`

### 1.6 Create .gitignore

Create `.gitignore`:

```gitignore
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Operating System
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

### 1.7 Verify Structure

```powershell
Get-ChildItem
```

Expected output:
```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----                                            node_modules
-a----                                            .env
-a----                                            .gitignore
-a----                                            package.json
-a----                                            package-lock.json
```

**âœ… Milestone 1 Complete**

---

## Milestone 2: Basic API Integration

### 2.1 Create Main File

Create `index.js`:

```javascript
// ===========================================
// Part 1: CLI Secretary Bot - Basic Version
// ===========================================

// Import packages
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Main function
async function main() {
  console.log('ðŸ¤– AI Secretary - CLI Bot');
  console.log('Type your message and press Enter. Type "exit" to quit.\n');

  // Create readline interface for terminal I/O
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt for user input
  rl.question('You: ', async (userInput) => {
    // Check for exit command
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    try {
      // Call Claude API
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: userInput
        }]
      });

      // Display response
      console.log('\nClaude:', message.content[0].text);
      console.log('\n---\n');
      
      // Close (single message only for now)
      rl.close();
      
    } catch (error) {
      console.error('Error:', error.message);
      rl.close();
    }
  });
}

// Run the program
main();
```

> **Note on Model Versions:** This guide uses `claude-sonnet-4-20250514` (Claude Sonnet 4). Check [Anthropic's documentation](https://docs.anthropic.com/en/docs/models-overview) for the latest available models. The code structure remains the same - just update the `model` parameter.

### 2.2 Test Basic Functionality

```powershell
npm start
```

**Test sequence:**
```
ðŸ¤– AI Secretary - CLI Bot
Type your message and press Enter. Type "exit" to quit.

You: Hello, Claude!

Claude: Hello! How can I assist you today?

---
```

### 2.3 Understanding the Code

**Import Section**
```javascript
import Anthropic from '@anthropic-ai/sdk';  // Claude API client
import dotenv from 'dotenv';                 // Environment loader
import readline from 'readline';             // Terminal I/O
```

**Configuration**
```javascript
dotenv.config();  // Reads .env file into process.env

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,  // Authenticated client
});
```

**API Call**
```javascript
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',     // Model to use
  max_tokens: 1024,                       // Max response length
  messages: [{                            // Conversation messages
    role: 'user',
    content: userInput
  }]
});
```

**Response Structure**
```javascript
// message object structure:
{
  id: 'msg_01XYZ...',
  type: 'message',
  role: 'assistant',
  content: [
    {
      type: 'text',
      text: 'Hello! How can I assist you today?'
    }
  ],
  model: 'claude-sonnet-4-20250514',
  stop_reason: 'end_turn',
  usage: {
    input_tokens: 12,
    output_tokens: 8
  }
}

// Access response text:
message.content[0].text
```

**âœ… Milestone 2 Complete**

---

## Milestone 3: Conversation Context

### 3.1 The Problem

Current behavior:
- Each message is independent
- No memory between messages
- Must restart for each interaction

### 3.2 The Solution

Store all messages and send full history:

```javascript
// Before: Single message
messages: [{ role: 'user', content: userInput }]

// After: Full conversation
const conversationHistory = [];
// ... add messages as conversation progresses ...
messages: conversationHistory  // Send everything
```

### 3.3 Updated Code with Conversation Loop

Replace `index.js` with:

```javascript
// ===========================================
// Part 1: CLI Secretary Bot - With Context
// ===========================================

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Conversation history storage
const conversationHistory = [];

// Secretary system prompt
const SYSTEM_PROMPT = `You are a professional personal secretary assistant. Your role is to:

- Draft professional emails, messages, and documents
- Create organized task lists and agendas
- Maintain a polite, professional, and helpful tone
- Be concise but thorough
- Anticipate needs and offer proactive suggestions

When drafting communications, use proper formatting and structure. When creating lists, organize them logically with priorities.`;

async function main() {
  console.log('ðŸ¤– AI Secretary - CLI Bot');
  console.log('Type your messages and press Enter. Type "exit" to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: '
  });

  // Show initial prompt
  rl.prompt();

  // Listen for each line of input
  rl.on('line', async (userInput) => {
    // Handle exit command
    if (userInput.toLowerCase().trim() === 'exit') {
      console.log('\nGoodbye! ðŸ‘‹');
      rl.close();
      return;
    }

    // Skip empty input
    if (!userInput.trim()) {
      rl.prompt();
      return;
    }

    try {
      // Add user message to history
      conversationHistory.push({
        role: 'user',
        content: userInput
      });

      // Call Claude API with full history
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      });

      const assistantMessage = message.content[0].text;

      // Add Claude's response to history
      conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Display response
      console.log('\nClaude:', assistantMessage);
      console.log();

      // Show prompt for next input
      rl.prompt();

    } catch (error) {
      // Remove failed user message
      conversationHistory.pop();
      console.error('\nâŒ Error:', error.message);
      console.log();
      rl.prompt();
    }
  });

  // Handle Ctrl+C
  rl.on('close', () => {
    console.log('\nGoodbye! ðŸ‘‹');
    process.exit(0);
  });
}

main();
```

### 3.4 Test Conversation Memory

```powershell
npm start
```

**Test sequence:**
```
You: My name is Matthew
Claude: Nice to meet you, Matthew! How can I assist you today?

You: What is my name?
Claude: Your name is Matthew.

You: Draft an email about a meeting tomorrow
Claude: Subject: Meeting Tomorrow...

You: Make it more casual
Claude: [Rewrites the SAME email in casual tone]
```

**âœ… Memory works! Context is maintained.**

### 3.5 Understanding Context Management

**How it works:**

```
Turn 1:
  conversationHistory = [
    { role: 'user', content: 'My name is Matthew' },
    { role: 'assistant', content: 'Nice to meet you...' }
  ]
  
Turn 2:
  conversationHistory = [
    { role: 'user', content: 'My name is Matthew' },
    { role: 'assistant', content: 'Nice to meet you...' },
    { role: 'user', content: 'What is my name?' },
    { role: 'assistant', content: 'Your name is Matthew.' }
  ]
```

Each API call sends the **entire history**, so Claude has full context.

**âœ… Milestone 3 Complete**

---

## Milestone 4: Professional Features

### 4.1 Token Usage Tracking

Add this function before `main()`:

```javascript
// Display token usage and estimated cost
function displayTokenUsage(usage) {
  const inputTokens = usage.input_tokens;
  const outputTokens = usage.output_tokens;
  const totalTokens = inputTokens + outputTokens;
  
  // Claude Sonnet 4 pricing (per 1M tokens)
  const inputCost = (inputTokens / 1_000_000) * 3;   // $3/1M input
  const outputCost = (outputTokens / 1_000_000) * 15; // $15/1M output
  const totalCost = inputCost + outputCost;
  
  console.log(`\nðŸ“Š Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens})`);
  console.log(`ðŸ’° Cost: $${totalCost.toFixed(6)}`);
}
```

Call it after getting response:

```javascript
// Display response
console.log('\nClaude:', assistantMessage);

// Display token usage
displayTokenUsage(message.usage);

console.log();
```

### 4.2 Help Command

Add before `main()`:

```javascript
// Show help information
function showHelp() {
  console.log(`
ðŸ“– Available Commands:
  exit     - Exit the application
  help     - Show this help message
  clear    - Clear conversation history
  tokens   - Show current conversation token estimate

ðŸ’¡ Example prompts:
  "Draft an email about tomorrow's meeting"
  "Create a task list for my project"
  "Write a polite decline message"
  `);
}
```

### 4.3 Clear and Tokens Commands

Update the `rl.on('line')` handler to include command handling at the top:

```javascript
rl.on('line', async (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Handle exit
  if (input === 'exit') {
    console.log('\nGoodbye! ðŸ‘‹');
    rl.close();
    return;
  }
  
  // Handle help
  if (input === 'help') {
    showHelp();
    rl.prompt();
    return;
  }
  
  // Handle clear
  if (input === 'clear') {
    conversationHistory.length = 0;
    console.log('\nâœ… Conversation history cleared\n');
    rl.prompt();
    return;
  }
  
  // Handle tokens
  if (input === 'tokens') {
    const totalTokens = conversationHistory.reduce((sum, msg) => {
      return sum + Math.ceil(msg.content.length / 4);
    }, 0);
    console.log(`\nðŸ“Š Current conversation: ~${totalTokens} tokens (estimated)\n`);
    rl.prompt();
    return;
  }

  // Skip empty inputs
  if (!userInput.trim()) {
    rl.prompt();
    return;
  }

  // ... rest of API call code ...
```

### 4.4 Loading Indicator

Add before the API call:

```javascript
// Show loading
console.log('\nâ³ Thinking...');
```

Add after getting response (before displaying):

```javascript
// Clear loading message
process.stdout.write('\r\x1b[K');
```

### 4.5 Better Error Handling

Replace the catch block:

```javascript
} catch (error) {
  // Remove failed user message
  conversationHistory.pop();
  
  // Clear loading indicator
  process.stdout.write('\r\x1b[K');
  
  // Handle specific error types
  if (error.status === 401) {
    console.error('\nâŒ Authentication Error: Invalid API key');
    console.log('Please check your .env file\n');
  } else if (error.status === 429) {
    console.error('\nâŒ Rate Limit: Too many requests');
    console.log('Please wait a moment before trying again\n');
  } else if (error.status === 500) {
    console.error('\nâŒ Server Error: Claude API is having issues');
    console.log('Please try again in a moment\n');
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    console.error('\nâŒ Network Error: Cannot reach Claude API');
    console.log('Please check your internet connection\n');
  } else {
    console.error('\nâŒ Error:', error.message);
    console.log();
  }
  
  rl.prompt();
}
```

### 4.6 Update Welcome Message

```javascript
async function main() {
  console.log('ðŸ¤– AI Secretary - CLI Bot');
  console.log('Type your messages and press Enter.');
  console.log('Type "help" for commands.\n');
  
  // ... rest of function
}
```

**âœ… Milestone 4 Complete**

---

## Complete Final Code

Here is the complete, production-ready `index.js`:

```javascript
// ===========================================
// Part 1: CLI Secretary Bot - Complete
// AI-Powered Personal Secretary CLI
// ===========================================

import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Conversation history storage
const conversationHistory = [];

// Secretary system prompt
const SYSTEM_PROMPT = `You are a professional personal secretary assistant. Your role is to:

- Draft professional emails, messages, and documents
- Create organized task lists and agendas
- Maintain a polite, professional, and helpful tone
- Be concise but thorough
- Anticipate needs and offer proactive suggestions

When drafting communications, use proper formatting and structure. When creating lists, organize them logically with priorities.`;

// Display token usage and estimated cost
function displayTokenUsage(usage) {
  const inputTokens = usage.input_tokens;
  const outputTokens = usage.output_tokens;
  const totalTokens = inputTokens + outputTokens;
  
  // Claude Sonnet 4 pricing (per 1M tokens)
  const inputCost = (inputTokens / 1_000_000) * 3;
  const outputCost = (outputTokens / 1_000_000) * 15;
  const totalCost = inputCost + outputCost;
  
  console.log(`\nðŸ“Š Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens})`);
  console.log(`ðŸ’° Cost: $${totalCost.toFixed(6)}`);
}

// Show help information
function showHelp() {
  console.log(`
ðŸ“– Available Commands:
  exit     - Exit the application
  help     - Show this help message
  clear    - Clear conversation history
  tokens   - Show current conversation token estimate

ðŸ’¡ Example prompts:
  "Draft an email about tomorrow's meeting"
  "Create a task list for my project"
  "Write a polite decline message"
  `);
}

// Main application function
async function main() {
  console.log('ðŸ¤– AI Secretary - CLI Bot');
  console.log('Type your messages and press Enter.');
  console.log('Type "help" for commands.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You: '
  });

  // Show initial prompt
  rl.prompt();

  // Listen for each line of input
  rl.on('line', async (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Handle exit
    if (input === 'exit') {
      console.log('\nGoodbye! ðŸ‘‹');
      rl.close();
      return;
    }
    
    // Handle help
    if (input === 'help') {
      showHelp();
      rl.prompt();
      return;
    }
    
    // Handle clear
    if (input === 'clear') {
      conversationHistory.length = 0;
      console.log('\nâœ… Conversation history cleared\n');
      rl.prompt();
      return;
    }
    
    // Handle tokens
    if (input === 'tokens') {
      const totalTokens = conversationHistory.reduce((sum, msg) => {
        return sum + Math.ceil(msg.content.length / 4);
      }, 0);
      console.log(`\nðŸ“Š Current conversation: ~${totalTokens} tokens (estimated)\n`);
      rl.prompt();
      return;
    }

    // Skip empty inputs
    if (!userInput.trim()) {
      rl.prompt();
      return;
    }

    try {
      // Add user message to history
      conversationHistory.push({
        role: 'user',
        content: userInput
      });

      // Show loading indicator
      console.log('\nâ³ Thinking...');

      // Call Claude API with full history
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      });

      // Clear loading indicator
      process.stdout.write('\r\x1b[K');

      const assistantMessage = message.content[0].text;

      // Add Claude's response to history
      conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Display response
      console.log('\nClaude:', assistantMessage);

      // Display token usage
      displayTokenUsage(message.usage);

      console.log();

      // Show prompt for next input
      rl.prompt();

    } catch (error) {
      // Remove failed user message
      conversationHistory.pop();
      
      // Clear loading indicator
      process.stdout.write('\r\x1b[K');
      
      // Handle specific error types
      if (error.status === 401) {
        console.error('\nâŒ Authentication Error: Invalid API key');
        console.log('Please check your .env file\n');
      } else if (error.status === 429) {
        console.error('\nâŒ Rate Limit: Too many requests');
        console.log('Please wait a moment before trying again\n');
      } else if (error.status === 500) {
        console.error('\nâŒ Server Error: Claude API is having issues');
        console.log('Please try again in a moment\n');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error('\nâŒ Network Error: Cannot reach Claude API');
        console.log('Please check your internet connection\n');
      } else {
        console.error('\nâŒ Error:', error.message);
        console.log();
      }
      
      rl.prompt();
    }
  });

  // Handle Ctrl+C gracefully
  rl.on('close', () => {
    console.log('\nGoodbye! ðŸ‘‹');
    process.exit(0);
  });
}

// Run the application
main();
```

---

## Git & Documentation

### Initialize Git

```powershell
git init
```

### Create README.md

```markdown
# AI Secretary - CLI Bot

A command-line chatbot powered by Claude AI that acts as your personal secretary.

## Features

- ðŸ’¬ Interactive conversation with Claude AI
- ðŸ§  Maintains conversation context across multiple turns
- ðŸ“ Drafts emails, creates task lists, and more
- ðŸ“Š Tracks token usage and costs
- ðŸ›¡ï¸ Robust error handling
- ðŸ’» Professional CLI interface

## Prerequisites

- Node.js 18+
- Anthropic API key ([Get one here](https://console.anthropic.com))

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ai-secretary-cli.git
   cd ai-secretary-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in project root:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```

## Usage

Start the bot:
```bash
npm start
```

### Available Commands

- `help` - Show available commands and examples
- `clear` - Clear conversation history
- `tokens` - Show current conversation token count
- `exit` - Exit the application

### Example Prompts

```
You: Draft an email about tomorrow's meeting
You: Create a task list for launching a product
You: Write a polite message declining an invitation
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Anthropic Claude API** - AI language model
- **ES6 Modules** - Modern JavaScript syntax

## License

MIT

## Author

Your Name
```

### Make Initial Commit

```powershell
git add .
git status  # Verify .env is NOT included
git commit -m "feat: Initial CLI secretary bot with conversation context"
```

### Push to GitHub

```powershell
git remote add origin https://github.com/YOUR-USERNAME/ai-secretary-cli.git
git branch -M main
git push -u origin main
```

### Tag the Release

```powershell
git tag -a v1.0.0 -m "Part 1 Complete: CLI Secretary Bot"
git push origin v1.0.0
```

---

## API Reference

### Messages API

**Endpoint:** `anthropic.messages.create()`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model to use (e.g., `claude-sonnet-4-20250514`) |
| `max_tokens` | number | Yes | Maximum response length |
| `messages` | array | Yes | Conversation history |
| `system` | string | No | System prompt |
| `temperature` | number | No | Creativity (0-1, default 1) |
| `stop_sequences` | array | No | Stop generation at these strings |

**Message Object:**

```javascript
{
  role: 'user' | 'assistant',
  content: string
}
```

**Response Object:**

```javascript
{
  id: string,
  type: 'message',
  role: 'assistant',
  content: [{ type: 'text', text: string }],
  model: string,
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence',
  usage: {
    input_tokens: number,
    output_tokens: number
  }
}
```

### Pricing (Claude Sonnet 4)

| Type | Rate |
|------|------|
| Input tokens | $3.00 / 1M tokens |
| Output tokens | $15.00 / 1M tokens |

**Typical costs:**
- Short message (~100 tokens): ~$0.0003
- Long conversation (~5000 tokens): ~$0.015

---

## Troubleshooting

### Error: Cannot find module '@anthropic-ai/sdk'

**Solution:**
```powershell
npm install
```

### Error: Invalid API key

**Causes:**
1. .env file missing
2. API key incorrect
3. Quotes around the key

**Solution:**
```powershell
# Check .env exists and has correct format
cat .env
# Should show: ANTHROPIC_API_KEY=sk-ant-...
```

### Error: SyntaxError: Cannot use import statement

**Cause:** Missing `"type": "module"` in package.json

**Solution:**
```json
{
  "type": "module",
  ...
}
```

### Bot exits after one message

**Cause:** Using old Milestone 2 code

**Solution:** Update to Milestone 3 code with `rl.on('line')` loop

### No token usage showing

**Cause:** Missing `displayTokenUsage()` function or call

**Solution:** Add the function and call it after getting response

### Commands not working

**Cause:** Not using `.toLowerCase().trim()` on input

**Solution:** Ensure command checking uses:
```javascript
const input = userInput.toLowerCase().trim();
```

### Rate limit errors (429)

**Cause:** Too many requests in short time

**Solution:** Wait a moment and try again. Free tier has lower limits.

### Network errors

**Cause:** No internet or API unreachable

**Solution:** Check internet connection and try again

---

## Part 1 Complete! ðŸŽ‰

You've built a professional CLI chatbot with:
- âœ… Claude API integration
- âœ… Conversation context
- âœ… Secretary persona
- âœ… Token tracking
- âœ… Error handling
- âœ… Professional commands

**Next:** Part 2 - Backend API with Express.js and Supabase

---

**Questions or issues?**
- Review this guide
- Check the Troubleshooting section
- See the Interactive Walkthrough for step-by-step guidance

