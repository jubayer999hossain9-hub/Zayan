# Zayan House — Project Package

Two folders, two different jobs:

## `frontend-prototypes/`
The approved premium visual design — 4 self-contained HTML files (homepage,
product listing, product details, admin panel/SMC). Open any of them
directly in a browser. No install needed. This is what you've been
reviewing and approving so far.

## `backend/`
A **real, tested** Next.js + PostgreSQL backend — genuinely running database,
genuine login, genuine SMC setting that actually controls the storefront.
See `backend/README.md` for exact run instructions and, importantly, an
honest list of what's proven to work vs. what still needs to be built.

## How these two fit together

Right now they are **not wired to each other** — the pretty HTML prototypes
use sample data baked into their JavaScript; the backend has its own bare
(intentionally unstyled) pages just to prove the database/API/auth chain
really works. The next real step is combining them: take the approved HTML
prototype's markup/CSS and turn it into the backend's page templates, so the
premium design renders the real database data. That's a natural task to hand
to **Claude Code** for a proper multi-file build-and-test session, since it's
a lot of file-by-file work rather than a single response.
