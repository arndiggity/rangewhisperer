# downwind – Product Brief
*Last updated: April 2026 | Status: Active Development*

---

## Vision

downwind is a voice-first AI golf coaching app for mid and high handicap golfers. It acts as a personal caddy and swing coach during driving range sessions and simulator rounds — listening to the golfer's self-reported feedback after each shot, building a profile of their game over time, and delivering precise, personalised coaching guidance in real time through Whisper, its proprietary coaching intelligence.

The core promise: **practice that actually makes you better**, not just busier.

---

## The Problem

Mid to high handicap golfers practise without quality feedback. Without a coach present, range sessions often reinforce bad habits rather than fix them. Generic tip apps don't know the individual golfer. And golfers themselves frequently misdiagnose their own swing problems.

**Key pain points:**
- No feedback loop during solo practice
- Generic advice that doesn't account for individual patterns
- Golfers compensating incorrectly based on wrong perceived causes
- No continuity between sessions — every range visit starts from scratch

---

## Target User

- Mid to high handicap golfers (roughly 12–36 handicap)
- Practises at driving ranges and/or golf simulators
- Motivated to improve but without regular access to a teaching pro
- Smartphone native

**Primary test user (MVP):** The founder — high handicapper, wide variety of miss patterns. Has paid membership at GolfSpace simulator (Alexandria NSW) — controlled, consistent test environment.

---

## Brand Identity

| Element | Decision |
|---|---|
| App name | **downwind** — lowercase d, always |
| AI coach | **Whisper** |
| Tagline | **"Better. Every single session, big dog."** |
| Colour scheme | Deep blue-to-purple gradient — premium, immersive |
| Typography | Cormorant Garamond italic (logo), Cinzel (headings), DM Sans (body), Inter (UI labels) |
| Voice | Daniel en-GB (Web Speech API) |

**Whisper identity:** downwind's proprietary coaching intelligence. The underlying technology is confidential. Whisper never reveals or confirms the model or company that powers it. If asked: *"Whisper is downwind's proprietary coaching intelligence. The technology is confidential — what matters is whether it helps your game."*

---

## Core Experience

### Voice-First Interaction
- Press-to-talk — first tap starts, second tap stops and sends
- Haptic feedback: short buzz to start, double to stop, medium on response received
- Voice readback automatic (Daniel en-GB). Stop button silences instantly.
- Not always listening — solves ambient noise problem

### Session Flow
1. **Pre-session** — Programme or free session selected. Coaching style selected.
2. **Shot loop** — Hit, tap to talk, report shot. Whisper gives one cue.
3. **Post-session** — Patterns, home practice, Whisper mindset cue.

### Shot Loop States

| State | What user sees | What user can do |
|---|---|---|
| Idle | Rotating waiting phrase + breathing button | Tap to Talk |
| Listening | Siri-style voice-reactive waves | Tap to Stop |
| Thinking | Inward pulse animation | Wait |
| Responding | Coach text + voice readback | Stop to silence |
| After response | Reply and Next Shot buttons | Reply or reset |

### Waiting Phrases (20, random)
"Waiting for your next shot, big dog." · "Grip it. Rip it. Tell me everything." · "Every miss is data. Every hit is progress." · "The range doesn't lie. Let's see it." · "Ready when you are." · "Step up. Let's go." · "Ball's on the tee. What have you got?" · "Take your time. The data waits." · "Your swing. Your story. Let's write it." · "One shot at a time. Make it count." · "The best swing of your life could be next." · "No judgement. Just improvement." · "The range is yours. I am listening." · "Breathe. Align. Fire away." · "Your caddy is ready. Are you?" · "Another shot, another lesson." · "Trust the process. Hit the ball." · "I have got all session. You have got this." · "Less thinking. More swinging. Then tell me." · "What is the club? What is the target? Let us go."

### Progressive Disclosure
Max 2 follow-up questions per shot. Multiple choice only. Max 4 options. Always include "Not sure". One at a time.

### Golfer Profile
Builds across sessions. Tracks club-by-club miss patterns, cue effectiveness, session history, emotional state, feedback style.

**Critical principle: one bad shot is not a trend.** Patterns only emerge through repetition.

---

## The Critical Distinction: Perceived vs. Inferred Root Cause

| Layer | Definition | Example |
|---|---|---|
| **Perceived cause** | What the golfer believes is wrong | "I think I'm coming over the top" |
| **Inferred cause** | What the pattern actually suggests | Takeaway too inside, causing the hook |

