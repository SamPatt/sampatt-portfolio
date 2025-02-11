---
title: AI Tools Suck and are Amazing
date: '2025-02-09'
description: Love Hate
---

I've been using lots of different AI tools to help me code lately, treading close to outright "vibe coding."

The suck part: They still require quite a bit of manual hassle. Things like managing the context window, copying and pasting prompts / code, dealing with hallucinations or the models making assumptions about your code that are wrong.

The amazing part: If you've never written code without an AI, you can't understand how amazing it is to have a machine spit out a perfect function and test for it only three seconds after asking, knowing it would have taken you until lunchtime.

Here are my off-the-hip thoughts.

# Copilot

Excellent autocomplete for boring stuff. I found that if I make a comment about what I want in a function, then start writing the funtion, 80% of the time it will write it out for me correctly. This was my first exposure to AI coding and it was great. 

I can't tell you how many times I've started writing `console` and it will automatically suggest the perfect console log message and data to display with it. Completely unironically, that alone is worth $10 a month. 

However, as I've found myself using the other tools, it simply became something I forgot existed.

# Aider

I want to like Aider because I've always had an affinity for the command line. I don't know if that's because it makes me feel more technically adept than I really am, or if it's because of the many advantages over a GUI that nerds have been insisting upon for generations.

But it feels a bit clumsy. The IDE is so useful that it's hard to beat having a tool built in. I dislike needing to tag files regularly. It just didn't wow me.

# Cline

Cline did wow me, but as with other tools it appears more useful initially than it really is.

My main complaint: it just uses too many damn tokens. It gobbles them up, and the ROI on that investment is often lacking.

It seems less... focused? Hard to describe. It will go in circles sometimes, and that's annoying when I'm watching the Clause API cost climb to $1 or $2 for a single task. I've come back and tried it a few times, and I keep having the same experience.

# Cursor

Cursor didn't wow me initially, it felt similar enough to the other tools. But the more I used it, the more I liked it. It seems much more focused than Cline. It doesn't go in loops frequently. The chat / composer works surprisingly well. You just click to pop an error message into the composer, include the proper context (which it usually has already) and it understands what needs to be fixed, and just does it. It seems to be much better about only pulling the context needed and only changing smaller parts of the code.

Right now it's my favorite within the IDE.

# Claude 3.5 Sonnet

These tools are mostly using Clause 3.5, which is an excellent model. I find myself using it outside the IDE and just asking it whatever I need.

It sometimes will respond with code that it less than clear how to integrate into my existing code, which is why the IDE tools are so helpful. But for architecture and devops I use it all the time.

# OpenAI's models

Yeah they're good too. 