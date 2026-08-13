---
title: 'Lucy: A Voice Assistant for the Pebble Time 2'
description: >-
  Two lanes behind one button — a deterministic router that answers in a quarter
  of a second, and a full agent that takes seventeen.
tags:
  - pebble
  - voice
  - ai
  - agents
  - self-hosting
image: >-
  https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-08-12-lucy/image/lucy-hero.png
send_newsletter: 'false'
type: blog
last_edited: 2026-08-12T20:00:00.000Z
created: 2026-08-12T20:00:00.000Z
---

{{youtube:https://youtu.be/cjOrSb7hUS8}}

## The peon speaks

In the physical world, I'm a mere peon. Yes, I have a loving wife and healthy children, moderate wealth, a decent home, etc. But my veins are entirely absent of noble blood; I'll never lead thousands of men in battle, nor will I have a harem of women desperate to carry on my genes.

In the digital world, I'm a God. Capital G. I have full control over the entire femtosecond fates of billions of electrons which are all doing my bidding. I build what I like. What these castles in the clouds lack in physical substance they make up for in their unrelenting exactness. They are formed directly from my mind.

At least, that's how it should work. That's why I love Linux and open source software. I am the owner and this highly refined and precise arrangement of silicon and energy is my pet. I'm the master, it's the slave. I'm the creator, it's my creation. But what to do when the pet / slave / creation doesn't - or worse, can't - do my bidding?

I care about my fitness and I bought a Fitbit a few years ago. It worked well enough for tracking my heart rate and sleep, but that's all it could do. It might show notifications, sometimes, but I couldn't change anything about it. Then Google bought it, and in order to keep using it, they were trying to force me to connect my Google account and give them all my health information. Yuck. I requested they delete my account and I haven't worn it since.

## Shhhh God's talking

As soon as I heard about the Pebble Time 2 I knew I wanted it. It's an open source wristwatch. You can program it yourself. This isn't a review of the Pebble Time 2, though that's probably worth doing. Basically - I love everything about it. And no, my screen hasn't broken despite doing exactly nothing to protect it.

I use AI a lot. I built OpenClaw earlier in the year and it was buggy and I stopped using it, but I had some friends who loved Hermes so I tried that instead. My friends were right, it's great.

But I don't always want to pull out my smartphone, unlock it, navigate to Telegram and then type or speak a command, then wait for a response and read it before I can put my phone away. Would God do all that to talk to a peon? The Bible is unclear but I'm willing to assume not.

So I wanted a voice assistant I could connect to Hermes. I just, you know, tell it to do something, and it says "yup I got it."

As I began building this (The AI-written tech details are below this) I soon realized two things: 1) Hermes is sort of slow, and 2) there were a lot of things I could do with a voice assistant that didn't require hitting Hermes each time. So I built it to handle things like adding reminders, timers, and tasks without even needing a single LLM call. Almost instant responses.

So it's built with three lanes: 1) Built in trigger words that invoke a function on server that returns immediately, no LLM call, 2) a fast LLM call to determine if it can answer itself or needs big brother Hermes, or 3) The full Hermes call.

Thus far the stats show I'm using Lucy about seven times per day. Once every couple of hours I'll review tasks, add new ones or complete them, check in on Hermes projects or just ask a question I'd normally open an AI app for.

I haven't published it open source yet because it requires the watch app but it also requires a compatible server (both Hermes and a TTS) and I've put no work into documenting how to do that. But if anyone is interested let me know and I'll publish that.

**Keep having fun.**




## Appendix: how it works

_Everything below is machine-written from the source and from measurements taken
against the running system. Numbers are medians of real requests, not estimates._

### Three lanes

A transcript arrives at the server and is routed before anything expensive
happens.

| Lane | Median | Range | n |
|---|---|---|---|
| Local parser | **0.26s** | 0.24–0.35 | 8 |
| Fast model | **2.35s** | 1.73–6.74 | 9 |
| Hermes agent | **16.9s** | 12.8–33.7 | 10 |

Those are wall-clock from request to audio in hand, so they include speech
synthesis. Measured on the watch itself — the frame the transcript appears to
the frame the answer replaces it, which adds dictation hand-off, the phone,
Bluetooth and the network — the local lane lands in about **0.4s**.

The first lane never calls a model. It handles timers, alarms, reminders, tasks
and the clock: a parser looks for shapes it recognises, and when it finds one it
performs the action and returns a sentence. This matters beyond speed. A model
having an off moment can turn a ten-minute timer into a reminder for tomorrow,
and there is no reason to expose a deterministic request to that.

The second lane exists because some questions are already in the weights —
stable general knowledge, simple arithmetic. A small model gets one attempt with
no tools, under a prompt that tells it to defer on anything involving action,
current facts, personal context or ambiguity. When in doubt it defers, because a
slow correct answer beats a fast guess.

Everything else goes to the agent: anything needing tools, current data, or a
judgement call.

![The two lanes on one axis](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2026-08-12-lucy/image/two-lanes.png)

### Where the deferred seconds go

The obvious assumption is that the agent is slow because tools are slow. It
isn't. In a representative 38.2-second run, tool *execution* totalled 1.6
seconds. The remaining ~36s was five sequential round-trips to the model at
roughly seven seconds each: locate the file, read it and get the date, write,
verify the write, compose the reply.

