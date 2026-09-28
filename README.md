# FE Dev Workflow Scaffold

A reference setup for a clean, modern frontend toolchain: React + TypeScript + Vite,
with automated formatting, linting, strict type checks, and testing wired into git
hooks and CI.

## Stack

- Vite + React 19 + TypeScript (strict)
- TanStack Query for server state
- react-hook-form + yup for forms
- MSW for API mocking in dev/tests
- Vitest + Testing Library for tests
- ESLint + Prettier for code quality
- Lefthook for git hooks

## Workflow

- `pre-commit`: lints and formats staged files only (fast, local)
- `pre-push`: full typecheck, lint, build, and test suite (heavier, catches
  what per-file checks miss)
- CI mirrors pre-push on every PR, so hooks are a fast local gate, not the
  only gate

## Getting started

npm install
npm run dev

## Scripts

| Script             | Purpose                          |
| ------------------ | -------------------------------- |
| `dev`              | local dev server                 |
| `typecheck`        | type-check only, no build output |
| `build`            | typecheck + production bundle    |
| `lint` / `format`  | check code quality               |
| `test` / `test:ci` | run test suite                   |

## Why these choices

- **MSW over manual fetch mocks**: mocks at the network layer, so components
  and hooks are tested exactly as they run in production.
- **Lefthook split (pre-commit vs pre-push)**: keeps commits fast while still
  guaranteeing nothing broken reaches a shared branch.
