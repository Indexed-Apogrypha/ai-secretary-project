# Part 1: CLI Secretary Bot

A command-line interface chatbot powered by Claude AI that acts as your personal secretary.

## Features

- ?? Interactive conversation with Claude AI
- ?? Maintains conversation context across multiple turns
- ?? Drafts emails, creates task lists, and more
- ?? Tracks token usage and costs
- ??? Robust error handling
- ?? Professional CLI interface

## Prerequisites

- Node.js 18+
- Anthropic API key

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create .env file:
   ```bash
   ANTHROPIC_API_KEY=your-key-here
   ```

## Usage

Start the bot:
```bash
npm start
```

### Available Commands

- help - Show available commands and examples
- clear - Clear conversation history
- 	okens - Show current conversation token count
- exit - Exit the application

### Example Prompts

```
You: Draft an email about tomorrow's meeting
You: Create a task list for launching a product
You: Write a polite message declining an invitation
```

## Technologies Used

- Node.js
- Anthropic Claude API
- ES6 Modules

## Part of AI Secretary Project

This is Part 1 of a 3-part project. See the main [project README](../README.md) for the complete course structure.

**Next:** Part 2 - Backend API
