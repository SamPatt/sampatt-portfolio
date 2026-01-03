---
title: Claude Code will politely tell you when you're wrong
tags:
  - AI
  - coding-tools
image: null
last_edited: 2026-01-03T17:27:46.000Z
created: 2026-01-03T17:27:46.000Z
---
I'm frequently told that LLMs are fundamentally flawed because they accept the user's input at face value, and a mind that can never challenge what it hears isn't a mind you can rely on.

Today while coding a weather app I found a very straightforward example of why this isn't true for advanced models.

I thought I was using Airport station codes, but I was accidentally using the weather office codes. They are nearly identical. Claude Code caught this:

```
I see the existing structure. Let me clarify one thing about the station codes you provided. Looking at your NWS CLI links, the stations are actually determined by the issuedby parameter:

  - Miami: issuedby=MIA → KMIA (Miami International)
  - Austin: issuedby=AUS → KAUS (Austin-Bergstrom)
  - LA: issuedby=LAX → KLAX (Los Angeles International)
  - Chicago: issuedby=MDW → KMDW (Chicago Midway, not O'Hare)
  - Denver: issuedby=DEN → KDEN (Denver International)
  - Philadelphia: issuedby=PHL → KPHL (Philadelphia International)

  The codes you provided (KMFL, KEWX, KLOX, KLOT, KBOU, KPHI) are NWS Weather Forecast Office (WFO) codes, not METAR airport codes. METAR requires valid ICAO airport codes.

```

It noticed my mistake and fixed it, no fuss. Notice how similar the two codes look! This is extremely easy to miss.

Claude Code is remarkably useful, and it doesn't just accept whatever you tell it anymore.
