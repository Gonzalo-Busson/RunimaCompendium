# /log — Log a change or decision

Log the current session's significant changes and decisions to the project memory.

## Instructions

Ask the user (or infer from context) the following, then append a new entry to the changelog and/or decisions files:

1. **What** changed or was decided
2. **How** it was implemented or resolved
3. **Why** — the motivation or problem it solved
4. **Lessons learned** — anything non-obvious that future sessions should know

### Changelog entry

Append to `/Users/gonbu/.claude/projects/-Users-gonbu-Documents-GitHub-RunimaCompendium/memory/changelog.md`:

```
## YYYY-MM-DD — <short title>

**What:** ...
**How:** ...
**Why:** ...
**Lessons:** ...
```

### If it's an architectural decision

Also append to `/Users/gonbu/.claude/projects/-Users-gonbu-Documents-GitHub-RunimaCompendium/memory/decisions.md` using the ADR format:

```
## ADR-XXX — <title>

**Decision:** ...
**Why:** ...
**Consequences:** ...
```

### If it's a recurring pattern or pitfall

Also append to `/Users/gonbu/.claude/projects/-Users-gonbu-Documents-GitHub-RunimaCompendium/memory/lessons.md`.

After writing, confirm what was logged and where.
