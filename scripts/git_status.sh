#!/bin/bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"
# Git status sensor for Home Assistant
# Outputs JSON with repo state, pull recommendation, and intervention flag

main() {
  REPO_DIR="/homeassistant"
  cd "$REPO_DIR" || { echo '{"error":"repo not found"}'; exit 1; }

  # Fetch latest remote state (quiet, no output)
  git fetch origin --quiet 2>/dev/null

  LOCAL=$(git rev-parse HEAD 2>/dev/null)
  REMOTE=$(git rev-parse @{u} 2>/dev/null)
  BASE=$(git merge-base HEAD @{u} 2>/dev/null)

  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo 0)
  BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null || echo 0)

  # Last commit info
  COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null)
  COMMIT_MSG=$(git log -1 --pretty=format:'%s' 2>/dev/null)
  COMMIT_DATE=$(git log -1 --pretty=format:'%aI' 2>/dev/null)

  # Stash count
  STASH_COUNT=$(git stash list 2>/dev/null | wc -l | tr -d ' ')

  # Check for uncommitted changes
  DIRTY=$(git status --porcelain 2>/dev/null)
  HAS_CHANGES=$( [ -n "$DIRTY" ] && echo true || echo false )
  UNTRACKED=$(echo "$DIRTY" | grep -c '^??' | tr -d ' ')

  # Check for merge conflicts
  CONFLICTS=$(git diff --name-only --diff-filter=U 2>/dev/null)
  HAS_CONFLICTS=$( [ -n "$CONFLICTS" ] && echo true || echo false )

  # Determine state
  if [ "$HAS_CONFLICTS" = "true" ]; then
      STATE="conflict"
  elif [ "$LOCAL" = "$REMOTE" ]; then
      STATE="up_to_date"
  elif [ "$LOCAL" = "$BASE" ]; then
      STATE="behind"
  elif [ "$REMOTE" = "$BASE" ]; then
      STATE="ahead"
  else
      STATE="diverged"
  fi

  # Should pull: behind or diverged, no local changes, no conflicts
  SHOULD_PULL=false
  if [ "$STATE" = "behind" ] && [ "$HAS_CHANGES" = "false" ]; then
      SHOULD_PULL=true
  fi

  # Manual intervention: conflicts, diverged, or behind with uncommitted changes
  MANUAL=false
  if [ "$HAS_CONFLICTS" = "true" ] || [ "$STATE" = "diverged" ]; then
      MANUAL=true
  elif [ "$STATE" = "behind" ] && [ "$HAS_CHANGES" = "true" ]; then
      MANUAL=true
  fi

  cat <<EOF
  {
    "state": "${STATE}",
    "branch": "${BRANCH}",
    "ahead": ${AHEAD},
    "behind": ${BEHIND},
    "commit_hash": "${COMMIT_HASH}",
    "commit_message": "${COMMIT_MSG}",
    "commit_date": "${COMMIT_DATE}",
    "stash_count": ${STASH_COUNT},
    "has_changes": ${HAS_CHANGES},
    "untracked_files": ${UNTRACKED},
    "has_conflicts": ${HAS_CONFLICTS},
    "should_pull": ${SHOULD_PULL},
    "manual_intervention": ${MANUAL}
  }
  EOF
}

main || echo '{"state":"error","error":"script failed"}'