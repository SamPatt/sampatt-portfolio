---
title: Can Coding LLMs only Increase Complexity?
description: In Which I Vent my Frustrations about Using LLMs for Coding
tags:
  - artificial-intelligence
  - AI
  - complexity
  - programming
  - software
  - coding-tools
image: >-
  https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-03-21-can-ai-reduce-complexity/image/2025-03-21-14-48.png
send_newsletter: 'false'
type: blog
last_edited: 2025-03-21T14:57:02.000Z
created: 2025-03-21T14:31:59.000Z
---
![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-03-21-can-ai-reduce-complexity/image/2025-03-21-14-48.png)


I've talked to other developers and listened to some popular content creators, and there seems to be a common pattern emerging: we're letting AI coding tools produce more and more of our overall code.

I see estimates vary, but many claim between 50-80% of their code is AI generated now. That falls in line with my experience too.

Like many others, I'm creating more code overall now. My Github is definitely more active than before I adopted these tools.

But of course quantity and quality aren't the same thing. Is the code better?

I don't know the answer to that, but I do have a nagging feeling when I lean too far into the vibe coding. I notice the responses are often adding code and complexity, and rarely are they removing code and simplifying.

It gets absurd if you don't intervene - giving Claude Code total control over my portfolio as an experiment resulting in more than 1000 lines of CSS for this (fairly simple) website.

It does usually do the job, but of course maintaining this code is an issue - or is it? Can we assume the model is capable of keeping it going and learn to love the verbosity?

Maybe, if you're thinking long term and trust that the models will only get better and better. Rumors are that GPT-5 will have 20m token context window. If the future models are smart enough and have enough space, perhaps we can afford to let them make whatever they like and sort it out later.

But short term, I have reasons to doubt. For one, I've found that models do an excellent job at greenfield work when presented with a clear vision, but they struggle taking an existing code base and simplifying it. Of course that's no surprise - humans are the same - but since each new session has a new context window, the model will find it difficult to reverse engineer the initial process.

This points to the models not truly understanding what they're doing in these cases. I've seen them try to bolt things on in ways that clearly don't make sense, or even just boldly _cheat_. Today Claude Code hardcoded an API key into my HTML to fix an API auth issue! If they understood the code properly, they would just as often simplify instead of add complexity.

This is somewhat due to poor prompting and architecture. If I'm careful about having it document what it's doing, and keep the files small and modular, it gets much further along before it begins flailing. But of course that does require extra work, and if you're putting in a lot of extra work to keep up those guardrails, at some point it would have been better to do it yourself.

Overall I'm quite confident that we'll arrive at a place where we can confidently let the AI code without any hand-holding. My metric for success is when the models can consistently simplify the code base. 
