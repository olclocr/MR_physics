---
name: safe-github-sync
description: Use when the user asks to pull from GitHub, push local work, sync with remote, publish changes, recover from git pull/push blockers, or compare local state against origin.
metadata:
  short-description: Pull, push, and sync safely
---

# Safe GitHub Sync

Use this for repeated "github pull", "github push", "sync local and GitHub", and pre-publish requests.

## Workflow

1. Check state before network work:
   - `git status --short --branch`
   - `git remote -v`
   - `git branch --show-current`
   - `git log --oneline --decorate -5`
2. Protect local work:
   - identify uncommitted and untracked files
   - do not stash, reset, checkout, or delete unless the user explicitly asked
   - if pulling could conflict, explain the risk before changing anything
3. Pull/sync:
   - prefer `git fetch --prune` before comparing
   - compare with `git status --short --branch` and `git log --oneline --left-right HEAD...@{u}`
   - run `git pull --ff-only` when a clean fast-forward is appropriate
4. Push/publish:
   - audit staged files before commit
   - commit with a focused message
   - push the current branch
   - report branch, commit hash, and verification

## Known Local Git Quirks

- This environment has previously exposed proxy variables pointing Git at `http://127.0.0.1:9`.
- If GitHub network access fails, inspect proxy env vars before assuming credentials are wrong.
- This repo has also hit `.git/FETCH_HEAD` and remote ref `.lock` permission failures. When that happens, report the exact locked path and avoid forcing or deleting lock files without explicit user approval.

