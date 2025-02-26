---
title: Claude Code Redesigned my Website in 3 Mins for $0.61
date: 2025-02-26
description: In Which I Recognize How Inferior I am at Design
send_newsletter: "true"
---
I've never been a designer. When I began seriously pursuing a career as a developer a few years ago, I decided to build a portfolio site from scratch, just to prove I could do it.

It was no visual masterpiece, but it showcased my projects and contact info. More recently I've begun blogging, especially about testing AI tools and writing about my projects.

I tested out Claude Code - which uses the new Sonnet 3.7 model - when it released two days ago, and it didn't blow me away, but I wanted to give it another chance.

I've been wanting to do a makeover of my site for a while now, so I asked Claude to do it instead. Here's my prompt:

>This is the codebase for my personal portfolio. I'm curious
about your design aesthetics and choices, so I'd like to give
you complete freedom to redesign the site as you'd like. You
can make it as drab or colorful as you want, as simple or
complex, the only requests I have are 1) it must look
visually appealing, 2) it must look professional, and 3) you
must briefly explain why you made your choices.

Claude took nearly two minutes to go through the files in my repo, and then another minute or so to modify the CSS. I accepted all the changes, then looked over my new site.

Below are screenshots of my design, followed by Claude's design.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-09.png)

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-29.png)


![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-08.png)



![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-28.png)


![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-10.png)

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-30.png)


![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-11.png)

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-26-claude-code-design/image/2025-02-26-16-31.png)

One aspect that you can't see in these images is how many small effects it added. I tend to dislike animations on sites, so I previously used very few. However, the indicators, animation, and hover effects that it chose were nearly all positive additions. I'm still undecided about one of them - a sort of loading bar when you hover on a card - but overall it did great.

I have a fair number of @media CSS entries in order to ensure it works on mobile, and it altered those without causing any issues (that I noticed).

I'm quite pleased, given this took 3m34s and cost me $0.61 total. I've accepted the changes and pushed them - I might make more changes in the future, but the first one-shot from Claude I tried was good enough to use.

Here are the model's full thoughts:

> I've completely redesigned your portfolio with a modern and
> professional aesthetic. Here's an explanation of my design
> choices:
> 1. Color Scheme:
>   - Used a deep blue-based color palette with bright accents
> (blue, teal, and gold)
>   - Created a dark theme that's easy on the eyes but still
> vibrant and engaging
>   - The color scheme suggests professionalism while maintaining
> visual interest
> 1. Typography:
>   - Introduced Outfit for the main text - a clean, modern
> sans-serif that's highly readable
>   - Added IBM Plex Mono for code and navigation elements to
> highlight your technical focus
>   - Improved heading hierarchy with distinctive styles and subtle
> color changes
> 1. Visual Hierarchy:
>   - Implemented gradient text for headings to create visual
> interest
>   - Added subtle background patterns and effects for depth
> without distraction
>   - Created a consistent card-based layout system with thoughtful
> hover animations
> 1. Interactive Elements:
>   - Added animated hover states throughout the site to improve
> interactivity
>   - Created a stylish contact button with clear feedback
>   - Enhanced navigation with subtle indicators and animations
> 1. Structural Improvements:
>   - Maintained the vertical sidebar for larger screens but
> improved its visual treatment
>   - Added subtle glow effects and gradients to create depth
>   - Ensured all containers have consistent padding, margin, and
> border styles
> 1. Accessibility & Performance:
>   - Ensured sufficient contrast for readability
>   - Used CSS variables for maintainability
>   - Kept animations subtle and purposeful
> The redesign maintains your existing information architecture
> while providing a more polished visual presentation that reflects
> your professional focus on cutting-edge technologies.