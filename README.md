# Frontend Workflow Scaffold

[![Code quality](https://github.com/obioraigboanusi/frontend-workflow-scaffold/actions/workflows/build-ci.yml/badge.svg)](https://github.com/obioraigboanusi/frontend-workflow-scaffold/actions/workflows/build-ci.yml)
[![Tests](https://github.com/obioraigboanusi/frontend-workflow-scaffold/actions/workflows/test-ci.yml/badge.svg)](https://github.com/obioraigboanusi/frontend-workflow-scaffold/actions/workflows/test-ci.yml)

A reference setup for a clean, modern frontend toolchain: React + TypeScript + Vite, with formatting, linting, strict type checks, and testing automated through git hooks and CI.

It is built for frontend developers who want to bootstrap (or retrofit) a project so quality is enforced by tooling, not by memory. A small user-management app (list users, add a user) is included as a realistic vehicle for the tooling, including data fetching, forms, and tests.

## Stack

- Vite + React 19 + TypeScript (`strict`)
- TanStack Query for server state
- react-hook-form + yup for forms
- MSW for API mocking in dev and tests
- Vitest + Testing Library for tests
- ESLint (type-aware) + Prettier for code quality
- Lefthook for git hooks, commitlint for commit messages
- GitHub Actions for CI

## Workflow

| Stage        | What runs                                       | Purpose                                     |
| ------------ | ----------------------------------------------- | ------------------------------------------- |
| `commit-msg` | commitlint (Conventional Commits)               | Keep history readable and machine-parseable |
| `pre-commit` | ESLint + Prettier on staged files only          | Fast, local feedback                        |
| `pre-push`   | format check, lint, typecheck, build, tests     | Catch what per-file checks miss             |
| CI (PRs)     | the same checks as `pre-push`, in two workflows | The real gate; hooks can be bypassed        |

Hooks are a fast local gate, not the only gate. Protect `main` and require both CI jobs to pass before merging (see [Branch protection](#branch-protection)).

## Getting started

```bash
nvm use          # Node 24, from .nvmrc
npm ci           # also installs the git hooks via the `prepare` script
cp .env.example .env
npm run dev
```

## Scripts

| Script                 | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Local dev server (MSW mocks the API)     |
| `npm run typecheck`    | Type-check only (`tsc -b`), no bundle    |
| `npm run build`        | Type-check, then production bundle       |
| `npm run lint`         | ESLint                                   |
| `npm run format`       | Format everything with Prettier          |
| `npm run format:check` | Verify formatting without writing        |
| `npm test`             | Vitest in watch mode                     |
| `npm run test:ci`      | Single Vitest run (used by hooks and CI) |

## Environment

Only variables prefixed with `VITE_` are exposed to client code. Copy `.env.example` to `.env`; `.env` files are git-ignored.

| Variable            | Purpose                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend base URL. Leave empty for same-origin requests (MSW mocks in dev). |

## Why these choices

- **Strict TypeScript**: `strict` catches null and implicit-`any` bugs at compile time. The cost is paid once, up front.
- **Type-aware ESLint (`recommendedTypeChecked`)**: catches bugs plain linting cannot, such as un-awaited promises. It slows linting slightly and needs a `tsconfig`, which is a fair trade for a production app.
- **MSW over ad-hoc fetch mocks**: mocks at the network layer, so components and hooks run exactly as they do in production, and the same handlers serve dev and tests.
- **TanStack Query**: server state (caching, retries, invalidation) is a different problem from UI state; it removes a lot of hand-written loading and error plumbing.
- **Lefthook, split across `commit-msg`, `pre-commit` and `pre-push`**: fast checks on every commit, heavier ones only before code leaves your machine. Jobs run in parallel and there are no shell scripts to maintain.
- **One error contract at the API boundary**: the API client always rejects with a plain message string, so hooks and components never guess the error shape.
- **CI mirrors `pre-push`**: hooks give speed; CI gives certainty.

## Adopting this in your own project

1. Copy: `.prettierrc`, `.prettierignore`, `eslint.config.js`, `lefthook.yml`, `commitlint.config.js`, `.nvmrc`, `.github/` (workflows and PR template), and the `strict` options in `tsconfig.app.json` / `tsconfig.node.json`.
2. Merge the `scripts` and the tooling `devDependencies` from `package.json` (ESLint, Prettier, Lefthook, commitlint, Vitest, Testing Library, MSW).
3. Add `.env` and `.env.*` (except `.env.example`) to `.gitignore`.
4. Run `npm ci`, then `npm run format && npm run lint && npm run typecheck` and fix what surfaces.
5. Enable [branch protection](#branch-protection).

## Branch protection

In GitHub, go to Settings → Branches → add a rule for `main`:

- Require a pull request before merging
- Require status checks to pass: `Quality checks` and `Run Tests`
- Require branches to be up to date before merging

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming, commit conventions, and the PR process.
