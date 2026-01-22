# Part 0: Environment Setup Guide
## Complete Prerequisites Setup

**Duration:** 1-2 hours  
**Difficulty:** Beginner  
**Prerequisites:** None

---

## Overview

Before building the AI Secretary, you need to set up your development environment. This guide walks you through installing all required tools and creating necessary accounts.

**By the end of Part 0, you'll have:**
- âœ… Node.js and npm installed
- âœ… Git installed and configured
- âœ… VSCode installed
- âœ… GitHub account
- âœ… Anthropic account with API key
- âœ… Supabase account
- âœ… Vercel account
- âœ… API keys stored securely

---

## Table of Contents

1. [Install Node.js](#1-install-nodejs)
2. [Install Git](#2-install-git)
3. [Install VSCode](#3-install-vscode)
4. [Create GitHub Account](#4-create-github-account)
5. [Create Anthropic Account](#5-create-anthropic-account)
6. [Create Supabase Account](#6-create-supabase-account)
7. [Create Vercel Account](#7-create-vercel-account)
8. [Store API Keys](#8-store-api-keys)
9. [Verification](#9-verification)

---

## 1. Install Node.js

Node.js is the JavaScript runtime that powers our CLI bot and backend.

### Windows

**Option A: Direct Download (Recommended)**
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version (18.x or higher)
3. Run the installer
4. Accept all defaults
5. Restart PowerShell/Terminal

**Option B: Using winget**
```powershell
winget install OpenJS.NodeJS.LTS
```

### Mac

**Option A: Direct Download**
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Run the installer

**Option B: Using Homebrew**
```bash
brew install node
```

### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify Installation

```bash
node --version
# Expected: v18.x.x or higher

npm --version
# Expected: 9.x.x or higher
```

- [ ] âœ… Node.js installed and verified

---

## 2. Install Git

Git is version control software for tracking code changes.

### Windows

**Option A: Direct Download (Recommended)**
1. Go to [git-scm.com](https://git-scm.com/download/win)
2. Download the installer
3. Run installer with default options
4. Restart PowerShell/Terminal

**Option B: Using winget**
```powershell
winget install Git.Git
```

### Mac

Git comes with Xcode Command Line Tools:
```bash
xcode-select --install
```

Or via Homebrew:
```bash
brew install git
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install git
```

### Configure Git

After installation, configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Verify Installation

```bash
git --version
# Expected: git version 2.x.x

git config user.name
# Expected: Your Name
```

- [ ] âœ… Git installed and configured

---

## 3. Install VSCode

Visual Studio Code is a powerful, free code editor.

### All Platforms

1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Download for your operating system
3. Run the installer
4. Launch VSCode

### Recommended Extensions

Open VSCode, go to Extensions (Ctrl+Shift+X), and install:

| Extension | Purpose |
|-----------|---------|
| **ESLint** | JavaScript linting |
| **Prettier** | Code formatting |
| **GitLens** | Git visualization |
| **Thunder Client** | API testing |
| **ES7+ React Snippets** | React shortcuts |

### Verify Installation

1. Open VSCode
2. Open terminal (Ctrl+`)
3. Type `node --version`
4. Should show Node.js version

- [ ] âœ… VSCode installed

---

## 4. Create GitHub Account

GitHub hosts your code repositories.

### Steps

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Enter email, create password, choose username
4. Verify email
5. Complete profile setup

### Configure SSH (Optional but Recommended)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

Add the key to GitHub:
1. GitHub â†’ Settings â†’ SSH and GPG keys
2. Click **New SSH key**
3. Paste your public key
4. Save

### Verify

```bash
ssh -T git@github.com
# Expected: Hi username! You've successfully authenticated...
```

- [ ] âœ… GitHub account created

---

## 5. Create Anthropic Account

Anthropic provides the Claude API.

### Steps

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Click **Sign up** or **Get started**
3. Create account with email
4. Verify email
5. Complete account setup

### Get API Key

1. Log in to [console.anthropic.com](https://console.anthropic.com)
2. Go to **API Keys** section
3. Click **Create Key**
4. Name it: `ai-secretary-course`
5. **COPY THE KEY IMMEDIATELY** (shown only once!)

The key looks like:
```
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Important Notes

- **Free tier:** $5 credit for new accounts
- **Rate limits:** Lower on free tier
- **Keep secret:** Never commit to Git!

- [ ] âœ… Anthropic account created
- [ ] âœ… API key generated and copied

---

## 6. Create Supabase Account

Supabase provides the database and authentication.

### Steps

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with GitHub (recommended) or email
4. Complete setup

### Create a Project (Part 2)

You'll create a project in Part 2, but let's verify access now:

1. Log in to [app.supabase.com](https://app.supabase.com)
2. You should see the dashboard
3. Note: Don't create a project yet

### Free Tier Includes

- 500 MB database storage
- 1 GB file storage
- 50,000 monthly active users
- Unlimited API requests

- [ ] âœ… Supabase account created

---

## 7. Create Vercel Account

Vercel hosts your deployed applications.

### Steps

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize GitHub access
5. Complete profile

### Free Tier Includes

- Unlimited websites
- Automatic deployments
- HTTPS certificates
- 100 GB bandwidth/month

### Verify

1. Log in to [vercel.com/dashboard](https://vercel.com/dashboard)
2. You should see an empty projects list
3. Note: Don't create a project yet

- [ ] âœ… Vercel account created

---

## 8. Store API Keys

Store your API keys securely in a local folder.

### Create API Keys Directory

```powershell
# Windows (PowerShell)
mkdir "$HOME\api-keys"
```

```bash
# Mac/Linux
mkdir ~/api-keys
```

### Store Anthropic Key

```powershell
# Windows (PowerShell)
"sk-ant-api03-YOUR-KEY-HERE" | Out-File -FilePath "$HOME\api-keys\anthropic.txt" -Encoding utf8 -NoNewline
```

```bash
# Mac/Linux
echo -n "sk-ant-api03-YOUR-KEY-HERE" > ~/api-keys/anthropic.txt
```

### Verify Storage

```powershell
# Windows
Get-Content "$HOME\api-keys\anthropic.txt"
```

```bash
# Mac/Linux
cat ~/api-keys/anthropic.txt
```

Should show your API key (starts with `sk-ant-api03-`).

### Security Notes

- Never commit API keys to Git
- Don't share API keys
- The `~/api-keys/` folder stays local
- Each project copies key to `.env` (which is gitignored)

- [ ] âœ… API keys stored securely

---

## 9. Verification

### Complete Checklist

Run these commands to verify everything:

```powershell
# Node.js
node --version
# Expected: v18.x.x or higher

# npm
npm --version
# Expected: 9.x.x or higher

# Git
git --version
# Expected: 2.x.x

# Git config
git config user.name
git config user.email
# Expected: Your name and email

# API key stored
Test-Path "$HOME\api-keys\anthropic.txt"
# Expected: True

# View API key
Get-Content "$HOME\api-keys\anthropic.txt"
# Expected: sk-ant-api03-...
```

### Account Checklist

- [ ] Can log in to [github.com](https://github.com)
- [ ] Can log in to [console.anthropic.com](https://console.anthropic.com)
- [ ] Can log in to [app.supabase.com](https://app.supabase.com)
- [ ] Can log in to [vercel.com](https://vercel.com)

### Final Verification

| Component | Status |
|-----------|--------|
| Node.js 18+ | âœ… / âŒ |
| npm 9+ | âœ… / âŒ |
| Git | âœ… / âŒ |
| VSCode | âœ… / âŒ |
| GitHub Account | âœ… / âŒ |
| Anthropic Account | âœ… / âŒ |
| Anthropic API Key | âœ… / âŒ |
| Supabase Account | âœ… / âŒ |
| Vercel Account | âœ… / âŒ |
| API Key Stored | âœ… / âŒ |

---

## Troubleshooting

### Node.js not recognized

**Windows:** Restart PowerShell after installation

**Mac:** Try reopening Terminal

**All:** Verify installation path is in system PATH

### Git config error

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### API key won't save

Make sure directory exists:
```powershell
mkdir "$HOME\api-keys" -Force
```

Then save key again.

### Anthropic key shows "invalid"

- Verify key starts with `sk-ant-api03-`
- Check for extra spaces or newlines
- Generate new key if needed

---

## Next Steps

**Part 0 Complete! ðŸŽ‰**

You're ready to start building. Proceed to:

**Part 1:** `Part_1_Interactive_Walkthrough.md` (recommended)  
or  
**Part 1:** `Part_1_CLI_Secretary_Bot_Guide.md` (technical reference)

---

## Summary

| Component | Purpose | Used In |
|-----------|---------|---------|
| Node.js | JavaScript runtime | Part 1, 2 |
| npm | Package manager | Part 1, 2, 3 |
| Git | Version control | All parts |
| VSCode | Code editor | All parts |
| GitHub | Code hosting | All parts |
| Anthropic | Claude API | Part 1, 2 |
| Supabase | Database & Auth | Part 2, 3 |
| Vercel | Hosting | Part 2, 3 |

---

**Happy building! ðŸš€**

