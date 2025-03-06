# Obsidian to Website Notes Sync

This system allows you to selectively publish notes from your Obsidian vault to your website. The notes in your Obsidian vault remain the "source of truth," and you can control which notes are published.

## How It Works

1. In your Obsidian vault, add the `publish: true` frontmatter property to any notes you want to publish:

```yaml
---
title: "Your Note Title"
date: "2025-03-06"
tags: ["tag1", "tag2"]
rating: 5
publish: true  # <-- Add this to mark for publishing
last_edited: 2025-03-06 14:21:52  # <-- Added by your Obsidian plugin
---

# Your Note Content
```

2. Run the sync script to copy these notes to your website:

```bash
npm run sync-notes /path/to/your/obsidian/vault
```

## Required Frontmatter

Notes must include the following frontmatter:

- `title`: The title of the note
- `publish: true`: Flag to indicate this note should be published

The following frontmatter is recommended but will be added automatically if missing:

- `date`: Date in YYYY-MM-DD format (defaults to today's date)
- `tags`: Array of tag strings (defaults to ["uncategorized"])
- `rating`: A number 0-5 (defaults to 0)
- `last_edited`: Timestamp added by your Obsidian plugin, used to determine if a note has changed

## Workflow

1. Write and edit your notes normally in Obsidian
2. Add `publish: true` to notes you want to appear on your website
3. Run the sync script before building/deploying your website
4. The script will:
   - Copy only notes marked with `publish: true`
   - Only update notes that have changed (using `last_edited` timestamp)
   - Remove notes from the website that are no longer published
   - Skip unchanged notes to improve performance with large collections

## Obsidian-specific Syntax

The sync script preserves the content as is. Your website's markdown processor should handle most Obsidian syntax, but:

- Obsidian links like `[[note]]` will be preserved as-is
- Your site already has components to handle wiki-style links for note references

## Workflow with Netlify

Since this site is hosted on Netlify, and the sync script requires access to your local Obsidian vault (which Netlify doesn't have), follow this workflow:

1. **Local Development Workflow**:
   ```bash
   # Sync notes from your Obsidian vault
   npm run sync-notes /path/to/your/obsidian/vault
   
   # Start local development server (if needed)
   npm run dev
   ```

2. **Local Build and Deploy Workflow**:
   ```bash
   # Sync notes and then commit the changes
   npm run sync-notes /path/to/your/obsidian/vault
   git add .
   git commit -m "Update published notes"
   git push
   ```

3. **Netlify Build**:
   Netlify will use the standard `npm run build` command which doesn't include the sync step, since your notes have already been copied to the repository in the previous step.