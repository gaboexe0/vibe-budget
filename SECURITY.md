# Vibe Budget - Security Contract

## Overview
This document defines the security requirements and restrictions for the Vibe Budget CLI tool regarding file scanning and sensitive data handling.

## File Exclusion Requirements

### MUST EXCLUDE - Pattern List
The CLI MUST exclude the following files and patterns from ALL operations (scan, plan, estimate):

```
.env
.env.*
.gitignore
.env.local
.env.development
.env.production
*.pem
*.key
*.crt
*.cer
*.p12
*.pfx
*.log
credentials.json
secrets.json
config/secrets.*
private.*
.id_rsa
*.github_token
*.npmrc
.dockerconfig
```

### MUST EXCLUDE - Directory List
```
.git/
node_modules/
dist/
build/
coverage/
.venv/
venv/
__pycache__/
.DS_Store/
Thumbs.db
```

### MUST EXCLUDE - File Extensions
```
.sql (may contain data)
.db (local databases)
.sqlite
.mdb
.accdb
```

## Scanning Behavior Rules

### 1. Scan Command
- MUST respect .gitignore rules
- MUST NOT read file contents of excluded patterns
- MUST NOT traverse into excluded directories
- MUST skip files matching exclusion patterns silently

### 2. Token Estimation
- MUST only analyze file structure, NOT content
- MUST NOT attempt to read any file content
- MUST use file extension and line count for estimation

### 3. Cost Calculation
- MUST NOT require access to project files
- MUST use predefined token contracts
- MUST be safe to run on any project without data exposure

## Security Principles

1. **Zero File Content Access** - The CLI should never read the contents of user files for cost estimation
2. **Read-Only Metadata** - Only file names, extensions, and counts may be used
3. **No Credential Exposure** - API keys, tokens, and secrets must never be accessed or logged
4. **Safe Defaults** - Err on the side of exclusion when uncertain

## Implementation Requirements

All scanning functions MUST:
- Accept an exclusion list parameter
- Check each path against exclusion patterns before processing
- Use case-insensitive matching for file extensions
- Support user-defined exclusion patterns via CLI flags

## Compliance

Violations of this security contract must be treated as critical bugs and fixed immediately.

---

**Version:** 1.0  
**Date:** 2026-02-15  
**Status:** Active
