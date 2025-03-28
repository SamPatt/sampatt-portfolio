---
title: Informed versus Uninformed AI Skeptics
description: In Which I Describe why some AI Skeptics need to Experiment
tags:
  - AI
  - human-ai-interaction
  - productivity
  - measurement
  - academia
  - ignorance
image: >-
  https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-03-28-ai-skeptics/image/scoff_synth2.png
send_newsletter: 'false'
type: blog
last_edited: 2025-03-28T10:33:51.000Z
created: 2025-03-27T10:22:50.000Z
---
This quote from a [recent paper](https://arxiv.org/pdf/2503.18238) caught my attention:

>First, while the current literature, such as Dell’Acqua et al. (2023) and Chen and Chan (2024), reveal the productivity effects of AI by randomizing access to LLM chatbots, they are not multimodal, do not include context, do not allow the chatbots to take independent actions or use APIs to call outside of the platform, and do not provide a collaborative workspace where machines and humans can jointly manipulate output artifacts in real-time.

In other words, measuring the productivity gains from using AI has been hampered because of the artificial constraints of the study design. They're not giving their users access and the environment in which they'd actually use the models for real.

This got me thinking about some of the AI skeptics I've encountered over the past few years.

# AI Skeptics

I don't like hype. I got into the world of cryptocurrency when Bitcoin was really the only game in town, and I've been exposed to more hype than any man should have to witness.

I know many others like me, especially in tech. They've been there, done that, and whether or not the bought the t-shirt, they have well-tuned bullshit detectors. 

**Or so they think.**

The truth is, none of us knows the future. Yes, we can spot hype, but can we know for sure just how delusional the hype is _this time around?_ No. At least, not without proper time investment to see for ourselves.

I've seen many examples of otherwise thoughtful people correctly seeing hype and then incorrectly dismissing the underlying technology because of the mere existence of the hype. The truth they don't want to see is that _their uninformed dismissal is just as naive as the uninformed hype_.

A few times I've seen people make overly dismissive claims about AI (usually in HN or Reddit comment threads), and the responses are often the same: "I'm not uninformed! I've used the models and they didn't work for me."

Isn't this a valid response? Of course! Their own experiences are far more valuable than taking someone else's word about the models' capabilities.

Yet.... these responses were often very far from my own experiences, which made me curious as to why. So I would follow up with questions, and I discovered some commonalities. 

# They aren't using the latest models

![ScoffSynth](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-03-28-ai-skeptics/image/scoff_synth.png)

Remember the ancient days of GPT-3.5? This was the first mainstream model, and it sparked many of these original conversations about the models' capabilities. It was amazing that a computer could hold a conversation at all, but of course the model had serious limitations.

Remember the less ancient days of the GPT-4 release? So do I - it was a major improvement from 3.5, one that kept me feeling excited about where this was heading.

The hype from 3.5 didn't die down when 4 released - instead it grew. This unleashed a wave of AI skeptics who pointed out the limitations of the models at every opportunity.

The problem I noticed was that their objections were almost entirely based on 3.5 and not 4. They would post their prompt and response, then point and laugh. I would ask, "Was this 3.5 or 4?" and I estimate 90% of the time it was the older model. I would rerun the prompt with 4, and of course the output was dramatically improved.

This still happens, frequently. When the models' capabilities upgraded after the transition to reasoning occurred, many examples of poor mathematical reasoning were still trotted out.  Image generation flaws are laughed at, but aren't done with SOTA models. Just this week OpenAI's 4o image tool rolled out and seems to have just about solved text generation in images (see the images in this post) - I guarantee you many will continue to say image generation models will never work for certain applications because they can't handle text properly.

# They move goalposts

![ScoffSynth](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-03-28-ai-skeptics/image/scoff_synth2.png)

Of course AI models can imitate human conversation - that isn't really impressive. Of course AI models can do advanced math - so what? Of course they can make photorealistic images - that problem wasn't that hard. Of course they can generate boilerplate code - they're just ingesting basic documentation. Of course they can troubleshoot bugs - they're just ingesting Stack Overflow. Of course....

You can't transport your mind back to 2020, but if you could, I'm nearly 100% convinced that you would be absolutely astonished by what AI can now do. We passed the Turing Test ages ago, and few people cared.

"The models can do X, but they can't do Y." They then do Y. "They can do Y, but really Z is the thing humans need and models can't do." Over and over again.

# They don't know how to prompt

I almost didn't include this observation, because if a model requires you to become an expert in prompting it in order for it to be useful, then that's a valid objection. This is true - the more time you put into using the models, the better you get at understanding how to prompt them, and the better the responses get.

I am including it, not because the objection isn't valid, but because so many skeptics are lacking basic awareness of how important prompting is. They're doing the equivalent of asking a new intern on their team to handle a complex task without giving them the context they need in a completely new environment.

When I see the prompts they use, I asked them what the rest of the context looks like. All too often, that was it. Then I ask them for the follow up prompts. Nope, that was it - they saw the model failed, and they stopped there.

This just isn't how you use the models. Well, maybe for simple requests. But if you want them to do something complex, you need to be more thoughtful about what information you're giving, what instructions you're giving, and how to guide the model throughout a conversation.

If you're looking for confirmation that AI can't do something, you'll find it. It takes a bit more effort to understand how they can be genuinely useful.

# They don't use tools

This one is becoming less true over time - I've seen a lot of people say they've tried Cursor, for example, and didn't like it. Kudos to you for trying a new tool.

However it still boggles my mind how many developers have never used any type of agentic coding assistant, and their opinions are formed based on prompting manually through a webUI and copying and pasting code.

I get it - it's what you're comfortable with. And it does help you. But if you've never tried Claude Code or Cursor or Aider or the other tools, please give them a try. Moving away from needing to copy and paste is already a huge improvement, but these tools do way more than that now.

If you couple these tools along with learning good prompting and having persistence, they quickly become indispensable, at least for greenfield projects.

# Conclusion

Skepticism is good, but informed skepticism is better. If you're using the SOTA models, you've used models enough to know how to prompt and guide them, you're trying out the latest tools, and you still believe that AI isn't all that useful - great! You have an informed opinion.

As an AI optimist, I've slowly learned the ways in which I was overly-optimistic about what AI could do, or the timelines involved. All I hope to see is the same genuine attempt at learning from the AI skeptics.
