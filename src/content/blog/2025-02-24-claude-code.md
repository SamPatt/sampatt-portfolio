---
type: blog
title: Testing Claude Code
date: 2025-02-24T00:00:00.000Z
description: In Which I Test the New Claude Code Release
send_newsletter: false
last_edited: 2025-03-11T23:58:47.000Z
tags:
  - uncategorized
---

This afternoon my feed exploded with news of Claude Code. Per the norm, the hype is significant - will it live up to the claims? Claude 3.5 Sonnet is my favorite model for coding, as I've [discussed previously](https://sampatt.com/blog/2025-02-09-AI), so I have high hopes.

# Installation

Their instructions couldn't be much easier:

```
1

Install Claude Code

Run in your terminal: `npm install -g @anthropic-ai/claude-code`

2

Navigate to your project

`cd your-project-directory`

3

Start Claude Code

Run `claude` to launch

4

Complete authentication

Follow the one-time OAuth process with your Console account. You’ll need active billing at [console.anthropic.com](https://console.anthropic.com).
```

Running it shows this classic terminal output:

```
╭────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code research preview! │
╰────────────────────────────────────────────╯

  ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗
 ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝
 ██║     ██║     ███████║██║   ██║██║  ██║█████╗  
 ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝  
 ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗
  ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
  ██████╗ ██████╗ ██████╗ ███████╗                
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝                
 ██║     ██║   ██║██║  ██║█████╗                  
 ██║     ██║   ██║██║  ██║██╔══╝                  
 ╚██████╗╚██████╔╝██████╔╝███████╗                
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
```

I have to login, and then it takes me to this:

```
╭──────────────────────────────────────────────────────────────────────╮
│ ✻ Welcome to Claude Code research preview!                           │
│                                                                      │
│   /help for help                                                     │
│                                                                      │
│   cwd: /home/nondescript/code_repos/sampatt/strap-to/strapto-server  │
╰──────────────────────────────────────────────────────────────────────╯

 Tips for getting started:

 1. Run /init to create a CLAUDE.md file with instructions for Claude.
 2. Run /terminal-setup to set up terminal integration
 3. Ask Claude questions about your codebase.
 4. Ask Claude to implement changes to your codebase.

╭─────────────────────────────────────────────────────────────────────────────────╮
│ > Try "create a util logging.py that..."                                        │
╰─────────────────────────────────────────────────────────────────────────────────╯
  ! for bash mode · / for commands · esc to undo                   \⏎ for newline
```

All in terminal - I found this slightly annoying when using Aider, but I'm going to give it a real try again now.

# Understanding my code base

I'm testing this in my [StrapTo server](https://github.com/SamPatt/strapto-server) repo, which is my project to stream local LLM outputs over WebRTC to a browser and accept inputs back from the audience.

I first want to see how well it understand my code base. I had previously used Claude to summarize the API and architecture and put them into a couple markdown docs, so it already has an advantage there. I ask:

> Please review my code base and explain how it works at a high level, then make 
  suggestions for next steps.

3.5 Sonnet typically responds quickly, but this model is Antrophic's first reasoning model, and it takes nearly two minutes to come back with an answer:

```
● I'll analyze your codebase to understand its structure and functionality,
  then provide suggestions for next steps.

● Task(Explore the codebase to understand the major components and their interactions. …
      Focus on:…)
  ⎿  Done (14 tool uses · 44k tokens · 49.0s)

● Task(Based on the current state of the codebase, identify possible improvement areas …
      and next steps for development. Look for:…)
  ⎿  Done (13 tool uses · 37k tokens · 42.0s)

● Based on my analysis of your codebase, here's a high-level overview and
  suggestions for next steps:

  Current Architecture

  StrapTo is a WebRTC-based system for streaming outputs from local AI models
  in real-time. The core components include:

  1. StrapToServer - Central orchestrator managing server lifecycle
  2. EventEmitter - Asynchronous event system for inter-component communication
  3. ModelInterface - Abstract interface for AI models with Ollama
  implementation
  1. WebRTCManager - Handles WebRTC connections, signaling, and data channels
  2. API Routes - HTTP endpoints for control and status

  The system captures AI model outputs, streams them via WebRTC data channels,
  and supports bidirectional communication for interactive sessions.

  Suggested Next Steps (by priority)

  1. Complete API Implementation - Finish implementing API endpoints that match
   your documentation, especially for WebRTC signaling and model control.
  2. Integrate HTTP Server - Connect your defined API routes with an aiohttp
  server implementation in the main server class.
  1. Complete WebRTC Flow - Implement the full connection cycle including
  proper signaling, offer/answer exchange, and ICE candidate handling.
  1. Enhance Client Input Handling - Strengthen the bidirectional communication
   by implementing robust consumer input handling.
  5. Expand Model Support - Add interfaces for other model providers mentioned
  in the README (LMStudio, Llama.cpp, etc.).
  1. Improve Documentation - Create comprehensive installation guides and usage
   examples to make onboarding easier.
  7. Increase Test Coverage - Add integration tests that validate the complete
  flow from model to client.

  Would you like me to elaborate on any specific area?
```

Not bad, although a glance at the docs could have provided quite a bit of that information.

I tried the suggested `/terminal-setup` command:

```
/terminal-setup 
  ⎿  Error: Failed to install VSCode terminal Shift+Enter key binding
```

Hmm.

Next prompt:

>I want to test what I have first, with emphasis on having a real AI agent 
  streaming continously (or at least frequently) and being able to stream that 
  output over WebRTC to a browser. What's the best path to doing this test? I'm 
  interested in using Pydantic AI if possible

I want to learn Pydantic AI for agents, so I'm curious to know how the model responds when I ask it to help me test it this way. That's a fairly new project, so I don't know if it'll have much information about it yet.

It eventually walked me though creating a python and html file to check the connection - it was a bit clunky, but it worked in the end. It did completely dodge the Pydantic AI question though, just saying that would require a separate implementation.

I don't love the terminal format, although after about 15 minutes of back and forth it became more usable. Also, at first it was only pasting code, not altering anything in VSCode itself, and that was a bad experience, but after a while it started to ask to edit files, and from then on, it was much more convenient.

I can't say I see a dramatic increase in capability or intelligence yet, but that's a bit premature. I'm going to plug this into Cursor and give that a try.

# Testing Front End Changes

Switching code bases, I ask it to change some Tailwind styling, and it succeeds. Quickly too! I'm using the thinking version in chat, and it's very fast.

Once again though, I'm not sure I see much difference from 3.5.

It's a great model and I'll keep testing it. So far, it seems like an iteration and not a step change, which makes sense based on their versioning.

Will keep testing and update another day.
