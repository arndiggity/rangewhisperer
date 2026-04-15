# downwind — UX Flows
## Step-by-step user journeys for every screen and interaction
*Internal document — used to keep Cursor building the right thing consistently.*

---

## Version
1.0 — April 2026

---

## Design Principles (Quick Reference)

- **One cue at a time** — never overload the golfer
- **Progressive disclosure** — max 2 follow-up questions per shot, multiple choice only, always include "Not sure"
- **Design for the range** — sweaty hands, sun glare, distraction. Large touch targets. Minimal reading required.
- **Press to talk** — first tap starts listening, second tap stops and sends. Never hold-to-talk.
- **Haptic feedback** — short buzz on tap to start, double buzz on tap to stop, medium buzz on response received
- **Voice readback** — every Whisper response is read aloud automatically. Stop button appears during playback.

---

## Flow 1: First Time User (Onboarding)

```
App opens
  → Splash screen: "downwind" logo + tagline
  → "Welcome" screen: brief 3-line pitch
  → My Golf profile setup (mandatory fields only)
      → First name
      → Handicap
      → Dominant hand (Left / Right)
      → Age
      → Fitness level (1–5 tap scale)
      → Flexibility level (1–5 tap scale)
      → Primary goal (dropdown)
      → Biggest weakness (dropdown)
      → Injuries (text, skippable)
  → "Meet Whisper" screen: brief explanation of how coaching works
  → Main Coach screen
```

**Rules:**
- Mandatory fields cannot be skipped
- Optional fields shown at bottom with "Add later" option
- No paywall on first open — let them experience the product first
- Onboarding should take under 2 minutes

---

## Flow 2: Returning User — Session Start

```
App opens
  → Main Coach screen
  → Whisper status: "Whisper is ready"
  → Rotating waiting phrase displayed
  → Golfer taps the talk button
  → [Listening state — Siri-style wave animation]
  → Golfer speaks: "What are we working on today?"
      OR app prompts: "Ready to start — pick a programme or go free session"
  → [Programme selection OR free session]
  → Session begins
```

---

## Flow 3: Programme Selection

```
Golfer taps "Programmes" tab in bottom nav
  → Programmes screen loads
  → Par tier programmes shown (available)
  → Birdie tier programmes shown (locked with upgrade prompt)
  → Golfer taps a programme card
      → Programme detail: name, objective, difficulty, what Whisper watches for
      → "Start Session" button (large, bottom of screen)
  → Session begins with programme context active
      → Whisper's coaching is contextualised to programme goal for entire session
  
  OR
  
  Golfer taps "Free Session — No Programme"
  → Session begins with no programme context
```

---

## Flow 4: Core Shot Loop

This is the heartbeat of the product. Every shot follows this exact sequence.

```
[IDLE STATE]
  → "downwind" logo banner at top
  → "Whisper is ready" status with pulsing dot
  → Rotating waiting phrase
  → Large talk button with breathing glow animation
  → If previous shot exists: transcript and Whisper cue visible in card below

[GOLFER TAPS BUTTON — TAP 1]
  → Haptic: short buzz (50ms)
  → Button label changes to "TAP TO STOP"
  → Siri-style wave animation activates — responds to voice volume via Web Audio API
  → Microphone listening begins via Web Speech API

[GOLFER SPEAKS — describes shot]
  → Live transcript appears in real time

[GOLFER TAPS BUTTON AGAIN — TAP 2]
  → Haptic: double buzz (50ms + 50ms)
  → Listening stops
  → Transcript finalised
  → [THINKING STATE] — inward pulse animation on button

[WHISPER PROCESSES]
  → Shot sent to backend
  → Backend sends to Anthropic API with full context
  → Whisper generates response

[RESPONSE RECEIVED]
  → Haptic: medium buzz (100ms)
  → Coach card appears with Whisper's response
  → Voice readback begins automatically (Daniel en-GB)
  → Stop button appears (silences readback instantly)
  → [SPEAKING STATE] — gentle outward pulse on button

[AFTER RESPONSE]
  → Two large buttons appear at bottom:
      [Reply]      [Next Shot]

[IF GOLFER TAPS REPLY]
  → Talk button reactivates
  → Golfer can respond to Whisper's follow-up question or continue conversation
  → Conversation continues about same shot
  → After reply cycle, Next Shot button appears again

[IF GOLFER TAPS NEXT SHOT]
  → Screen resets to idle state
  → New waiting phrase displayed
  → Shot is saved to database
  → Ready for next shot
```

