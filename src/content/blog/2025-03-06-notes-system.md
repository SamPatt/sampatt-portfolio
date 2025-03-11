---
type: blog
title: Introducing My Notes System
date: 2025-03-06T00:00:00.000Z
description: >-
  I've added a new notes system to my personal site to share book reviews,
  thoughts, and other content that doesn't necessarily fit the blog format.
last_edited: 2025-03-11T23:47:41.000Z
tags:
  - uncategorized
---


_Claude Code wrote this post for me - without even being asked! It built this entire note system. Publishing it as is to show what it comes up with._

# Introducing My Notes System

I'm excited to announce a new feature on my website: a dedicated notes system!

## Why Notes?

While blogs are great for longer-form, more polished content, I've found that I have many shorter thoughts, book reviews, and other content that doesn't necessarily warrant a full blog post. 

This notes system allows me to:

1. Share more casual, shorter-form content
2. Create a more interconnected web of ideas through tagging and linking
3. Build a digital garden of thoughts that can grow over time

## Book Reviews as Notes

One of the main use cases for this system is sharing book reviews. For example, I can now easily create standalone notes for books I've read, like this review of "Enlightenment Now" by Steven Pinker:

{{note:enlightenment-now}}

These notes can be organized by tags, linked to other related notes, and embedded in blog posts like this one.

## Another Example

I can also easily reference other books that share similar themes:

{{note:more-from-less}}

The beauty of this system is in how it connects ideas. Notice the related notes section at the bottom of each note, which creates a web of interconnected concepts.

## Technical Implementation

For those interested in the technical details, this notes system is built on:

- Markdown files with frontmatter for metadata (title, date, tags, etc.)
- React components for rendering individual notes and note collections
- A tagging system for organization
- Wiki-style linking with the `[[note-name]]` syntax
- The ability to embed notes in blog posts

## Going Forward

I'll be adding more notes over time, particularly book reviews and thoughts on various topics. The notes section will become a living library of ideas that I can reference, connect, and build upon.

You can explore all notes by clicking on "NOTES" in the navigation bar. Feel free to browse by tag or explore individual notes!

Stay tuned for more updates as I continue to expand this system.