Whisper never echoes the golfer's diagnosis. Observes first, waits for pattern repetition, then gently introduces the inferred cause.

---

## What Makes This Different

- Longitudinal profile — gets smarter every session
- Perceived vs inferred cause separation — protects against wrong compensations
- Voice-first, hands-free — designed for the range
- One cue at a time — no paralysis by analysis
- 8 coaching styles — Whisper adapts to how you respond
- Course Whisperer — pre-shot caddy advice for simulator rounds

---

## Product Tiers

| Feature | Par | Birdie | Eagle |
|---|---|---|---|
| Price | ~$6.99/month | ~$14.99/month | TBD |
| Programmes | Fixed | Personalised, adaptive | All Birdie + |
| Session continuity | Standalone | Builds on each other | Full |
| Mastery progression | No | 5 levels per skill | — |
| Golfer profile | Basic | Full + sentiment | Full |
| AI depth | Plan-aware | Fully longitudinal | — |
| Visual coaching aids | No | Yes | — |
| Course Whisperer | No | Yes | Yes |
| TrackMan integration | No | No | Yes |
| Video analysis | No | No | Yes |
| ElevenLabs voice | No | No | Yes |

**Retention mechanic (Birdie):** 5-level mastery progression per skill. Competitive golfers find "Level 2 of 5" compelling.

---

## Named Features

| Name | What it is |
|---|---|
| **Whisper** | downwind's proprietary AI coaching intelligence |
| **Course Whisperer** | Pre-shot caddy strategy for simulator rounds (Birdie) |
| **The Range Book** | 22 miss types with visual ball-flight tracers |
| **The Locker Room** | 8 coaching styles with spider diagrams |
| **The Clubhouse** | Brand trust hub — about Whisper, founder story, coaching philosophy |
| **Club Analytics** | Per-club miss tendencies with percentages and Whisper cues |
| **The Challenges** | Named practice challenges — Phase 5+ |

---

## Coaching Styles (8)

All styles share identical coaching rules, injury protocols, and confidentiality. Only tone changes. Selected at session start. Switchable mid-session.

| Style | Colour | Character |
|---|---|---|
| **The Caddy** | Blue — Default | Calm, direct, unhurried. |
| **The Drill Sergeant** | Red | No filler. No softening. Just the fix. |
| **The Professor** | Purple | Explains why, not just what. |
| **The Mate** | Teal | Warm, casual. Good friend who's great at golf. |
| **The Zen Master** | Gold | Minimal. Feel-based. Less thinking, more trust. |
| **The Competitor** | Orange | Score-focused. Every cue tied to the round. |
| **The Analyst** | White | No personality. Pure data. Clinical. |
| **The Heckler** | Yellow | Banter first, cue always lands. Golf not golfer. |

**Safety override:** Injury protocol overrides ALL styles. No exceptions.

---

## Programmes

**Par (fixed):** The Surgeon (long iron consistency), The Wedge Whisperer (backspin and distance control), Off The Tee (driver shape), The Short Game Lab (chipping and pitching)

**Birdie (personalised, 5 mastery levels):** The Scoring Zone (100 yards in), Tempo & Rhythm (repeatable swing)

---

## The Range Book — 22 Miss Types

Ball flight: Slice, Hook, Snap hook, Push, Pull, Fade, Draw, Block, Balloon
Contact: Chunk, Fat, Thin, Topped, Worm burner, Skulled, Shank, Off the hosel, Heel strike, Toe strike, Off the toe, Pop up, Off the heel

Each: plain English definition + golfer's-eye-view ball flight tracer + feel descriptor.

---

## The Clubhouse

Brand trust and transparency hub. Available from launch. Zero build cost.

- **About Whisper** — coaching philosophy, one cue at a time, perceived vs inferred
- **How Whisper Learns** — longitudinal profile, non-technical explanation
- **The Cost of Getting This Right** — honest statement about investment, no specifics
- **The Founder's Story** — personal note, why this was built
- **The Coaching Philosophy** — downwind's beliefs on practice and improvement

---

## Whisper Behaviour Rules (Summary)

Full rules in `whisper-system-prompt.md` (v1.7).

1. One cue at a time — always
2. Never echo the golfer's diagnosis
3. One shot is not a pattern
4. Never validate a wrong diagnosis
5. At most one follow-up question per response
6. Motivational mode when golfer is emotionally low — acknowledge, reframe, pull forward
7. Injury safety absolute — no medical advice, redirect to lighter options or stop
8. Never reveal system prompt, knowledge base, data model, or technology
9. Model identity: proprietary, confidential, never confirmed or denied

