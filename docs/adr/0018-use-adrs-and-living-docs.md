# ADR-0018: Record decisions as ADRs and keep the documentation current

- **Status:** Accepted
- **Date:** 2026-11-21
- **Origin:** Recorded at decision time

## Context

Most of the setup lives in UI-managed state that is not in git, and the reasons behind choices were only in memory or in private notes. Months later it is unclear why something is the way it is, and an assistant working on the instance may "fix" things that are intended.

## Decision

Describe the setup in `docs/` and record each decision as an ADR in `docs/adr/`. Both are updated in the same change that alters the setup. Existing decisions were backfilled on 2026-11-21 in chronological order, which is why this ADR is the last of that batch and not number one.

## Alternatives considered

- Comments in YAML: cannot describe UI-managed state, and are scattered.
- A single notes file: no structure, no status, hard to see what is superseded.

## Consequences

- Every change costs a documentation update.
- The repository is public, so the docs follow the privacy rule in [docs/README.md](../README.md#privacy).
- ADRs are immutable once accepted: a changed decision gets a new ADR that supersedes the old one.
- Backfilled ADRs carry inferred rationale until the owner confirms or corrects them.