That reframes optimisation. Faster tools buy nothing. The only lever is **fewer
turns** — which means giving the agent the context it would otherwise re-derive,
and not asking it to verify work that cannot silently fail.

An equal amount of latency turned out not to be on the server at all. Android
throttles a backgrounded `setTimeout` aggressively: a polling loop set to 1500ms
was observed firing at a median of 5s, p90 10s, max 14s across 64 polls, so a
finished answer could sit on the server for another fourteen seconds before the
phone thought to ask. Replacing polling with a long poll the server holds open
for up to 25s took a real request from a 35s median to 18.5s.

Deferrals are not always short. One request — "give me an overview of the
project" — spent 195 seconds in the agent, which is why the client's deadline
sits around seven minutes. Giving up early is the worst available outcome, since
the job completes server-side either way and abandoning it only means nobody
hears the answer.

### The protocol

The watch sends a transcript and receives either audio or a deferral. On the
deferred path the server answers `202` with a request id, and the phone polls
that id until it completes.

Every answer is a durable job that survives until acknowledged, because
PebbleKit JS only runs while the watch app is open — leaving the app mid-request
would otherwise lose an answer the server had already produced. The id of the
outstanding request is written to `localStorage` before a reply can arrive, and
cleared only once the watch has the audio *and* the server has been told. On
launch the phone reads the newest unacknowledged results, plays the one matching
that id, and acknowledges the rest without playing them.

Cancelling a request stops you hearing the answer; it does not stop the agent.
There is no cancellation anywhere in the service, and measured across 16
deferred requests the agent begins work a median of **0.11s** after submission,
so no server-side cancel could realistically beat it. Anything the request wrote
stays written.

### Audio

Replies are 16 kHz G.711 mu-law, one byte per sample. In a blind test on the
watch, mu-law beat 8-bit linear at identical cost — 37.4 dB against 30.7 dB SNR,
and the difference was audible. 8 kHz was clearly worst; the speaker does
reproduce above 4 kHz.

Chunks are 4095 bytes because Bluetooth throughput is quantised by the
connection interval. Messages of 128, 256 and 512 bytes all cost roughly the
same 35ms, so anything under 512 is waste: 512 B measured 15.6 KB/s, 2048 B
18.9 KB/s, 4096 B 22.9 KB/s.

That 22.9 KB/s against the 16 KB/s playback consumes is what makes streaming
possible. Transfer outruns playback by 1.43x, so the buffer only ever holds the
surplus piling up — about 4,800 bytes per second of speech rather than 16,000.
Playback starts after 8,000 buffered bytes (half a second) instead of after the
whole transfer, which on a four-second reply is 0.5s of waiting instead of 2.8s.

The receive buffer is 72 KB, and the ceiling is not free heap in the abstract:
the speaker driver's ring buffer comes out of that same heap when the stream
opens, so starving it faults *inside* playback rather than failing cleanly.
Because the surplus grows at ~6.9 KB/s, the phone paces its own sending — past
roughly ten seconds of transfer the surplus would exceed the buffer and the
watch would drop chunks mid-sentence. The estimate is open-loop but errs safely:
a stalled watch consumes slower than modelled, never faster.

### Two tones

Speech is reserved for things with content. The structure of the conversation is
carried by two cues generated on the watch at playback time.

- **Send** — two falling notes, E6 then B5, 60ms each — fires the instant a
  transcript exists, before any network request has started. It answers "did it
  hear me?" and gets out of the way. A single 45ms tick was tried first and read
  as a click from the hardware rather than a deliberate signal.
- **Reply** — two rising notes, B5 then E6, plus a 260ms pause — fires when
  audio comes back. Replies land at an unpredictable moment, so without it the
  first word is missed.

An earlier build spoke the acknowledgement instead, drawing from a shuffle bag
of four phrases. It was warmer for a day and grating by the end of the week: it
said the same nothing every time and spent a second of attention doing it. A
tone carries the identical fact and never wears out.

Six spoken clips are baked into flash — three "still working" variants and three
failure messages — at 188 KB, 72% of the 256 KB resource budget. They play with
no phone and no network. There are three waiting variants because that is the
line most likely to be heard twice in a row, and hearing an identical recording
back to back reads as a stutter.

### On the watch

The display is 200×228. The portrait occupies 152 of those rows, which is why
answers live on a second screen rather than under the art.

Every pose is drawn from eight colours of the Pebble palette, so declaring the
images `smallestpalette` resolves them to a 4-bit indexed format — half the RAM
of 8-bit ARGB with no loss, because the art was authored to the palette in the
first place. Poses sit on identical canvases, so a build step diffs them and
emits only the differing region: a blink costs a 48×12 patch of 288 bytes pasted
over the portrait, rather than a second 9,120-byte image. Verified by pixel
count rather than by eye — a blink changes exactly 277 pixels, the corner mouth
exactly 34.

All twelve images together cost about 16 KB of flash against ~836 KB free, so
frame count was never the constraint. Simultaneous residency was: only one
screen's bitmaps are ever loaded, and measured free heap with the portrait up is
about 14.4 KB.

The phone does no intent classification, no speech synthesis and no
summarisation — it carries bytes. All of the interesting behaviour lives on the
server, where it can change without reinstalling anything on the watch.
