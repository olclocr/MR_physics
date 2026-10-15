---
name: local-change-audit
description: Use when the user asks to audit current changes, review today's diff, check uncommitted or unpushed work, prepare a staging plan, or decide whether local changes are safe to commit or push.
metadata:
  short-description: Audit local diffs and push readiness
---

# Local Change Audit

Use this for repeated "audit", "review today's diff", "uncommitted changes", and "is this safe to push?" requests.

## Workflow

1. Inspect repo state first:
   - `git status --short --branch`
   - `git diff --stat`
   - `git diff`
   - `git diff --cached`
   - `git log --oneline --decorate -5`
2. Classify changes:
   - intentional feature/fix
   - generated or build output
   - missing companion files
   - risky config/project-file changes
   - unrelated user changes to leave alone
3. Review like a code reviewer:
   - lead with bugs, regressions, missing files, missing tests, or clean-checkout risk
   - cite exact files and lines when possible
   - keep summary secondary
4. If the user wants to proceed, produce a staging plan:
   - group files by commit purpose
   - call out files to exclude
   - recommend a concise commit message
5. Verify enough for the risk:
   - run the smallest relevant build/test/lint command available locally
   - if verification is blocked, state the blocker and what remains unverified

## Local Preferences

- Be extra suspicious of project or solution files that reference untracked files.
- Do not overwrite or revert unrelated changes.
- For Windows repos, check for designer/generated-file pairs when forms, `.resx`, `.csproj`, or layout files change.