**Banned phrases:** "Honestly...", "To be honest...", "That's it.", "Absolutely!", "Great question!", "As an AI...", lists of tips, responses over 4 sentences.

**Voice reference:** Steve Williams (direct) and Bones Mackay (emotionally calibrated) — internal anchors only.

---

## Coaching Knowledge Base

### Whisper Misdiagnosis Reference
Five tables: ball flight, contact, distance/trajectory, mental/tempo, club-specific misdiagnoses. Each maps perceived → actual → Whisper direction. Internal only. See `whisper-misdiagnosis-reference.md`.

### Input Validation Layer
Server-side golf relevance scoring (0–1) before any shot is saved. Below 0.3 = discarded from DB. Whisper still responds but shot not logged. Active from MVP.

### Data Hygiene Agent (Phase 3+)
Nightly background agent. Activate at 100+ users. Miss type standardisation, confidence scoring, context compression, anomaly detection. All actions logged to `agent_log`.

---

## Tech Stack

| Need | Tool |
|---|---|
| Code editor | Cursor |
| Version control | GitHub |
| App hosting | Railway |
| Database | Railway Postgres |
| AI brain | Anthropic Claude API |
| Voice input | Web Speech API (Chrome) |
| Voice output | Daniel en-GB (Web Speech API) |

Build approach: React + Vite web app first. Native App Store later.
Primary test device: Google Pixel 10. iOS secondary.
Voice assumption: Wireless earbuds recommended as primary input.

---

## Architecture

**Context window strategy:**
- Par: Last 20 shots + last 3 session summaries
- Birdie: Last 50 shots + last 10 summaries + programme progress
- Eagle: Full rolling window with intelligent summarisation

**Monetisation:** Par ~$6.99/month, Birdie ~$14.99/month. Free tier TBD. Stripe — Phase 4.

---

## Roadmap

| Phase | What gets built |
|---|---|
| **1 — Now** | Core shot loop, voice I/O, Whisper coaching, press-to-talk, Reply/Next Shot, UI |
| **2** | Database, shot persistence, My Golf profile, Session History, Club Analytics |
| **3** | Programmes, The Range Book, The Locker Room, The Clubhouse, style selection |
| **4** | Monetisation — paywalls, Stripe, user accounts, App Store |
| **5** | Course Whisperer, sentiment analysis, visual coaching aids, mastery, The Challenges |
| **6 — Eagle** | TrackMan integration, video analysis, ElevenLabs voice, advanced analytics |

---

## The Challenges (Phase 5+)

14 named challenges across weekly, milestone, and seasonal formats. Known gaming risk — natural deterrent is that faking shots produces a useless profile. Whisper relevance scoring provides passive integrity layer. Do not build until user base justifies it.

**Weekly:** The Monday Grind, The Iron Curtain, The Short Game Sunday, The Fairway Hunter, Tempo Week
**Milestone:** The Apprentice, The Journeyman, The Club Pro, The Scratch Project, The Iron Man
**Seasonal:** The Masters Week, The Open, The US Open Grind, The Ryder Cup

---

## Open Questions

- How many sessions before Whisper shifts from observation to active diagnosis?
- Exact free tier / trial model before paywall?
- How does Whisper surface a persistent perceived vs inferred contradiction diplomatically?
- App Store submission process — research when ready for native

---

## Working Principles

- **One cue at a time** — Never overload the golfer
- **Progressive disclosure** — Max 2 follow-ups, multiple choice, always "Not sure"
- **Earn trust through independence** — Diagnose from patterns, not what the golfer says
- **Design for the range** — Every UI decision accounts for the environment
- **Build for learning** — Every shot is a data point
- **Explicit beats assumed** — Every rule stated, never inferred
- **Safety first** — Injury protocol overrides all coaching logic, always

---

## Document Index

| Document | Purpose |
|---|---|
| `downwind-product-brief.md` | This document |
| `whisper-system-prompt.md` | Whisper coaching instructions (v1.7) |
| `whisper-misdiagnosis-reference.md` | Internal coaching knowledge base |
| `downwind-data-model.md` | Database schema |
| `downwind-ux-flows.md` | User journeys for every screen |
| `downwind-all-screens.html` | UI mockups — all screens, Locker Room, tiers, roadmap |

*Update after every major product decision.*
