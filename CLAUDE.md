# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run seed      # Seed the database (uses tsx to run app/db/seed/seed.ts)
```

## Local Database Setup

Start Postgres and pgAdmin via Docker:
```bash
docker-compose -f "docs/3. Local Development/Databases/postgres-docker-compose.yml" up -d
```

The app connects to Postgres at `localhost:5432` with user `app`, password `password`, database `postgres` (hardcoded in `app/db/kysely.ts`).

## Architecture

**Endeavor** is a language-learning platform (like Duolingo for teachers). It is a Next.js 14 App Router application targeting three sub-domains: `admin.endeavor.com`, `teach.endeavor.com`, `study.endeavor.com`. Currently only the teacher module is being built.

### Key Layers

- **`app/db/kysely.ts`** — Single source of truth for the database schema. All table interfaces (`EndeavorDB`) and the shared `kysely` client are defined here. Uses [Kysely](https://kysely.dev/) as a type-safe query builder over `pg`.
- **`app/actions.ts`** — All Next.js Server Actions for mutations (add/delete/edit subdeck, card, word). Each action calls `revalidatePath` to invalidate cache.
- **`app/teacher/`** — Teacher-facing pages. Server Components fetch data directly via Kysely and pass typed row arrays to Client Components.
- **`components/ui/`** — shadcn/ui primitives (Button, Card, Dialog, etc.).
- **`app/components/`** — Shared app-level components (e.g., `Menu.tsx` sidebar nav).

### Domain Model

```
Course (level + title, status: DRAFT→IN_REVIEW→APPROVED→PUBLISHED→ARCHIVED)
  └── Lesson (subdecks) — composite PK: (course_id, order)
        └── Card — composite PK: (course_id, lesson_order, order)
              └── CardWord — links Card to Word via (course_id, lesson_order, card_order, word_text, word_definition)
Word — identified by composite (text, definition), NOT an auto-increment id
```

Composite keys (using order integers) are used throughout instead of surrogate keys. When querying with tuple comparisons, Kysely uses the `sql` template tag: `sql\`(course_id, "order") = (${course_id}, ${order})\``.

### Teacher Deck Browser (`app/teacher/decks/[id]/Browser/`)

The main teacher UI. A deck corresponds to a course; subdecks correspond to lessons. The `Browser` component uses a two-panel grid layout (subdeck list | card list). State resets on subdeck selection via React `key` prop (see comment in `Browser.tsx`).

Data flows as flat `DeckRow[]` from the server (a big JOIN across course/lesson/card/word) and is grouped client-side with `lodash.groupBy`.
