<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Color Rules (Hard Constraint)

- Never introduce blue hues or blue-tinted neutrals in any UI changes.
- Use only the existing project palette/tokens already defined in the codebase.
- If a new color is absolutely required, use purple/black variants matching the current theme.
- Do not add raw hex colors unless that exact color already exists in the project theme.
- Prefer CSS variables (for example `var(--accent)`, `var(--text2)`, `var(--bg2)`) over hardcoded colors.
- Any change that introduces blue colors is invalid and must be reverted.
