# Solflow Notes

Solflow is a Solana focused trading and developer workspace.  
It combines note taking, trade journaling, code snippets, and decision logs in one interface.

## What this project includes

- Structured notes and drafts
- Trade journal style workflows
- Toolbar based writing actions (including inline B, I, U formatting in drafts)
- Notepad workspace routes for quick capture and review
- Solana oriented product direction (wallet context and on chain proof UX direction)

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main routes

- `/home` - Home workspace
- `/dashboard` - Dashboard style editor workspace
- `/notes` - Notepad workspace
- `/notes/[id]` - Direct note route

## Notes

- This repo is prepared for hackathon iteration speed.
- UI and flows are actively evolving.