---

## Flow 5: Follow-Up Questions

Whisper may ask at most ONE follow-up question per shot response.

```
Whisper response includes a follow-up question
  → Question displayed as text
  → Multiple choice buttons appear (max 4 options, always includes "Not sure")
  → Golfer taps their answer
  → Answer logged to shot record
  → Whisper gives final coaching cue based on full context
  → Next Shot / Reply buttons appear
```

**Rules:**
- Never show two follow-up questions simultaneously
- Maximum 2 follow-up questions per shot across the full conversation
- Follow-up answers are stored as structured data — not free text

---

## Flow 6: Course Whisperer (Pre-Shot Context)

```
Golfer navigates to Course Whisperer screen
  → Tap talk button
  → Speaks shot context: club, distance, lie, pin position, hazard
  → Context fields auto-populate from voice (or golfer can tap to edit)
  → "Get Whisper's Read" button at bottom
  → Whisper gives pre-shot strategic advice (2–3 sentences)
  → Golfer returns to course/simulator and hits
  → After shot, golfer can return to Coach screen and report outcome
  → Whisper gives swing coaching contextualised to the strategy it recommended
```

---

## Flow 7: Shot Guide

```
Golfer taps "?" icon on Coach screen
  → Shot Guide screen opens
  → Category tabs: All / Ball Flight / Contact / Trajectory
  → Scrollable list of miss cards
  → Each card shows:
      → Miss name (Cinzel font)
      → Severity badge (Most Common / Common / Manageable / Severe / Controlled)
      → Ball flight tracer (golfer's eye view, sky + fairway background)
      → Plain English definition
      → Feel descriptor in italics
  → Golfer reads, identifies their miss
  → Taps back arrow to return to Coach screen
  → Golfer now knows what to report to Whisper
```

---

## Flow 8: My Golf Profile

```
Golfer taps "My Golf" tab in bottom nav
  → Profile screen shows avatar, name, handicap
  → Essential fields displayed (always populated from onboarding)
  → Optional fields displayed (tap any to edit)
  → Mastery progress section (Birdie tier only)
      → Each active programme shows a 5-segment progress bar
      → Level label and hint: "Try Off The Tee next session"
  → "Save Changes" button at bottom (gold, full width)
  → Changes saved to database on tap
  → Whisper uses updated profile in next session immediately
```

---

## Flow 9: Session History

```
Golfer navigates to Session History
  → List of past sessions in reverse chronological order
  → Each session card shows:
      → Date, location, duration
      → Programme name (or "Free Session")
      → Tag showing focus area
      → 2–3 bullet points of key patterns
      → Home practice suggestions
      → "Whisper says" mindset cue in italics
  → Golfer can scroll through history
  → No tap interaction needed — read only
```

---

## Flow 10: Post-Session Summary

```
Golfer taps "End Session" (or session auto-ends after 30 min inactivity)
  → Whisper generates session summary
  → Summary screen shows:
      → Session stats: duration, shots logged, programme
      → Key patterns from the session
      → Home practice suggestions
      → "Whisper says" mindset cue — one memorable line
      → Focus for next session
  → "Done" button returns to main Coach screen
  → Summary saved to Session History
```

---

## Flow 11: Club Analytics

```
Golfer navigates to Club Analytics
  → Screen shows a card per club with enough data (minimum 10 shots)
  → Each card shows:
      → Club name
      → Shots logged count
      → Top 3 miss tendencies with percentage bars (colour coded)
      → Whisper's one-line cue for that club
  → Clubs with fewer than 10 shots show a "not enough data" state
  → Read only — no interaction needed
```

