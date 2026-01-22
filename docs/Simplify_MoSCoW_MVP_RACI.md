# AI Secretary SaaS Course
## Simplify: MoSCoW, MVP & RACI

**Framework Phase:** Simplify  
**Status:** ✅ Complete

---

## MoSCoW Prioritization

### Part 1: CLI Bot

| Priority | Features |
|----------|----------|
| **Must** | Send/receive messages, conversation context, exit, error handling |
| **Should** | Secretary persona, token tracking, help/clear commands |
| **Could** | Colored output, export conversations |
| **Won't** | Multiple personas, file attachments |

### Part 2: Backend

| Priority | Features |
|----------|----------|
| **Must** | Registration, login, JWT auth, CRUD conversations/messages |
| **Should** | Input validation, rate limiting, timestamps |
| **Could** | Delete conversation, search |
| **Won't** | Admin dashboard, webhooks |

### Part 3: Frontend

| Priority | Features |
|----------|----------|
| **Must** | Auth forms, chat interface, conversation list, logout |
| **Should** | Loading states, error messages, responsive design |
| **Could** | Dark mode, keyboard shortcuts |
| **Won't** | Message editing, real-time updates |

---

## MVP Definition

### MVP Scope

| Part | MVP Definition | Test |
|------|----------------|------|
| **Part 1** | Multi-turn CLI conversation | "Can I chat with context?" |
| **Part 2** | Auth + CRUD API | "Can I register, login, chat, retrieve?" |
| **Part 3** | Basic web chat UI | "Can I sign up, login, chat, see history?" |

### MVP Timeline

| Phase | MVP | +Polish | Total |
|-------|-----|---------|-------|
| Part 1 | 2h | 2h | 4h |
| Part 2 | 4h | 4h | 8h |
| Part 3 | 4h | 4h | 8h |
| **Total** | **10h** | **10h** | **20h** |

---

## RACI Matrix

| Activity | Learner | Materials | Services |
|----------|---------|-----------|----------|
| Setup | R, A | C | I |
| Coding | R, A | C | - |
| Debug | R, A | C | - |
| Deploy | R, A | C | I |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

---

## Complexity Reduction

### Removed Complexity

| Removed | Why | Impact |
|---------|-----|--------|
| Docker | Learning overhead | Use Vercel instead |
| GraphQL | REST sufficient | Simpler API |
| WebSockets | Polling adequate | No real-time |
| Redis | No caching needed | Direct DB queries |
| CI/CD | Vercel handles it | Auto-deploy |

### Simplifications Made

1. **Single database** - Supabase for both data and auth
2. **Same language** - JavaScript everywhere
3. **Managed hosting** - Vercel handles infrastructure
4. **Free tiers** - No payment complexity

---

## Scope Decisions

### Included
- CLI bot with context
- REST API with auth
- React chat interface
- Supabase database
- Vercel deployment

### Excluded
- Mobile apps
- Voice interface
- Team features
- Analytics
- Payments

---

*This simplification ensures the course is completable in 15-20 hours while teaching all essential concepts.*
