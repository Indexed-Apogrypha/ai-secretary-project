# AI Secretary SaaS Course
## Comprehensive Troubleshooting Guide

**Document Type:** Support Reference  
**Version:** 1.0.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [How to Use This Guide](#how-to-use-this-guide)
2. [Part 0: Environment Setup Issues](#part-0-environment-setup-issues)
3. [Part 1: CLI Bot Issues](#part-1-cli-bot-issues)
4. [Part 2: Backend API Issues](#part-2-backend-api-issues)
5. [Part 3: Frontend Issues](#part-3-frontend-issues)
6. [General Issues](#general-issues)
7. [Error Code Reference](#error-code-reference)

---

## How to Use This Guide

### Quick Diagnosis

1. **Identify the Part** - Which part of the course are you working on?
2. **Find the Category** - What type of issue? (Installation, Authentication, etc.)
3. **Match the Error** - Find your specific error message
4. **Apply the Solution** - Follow step-by-step fix

### Asking for Help

If this guide doesn't solve your issue, gather:
- Exact error message (screenshot if possible)
- Which step you're on
- What you've already tried
- Your operating system

---

## Part 0: Environment Setup Issues

### Node.js Installation

#### Error: 'node' is not recognized as a command

**Cause:** Node.js not installed or not in PATH

**Solution (Windows):**
```powershell
# Download and install from nodejs.org
# OR use winget:
winget install OpenJS.NodeJS.LTS

# Restart PowerShell after installation
# Verify:
node --version
```

**Solution (Mac):**
```bash
# Using Homebrew:
brew install node

# Verify:
node --version
```

#### Error: Permission denied when installing global packages

**Solution (Windows):**
```powershell
# Run PowerShell as Administrator
# Or configure npm to use different directory:
npm config set prefix "$HOME\npm-global"
```

**Solution (Mac/Linux):**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g package-name

# Option 2: Configure npm directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

### Git Issues

#### Error: 'git' is not recognized

**Solution (Windows):**
```powershell
winget install Git.Git
# Restart PowerShell
git --version
```

**Solution (Mac):**
```bash
# Git comes with Xcode Command Line Tools
xcode-select --install
```

#### Error: Please tell me who you are

**Solution:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### API Key Issues

#### Error: API key file not found

**Solution:**
```powershell
# Create the directory
mkdir ~/api-keys

# Create the file with your key
"sk-ant-api03-YOUR-KEY-HERE" | Out-File -FilePath "$HOME\api-keys\anthropic.txt" -Encoding utf8
```

#### Error: Invalid API key format

**Valid format:**
- Starts with `sk-ant-api03-`
- No quotes in the file
- No extra whitespace or newlines

**Check your key:**
```powershell
Get-Content "$HOME\api-keys\anthropic.txt"
# Should output just the key, nothing else
```

---

## Part 1: CLI Bot Issues

### Module & Import Errors

#### Error: Cannot find module '@anthropic-ai/sdk'

**Cause:** Dependencies not installed

**Solution:**
```powershell
cd ~/ai-secretary-projects/part1-cli-bot
npm install
```

**If that doesn't work:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### Error: SyntaxError: Cannot use import statement outside a module

**Cause:** Missing ES6 module configuration

**Solution:**
Add to `package.json`:
```json
{
  "type": "module"
}
```

#### Error: require is not defined in ES module scope

**Cause:** Mixing CommonJS and ES6 syntax

**Solution:**
Change from:
```javascript
const Anthropic = require('@anthropic-ai/sdk');
```
To:
```javascript
import Anthropic from '@anthropic-ai/sdk';
```

---

### API Authentication Errors

#### Error: 401 Authentication Error / Invalid API key

**Causes and Solutions:**

1. **Missing .env file**
   ```powershell
   # Check if .env exists
   Test-Path .env
   # If False, create it:
   "ANTHROPIC_API_KEY=your-key-here" | Out-File .env -Encoding utf8
   ```

2. **Wrong variable name**
   ```bash
   # Must be exactly:
   ANTHROPIC_API_KEY=sk-ant-...
   # Not:
   ANTHROPIC_KEY=...
   API_KEY=...
   ```

3. **Quotes around the key**
   ```bash
   # Wrong:
   ANTHROPIC_API_KEY="sk-ant-..."
   # Right:
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. **Extra whitespace**
   ```bash
   # Wrong:
   ANTHROPIC_API_KEY = sk-ant-...
   # Right:
   ANTHROPIC_API_KEY=sk-ant-...
   ```

5. **dotenv not loaded**
   ```javascript
   // Make sure this is at the top of your file:
   import dotenv from 'dotenv';
   dotenv.config();
   ```

---

### Runtime Errors

#### Error: Bot exits after one message

**Cause:** Using `rl.question()` instead of `rl.on('line')`

**Solution:**
Replace:
```javascript
rl.question('You: ', async (input) => {
  // ...
  rl.close();
});
```

With:
```javascript
rl.on('line', async (input) => {
  // ...
  rl.prompt();  // Ask for next input
});
```

#### Error: conversationHistory is not defined

**Cause:** Array not declared

**Solution:**
Add at the top of your file:
```javascript
const conversationHistory = [];
```

#### Error: message.content is undefined

**Cause:** API returned error instead of message

**Solution:**
Add error handling:
```javascript
try {
  const message = await anthropic.messages.create({...});
  if (message.content && message.content[0]) {
    console.log(message.content[0].text);
  } else {
    console.log('No response received');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

---

### Rate Limit Errors

#### Error: 429 Rate Limit Exceeded

**Cause:** Too many API requests

**Solutions:**

1. **Wait and retry**
   ```javascript
   // Add delay between requests
   await new Promise(resolve => setTimeout(resolve, 1000));
   ```

2. **Check your tier**
   - Free tier has lower limits
   - Consider upgrading if building production app

3. **Implement exponential backoff**
   ```javascript
   async function callWithRetry(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status === 429 && i < maxRetries - 1) {
           await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
         } else {
           throw error;
         }
       }
     }
   }
   ```

---

### Network Errors

#### Error: ENOTFOUND or ECONNREFUSED

**Cause:** Cannot reach API server

**Solutions:**

1. **Check internet connection**
   ```powershell
   Test-NetConnection -ComputerName api.anthropic.com -Port 443
   ```

2. **Check for VPN/proxy issues**
   - Disable VPN temporarily
   - Check proxy settings

3. **Check firewall**
   - Ensure outbound HTTPS is allowed

---

## Part 2: Backend API Issues

### Database Connection

#### Error: Invalid Supabase URL or Key

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the correct values:
   - `SUPABASE_URL` - The Project URL
   - `SUPABASE_ANON_KEY` - The anon/public key
3. Update your `.env`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```

#### Error: relation "conversations" does not exist

**Cause:** Database tables not created

**Solution:**
Run the SQL in Supabase SQL Editor:
```sql
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### Express.js Issues

#### Error: PORT already in use

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (use the PID from above)
taskkill /PID 12345 /F

# Or use a different port
$env:PORT=3001; npm run dev
```

#### Error: CORS policy blocked request

**Solution:**
Add CORS middleware:
```javascript
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-app.vercel.app'],
  credentials: true
}));
```

---

### Authentication Issues

#### Error: JWT expired or invalid

**Solutions:**

1. **Check token format**
   ```javascript
   // Token should be sent as:
   Authorization: Bearer <token>
   ```

2. **Check Supabase JWT secret**
   - Get from Supabase Dashboard → Settings → API → JWT Settings

3. **Check token expiration**
   - Default is 1 hour
   - Implement refresh token flow

---

## Part 3: Frontend Issues

### Build Errors

#### Error: Module not found

**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
```

#### Error: Invalid hook call

**Cause:** Hooks used outside React component or multiple React versions

**Solution:**
```bash
# Check for multiple React versions
npm ls react

# If duplicates, clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Environment Variable Issues

#### Error: Environment variables undefined in browser

**Cause:** Vite requires `VITE_` prefix

**Solution:**
```bash
# Wrong:
SUPABASE_URL=...

# Right:
VITE_SUPABASE_URL=...
```

Access in code:
```javascript
const url = import.meta.env.VITE_SUPABASE_URL;
```

---

### Deployment Issues

#### Error: Vercel build failed

**Common causes and solutions:**

1. **Missing environment variables**
   - Add all `VITE_*` variables in Vercel dashboard

2. **TypeScript errors**
   - Fix all TS errors before deploying
   - Check `tsconfig.json` settings

3. **Import path issues**
   - Use relative imports: `./components/Chat`
   - Not: `/components/Chat`

---

## General Issues

### Git Issues

#### Error: .env file committed to Git

**Solution:**
```bash
# Add to .gitignore
echo ".env" >> .gitignore

# Remove from Git tracking
git rm --cached .env
git commit -m "Remove .env from tracking"
```

#### Error: Merge conflicts

**Solution:**
```bash
# View conflicts
git status

# Edit files to resolve conflicts
# Then:
git add .
git commit -m "Resolve merge conflicts"
```

---

### PowerShell Issues

#### Error: Execution policy restriction

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Error: Terminal encoding issues (weird characters)

**Solution:**
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

---

## Error Code Reference

### HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Invalid/missing API key |
| 403 | Forbidden | Key lacks permission |
| 404 | Not Found | Wrong endpoint URL |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | API service issue |
| 503 | Service Unavailable | API temporarily down |

### Anthropic Error Types

| Error | Meaning | Solution |
|-------|---------|----------|
| `authentication_error` | Bad API key | Check .env file |
| `rate_limit_error` | Too many requests | Wait and retry |
| `overloaded_error` | API busy | Retry with backoff |
| `invalid_request_error` | Bad request format | Check message structure |

### Node.js Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `ENOTFOUND` | DNS lookup failed | Check internet/URL |
| `ECONNREFUSED` | Connection refused | Check if server running |
| `EADDRINUSE` | Port in use | Use different port |
| `MODULE_NOT_FOUND` | Missing dependency | Run `npm install` |

---

## Still Stuck?

If you've tried everything in this guide:

1. **Double-check the basics**
   - Correct directory?
   - All files saved?
   - Terminal restarted after changes?

2. **Start fresh**
   - Delete node_modules
   - Delete .env and recreate
   - Run `npm install` again

3. **Review the guides**
   - Re-read the relevant section
   - Compare your code to examples
   - Check for typos

4. **Search online**
   - Google the exact error message
   - Check Stack Overflow
   - Review Anthropic documentation

---

**Remember:** Most issues are caused by:
- Typos in variable names
- Missing or incorrect environment variables
- Not saving files before running
- Not restarting after configuration changes

Take a break, come back with fresh eyes, and check the basics! 🔍
