# Plugin Scaffold

Directory structure and plugin.json template for new Channel 47 plugins.

---

## Directory Structure

```
profession-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (required)
├── .mcp.json                # Bundled MCP servers (optional, API layer)
├── hooks/
│   ├── hooks.json           # Hook definitions
│   └── validate-mutations.py  # Safety gate for write operations
├── skills/
│   ├── skill-one/
│   │   ├── SKILL.md         # Skill instructions (use skill-template.md)
│   │   └── references/      # Templates, formulas, domain docs
│   └── skill-two/
│       ├── SKILL.md
│       ├── scripts/         # Tier 2 only: deterministic processing scripts
│       │   └── process.py   # stdlib only, no API calls
│       └── references/
├── tests/
├── README.md
└── LICENSE
```

---

## plugin.json

```json
{
  "name": "profession-name",
  "version": "1.0.0",
  "description": "One sentence. What does this plugin do for this profession?",
  "author": {
    "name": "Your Name",
    "url": "https://your-site.dev"
  },
  "homepage": "https://channel47.dev/plugins/profession-name",
  "repository": "https://github.com/channel47/plugins",
  "keywords": [
    "profession",
    "skill-area-1",
    "skill-area-2"
  ],
  "license": "MIT"
}
```

---

## .mcp.json (if bundling an MCP server)

```json
{
  "server-name": {
    "command": "npx",
    "args": ["-y", "@org/server-name@^1.0.0"],
    "env": {
      "API_KEY": "${API_KEY}"
    }
  }
}
```

---

## hooks/hooks.json (mutation safety gate)

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "mcp__server-name__mutate",
      "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/validate-mutations.py"
    }
  ]
}
```

---

## Tier Reference

| Tier | Components | When to Use |
|------|-----------|-------------|
| Tier 1 | SKILL.md + references/ + allowed-tools | Pure knowledge. No scripts. ~70-80% of skills. |
| Tier 2 | SKILL.md + scripts/ + references/ + allowed-tools + Bash(python3:*) | Complex deterministic logic. Scripts process data, never call APIs. |

---

## Resources

- [Channel 47 Ecosystem](https://github.com/channel47/plugins) — browse existing plugins
- [Contributing Guide](https://github.com/channel47/plugins/blob/main/CONTRIBUTING.md) — submit your plugin
- [skill-template.md](/skills/skill-template.md) — starter template for individual skills