---

## Error States

| Situation | What Whisper Shows |
|---|---|
| Microphone not available | "Microphone access needed — check your browser settings" |
| No internet connection | "You're offline. Connect to get Whisper's coaching." |
| Speech not recognised | "Didn't catch that — tap to try again" |
| API timeout | "Whisper is thinking — try again in a moment" |
| First session, no profile | Prompt to complete My Golf before first shot |

---

## Touch Target Rules

All interactive elements on the Coach screen must meet these minimum sizes for range/simulator use:

| Element | Minimum size |
|---|---|
| Talk button | 96px diameter |
| Reply button | 52px height |
| Next Shot button | 52px height |
| Stop (readback) button | 44px diameter |
| Follow-up answer buttons | 48px height |
| Bottom nav items | 44px height |

---

## Flow 12: Coaching Style Selection (The Locker Room)

```
Session start flow:
  → Golfer selects programme (or free session)
  → "How do you want me to coach you today?" prompt appears
  → 8 style cards displayed with spider diagrams:
      The Caddy / The Drill Sergeant / The Professor / The Mate
      The Zen Master / The Competitor / The Analyst / The Heckler
  → Golfer taps a style card to select
  → Last used style is pre-selected as default
  → Session begins with selected style active

Mid-session style switch:
  → Golfer can request style change at any time via voice or settings
  → Whisper acknowledges: "Switching to [style name]. Let's go."
  → Shot history and profile context carry over — only delivery changes
```

## Flow 13: The Locker Room (Style Guide Reference)

```
Golfer navigates to The Locker Room reference page
  → Accessible from My Golf tab
  → All 8 styles displayed as cards
  → Each card shows:
      → Style name and badge
      → Spider diagram (5 axes: Warmth, Directness, Technical, Emotional, Intensity)
      → Attribute bars with scores
      → Tagline
      → Example Whisper quote
      → Select button
  → Golfer can switch active style directly from this page
  → Currently active style shows as highlighted / selected
```

## Flow 14: The Range Book (Miss Type Reference)

```
Golfer taps [?] icon on Coach screen
  → The Range Book opens (renamed from Shot Guide)
  → Category tabs: All / Ball Flight / Contact / Trajectory
  → Scrollable list of 22 miss cards
  → Each card shows:
      → Miss name and severity badge
      → Ball flight tracer — golfer's eye view (sky + fairway background)
      → Severity colour coding: red (severe), blue (neutral), teal (controlled)
      → Plain English definition
      → Feel descriptor in italics
  → Golfer reads, identifies their miss type
  → Back arrow returns to Coach screen
  → Also accessible from My Golf tab
```

## Flow 15: The Clubhouse

```
Golfer navigates to The Clubhouse
  → Accessible from My Golf tab
  → Sections:
      → About Whisper — coaching philosophy in plain English
      → How Whisper Learns — longitudinal profile explained simply
      → The Cost of Getting This Right — investment context, no specifics
      → The Founder's Story — personal note from the founder
      → The Coaching Philosophy — downwind's beliefs about improvement
  → Read-only — no interaction required
  → Premium editorial design — generous typography, no clutter
```

---

## Navigation Structure

```
Bottom Navigation (always visible):
  [Coach]  [Programmes]  [My Golf]

Accessed from Coach screen:
  [?] → The Range Book (miss type guide)

Accessed from My Golf tab:
  → Club Analytics
  → Session History
  → The Locker Room (coaching style guide)
  → The Range Book
  → The Clubhouse

Accessed from Programmes tab:
  → Course Whisperer (simulator round mode)

Accessed at session start (pre-session flow):
  → Programme selection
  → Coaching style selection (The Locker Room)
```

---

*This document should be updated whenever a new screen or interaction is added. Cursor should be given this document as context when building any new feature.*
