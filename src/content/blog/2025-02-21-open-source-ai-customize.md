---
type: blog
title: >-
  No Ideology Required; AI Customization Makes Open Source Tools the Obvious
  Choice
date: 2025-02-21T00:00:00.000Z
description: In Which I Describe how Cracked LLMs are for Customization
send_newsletter: false
last_edited: 2025-03-11T23:58:51.000Z
tags:
  - uncategorized
---

# Background

AI will dramatically increase the popularity of open source systems, and this has absolutely nothing to do with ideology.

I hear you. Open source quality varies widely. You've tried them out. Maybe it's because you're cheap, and they're free. Or maybe you're ideologically committed to open source software.

But frequently, they just don't work as well as the polished, proprietary tools. They often require a bit more technical knowledge. Sticking with open source often means you're some combination of broke, ideological, and / or technical.

That used to be more true than it is today, but we're still very far away from open source becoming the default.

How does AI change this?

# Why AI means open source wins

Part of the reason we use computers is because they're fun. OK, _I_ think they're fun anyway - having nearly complete control over some type of mental kingdom is appealing to me.

But we mostly use computers because they can do things for us. Things that humans are unable to do, or would at least take much longer.

A software developer's job is to understand the particular action that they and their users are trying to get the computer to do, and then tell both the computer and the human how to accomplish it. Their instructions turn the computer into a vehicle designed to traverse a specific terrain, and the interface is a map and owner's manual for the human driver.

The computer already had the ability to perform the task. Given sufficient understanding, the human could have created a similar vehicle, created a different map and manual, and still gotten to their destination. But this is ridiculously hard to do; our minds don't work like computers and it requires slow and deliberate thinking to achieve this.

What if there existed a mind that did deeply understand how computers work? Instead of needing to create a vehicle, map and manual for humans to use, it could be told what humans wanted accomplished, and just do it.

This is likely the long term future of software. Humans need many layers of abstractions to be able to interact with and command computers. AI won't need that. All human requests could generate a custom program that will solve the problem without relying on any existing system.

But wait, that sounds very inefficient, doesn't it? Surely these models would all respond similarly given similar goals, and if that's true, and we had AI systems re-inventing the wheel with each request, what a waste!

That's where open source systems come in. The best patterns and tools will rise to the surface, and the models will learn which of them to use, and they'll pick and choose which they want in order to accomplish their tasks. The building blocks of nearly all software - which will itself be customized to the specific user's needs - will be open source.

# The Transition

But what does this transition look like? I'm talking about a future era where humans rarely, if ever, look at code anymore. That's a long way away. Not because the technology is far distant, but because human adoption of technology is often uneven.

In the meantime, AI will still boost open source adoption, because this customization is already happening, just in a somewhat more manual form.

The SOTA LLMs understand Linux *phenomenally* well. They are absolutely cracked on the command line.

They understand markdown, bash scripts, yaml, JSON, and regex to such a degree that I hardly ever see them make an error.

They understand API docs, and documentation generally.

They understand Git.

They understand databases.

They understand networking.

They understand containerization, web servers, build systems, monitoring, CI/CD, testing, authentication...

The dominant tools here are all open source. The LLMs have seen their docs, they've seen the troubleshooting forum threads, and they know how these tools work together.

Agents don't yet exist that will use these tools for us. But before the agency issue is figured out, they do still have the knowledge available for us to tap into.

# Examples

Let me show you what I mean with some real examples from my own experience:

## System Recovery and Data Analysis

I recently needed to [recover data](https://sampatt.com/blog/2025-02-17-table-tennis-hard-drive) from a borked Linux installation. The LLM understood exactly what steps to take:

- Mount the drive and check filesystem integrity with fsck
- Use a lighter distro (Ubuntu 22.04) when the newer version was too resource-intensive
- Properly handle partition management and data migration
- Set up auto-mounting and symbolic links to maintain access to unmoved data

The LLM didn't just know the commands - it understood the entire workflow of Linux system recovery. It knew when to use different approaches based on the hardware constraints and data preservation needs.

## Newsletter Management

When Substack proved too limiting without an API, the LLM [helped me](https://sampatt.com/blog/2025-02-18-Listmonk):

- Set up Listmonk, an open source newsletter management system
- Configure Amazon SES for email delivery
- Create GitHub Actions workflows to automate newsletter sends
- Handle DNS configuration for the email subdomain
- Set up proper authentication and API access

The whole system works together seamlessly - and critically, it integrates into my existing markdown-based writing workflow rather than forcing me into a proprietary platform's constraints.

## Analytics Implementation

When [avoiding Google Analytics](https://sampatt.com/blog/2025-02-19-Umami), the LLM understood how to:

- Configure Umami as a privacy-focused alternative
- Set up proper script embedding
- Handle real-time tracking implementation
- Manage user authentication and access control
- Deploy it through container management systems

## Screenshot Management and Hosting

I needed a way to easily capture and host screenshots for my blog posts. The LLM understood how to:

- Use flameshot for screenshot capture
- Set up inotifywait to monitor directories for new screenshots
- Configure jsDelivr as a CDN for hosting through GitHub
- Create bash scripts for automated processing and upload
- Set up zenity for GUI prompts
- Handle keyboard shortcut bindings in Linux

The resulting system is completely automated: When I take a screenshot with my custom shortcut, it:

1. Saves to a monitored directory
2. Triggers a notification
3. Prompts if I want to publish it
4. Automatically uploads to GitHub
5. Generates a jsDelivr CDN link
6. Copies the markdown-formatted link to my clipboard

This is something no proprietary service offers, but because the LLM understands how these open source components work together, it could help create a custom solution that fits perfectly into my workflow.

## Web Development Workflow

My developer workflow relies heavily on open source tools, which the LLM understands deeply:

- Git version control
- Markdown processing and static site generation
- RSS feed generation and management
- CI/CD pipelines through GitHub Actions

The key point here isn't just that these tools exist - it's that the LLM understands how they work together. When I needed to integrate a newsletter system with my static site, it knew exactly how to wire up the GitHub Actions to trigger Listmonk through its API when new content was published.

This deep understanding of open source systems means that rather than being constrained by the features and limitations of proprietary platforms, I can customize and extend my tools exactly as needed. The LLM doesn't just know about individual tools - it understands the entire ecosystem and how to make the pieces work together.

This level of customization is intoxicating. Since it's still early days, this will only likely be true for more technical folks, or control freaks, but as it progresses I believe it'll widen the base of people using open source tools, simply because they're the tools the LLMs understand best.

The future is open source - not because people believe it's more noble, or important for our autonomy, but because it's what AIs have (correctly) decided is the best way to get stuff done.
