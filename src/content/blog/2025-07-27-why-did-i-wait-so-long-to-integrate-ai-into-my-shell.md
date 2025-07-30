---
title: Why did I wait so long to Integrate AI into my Shell
description: In Which I Add ZSH Widgets to make CLI AI Easy
tags:
  - artificial-intelligence
  - personal-project
  - linux
  - zsh
  - shell-gpt
image: null
send_newsletter: 'true'
type: blog
last_edited: 2025-07-30T11:34:08.000Z
created: 2025-07-27T15:23:24.000Z
---
Somehow I never bothered to hook up an LLM to my shell until recently, and now I regret waiting so long. I explain how I'm using shell-gpt and ZSH widgets in this post.

I use LLMs frequently. A quick glance at my OpenAI dashboard shows about 30 threads over the past week, which doesn't include the disappearing threads I use to prevent some conversations from being added to history. This also doesn't include my programming with Claude Code or Cursor, or the various other programs I use which use API endpoints. This doesn't include my local Ollama model requests either.

Linux has been my daily driver for over a decade now, and I've gotten very comfortable with the terminal. Copying and pasting into and out of the terminal happens all the time, so when I started using LLMs for programming and they had a "Add to chat" feature which took terminal output and dropped it into the conversation, I found that extremely useful. No more selecting text, copying, switching to browser, pasting, and doing the same in reverse.

But there are three main limitations for this feature:

1. I'm not always using my IDE.
2. I don't always want to add the terminal output to the current conversation.
3. This only adds context from the terminal, it's not integrated into the shell.

Many times I'm using keyboard shortcuts to pop a terminal open just to do something quickly, and I don't want to open my IDE. Even if I am in my IDE, not all the things that happen in terminal are things I want to add to whatever conversation I was engaged in, and if I'm going to be starting new conversations then this isn't any faster than it would be popping over to a browser.

Also, whatever output I get will be in the IDE LLM output. This does usually make it easy enough to run, though it typically requires mouse interaction and often scrolling as well.

I found a much better way, and it's called [Shell‑GPT](https://github.com/TheR1D/shell_gpt):

# Shell-GPT

Shell-GPT is fairly straightforward. It's a python tool which describes itself as such:

>A command-line productivity tool powered by AI large language models (LLM). This command-line tool offers streamlined generation of **shell commands, code snippets, documentation**, eliminating the need for external resources (like Google search). Supports Linux, macOS, Windows and compatible with all major Shells like PowerShell, CMD, Bash, Zsh, etc.

You can use it in multiple ways. One is to make a query:
```
sgpt "What is the fibonacci sequence"
# -> The Fibonacci sequence is a series of numbers where each number ...
```

This is useful, but there's another way to use it which I love.

### **Ctrl + L** — “Write the command for me”

Press **Ctrl + L** after typing a natural‑language request (e.g. “find all JSON files below this folder”).  
Shell‑GPT’s built‑in shell integration replaces your current input line with a fully‑formed command.  
You can edit it if you like, then hit **Enter** to run.

This is very useful - I don't always remember the best ways to use common command line utilities, and this feature has been very good at finding the right commands so far. Because it's integrated into the shell, it just transforms the natural language request into the command - I only press the keyboard shortcut, and if I like what it recommends, I hit enter to run.

## What's missing

But I noticed an annoying limitation of Shell-GPT - you can't just run a keyboard shortcut to automatically send the last shell command and output together.

This is one of the things that I most need in terminal. I run a command and get an error. In the past, I would copy both output and command into a browser LLM. If it gave me a different command back, I would copy and paste that into the shell. This always annoyed me - all the text is just right there, why should I move it back and forth to get an answer?

So along with o3, I build a ZSH widget that let me do just that. 
### **Ctrl + O** — “Explain what just happened”

Press **Ctrl + O** immediately after any command finishes:

1. Every command’s `stdout` + `stderr` is automatically mirrored into `~/.last_cmd_out` by a pair of `preexec`/`precmd` hooks.  
2. The custom **`sgpt_last` widget**—bound to **Ctrl + O**—does three things:

   ```zsh
   tail -n 5000 ~/.last_cmd_out \      # grabs the last 5 000 lines of output
       | sgpt "What went wrong?"       # sends it to Shell‑GPT for analysis
   zle reset-prompt                    # refreshes your prompt afterwards
```

- **Step 1:** `tail` keeps the capture lightweight (adjust the line count as you like).
    
- **Step 2:** The prompt “What went wrong?” can be changed to anything—e.g. “Summarize this output” or “Generate a fix.”
    
- **Step 3:** `zle reset‑prompt` ensures your prompt is redrawn cleanly after the AI reply streams back.
    

The result appears inline in your terminal, giving you an instant diagnosis or explanation without re‑running the command.

---

## Behind the Scenes (hook snippet)

```zsh
export LAST_CMD_OUT="$HOME/.last_cmd_out"

capture_start() {
  : >| "$LAST_CMD_OUT"
  exec {__SAVE_OUT}>&1 {__SAVE_ERR}>&2
  exec > >(tee -a "$LAST_CMD_OUT") 2>&1
}

capture_end() {
  [[ -z ${__SAVE_OUT+x} ]] && return
  exec 1>&$__SAVE_OUT 2>&$__SAVE_ERR
  exec {__SAVE_OUT}>&- {__SAVE_ERR}>&-
  unset __SAVE_OUT __SAVE_ERR
}

autoload -Uz add-zsh-hook
add-zsh-hook preexec capture_start
add-zsh-hook precmd  capture_end
```

Add the snippet above and the `sgpt_last` widget binding to your `~/.zshrc`, reload the shell, and enjoy AI super‑powers right from the prompt.
