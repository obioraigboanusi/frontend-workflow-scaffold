# Contributing

Thanks for using and improving this scaffold. This guide covers how to set up locally, the checks your changes must pass, and how we branch, commit, and open PRs.

## Prerequisites

- Node.js 24.x (matches CI; `.nvmrc` is provided, so `nvm use` works)
- npm (a `package-lock.json` is committed; use `npm ci` for clean installs)

## Getting started

```bash
git clone https://github.com/obioraigboanusi/frontend-workflow-scaffold.git
cd frontend-workflow-scaffold
nvm use          # Node 24, from .nvmrc
npm ci
cp .env.example .env
npm run dev
```

`npm ci` runs the `prepare` script, which installs the Lefthook git hooks automatically. If hooks are missing, run `npx lefthook install`.

## Scripts

| Script                 | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite dev server                |
| `npm run typecheck`    | Type-check only (`tsc -b`), no bundle    |
| `npm run build`        | Type-check, then production bundle       |
| `npm run lint`         | Run ESLint                               |
| `npm run format`       | Format all files with Prettier           |
| `npm run format:check` | Verify formatting without writing        |
| `npm test`             | Vitest in watch mode                     |
| `npm run test:ci`      | Single Vitest run (used by hooks and CI) |

## Git hooks (Lefthook)

- **commit-msg**: commitlint rejects messages that do not follow Conventional Commits.
- **pre-commit**: ESLint and Prettier check on staged files only. Fast, local feedback.
- **pre-push**: format check, lint, typecheck, build, and the full test suite.

Hooks are a fast local gate, not the only gate. CI runs the same checks on every pull request, so do not bypass hooks with `--no-verify`. If a hook fails, fix the cause.

## Branching

Branch from `main` and keep each branch focused on one concern. Use a type prefix:

| Prefix      | Use for                          |
| ----------- | -------------------------------- |
| `feat/`     | New functionality                |
| `fix/`      | Bug fixes                        |
| `chore/`    | Tooling, config, dependencies    |
| `docs/`     | Documentation only               |
| `test/`     | Tests only                       |
| `refactor/` | Behavior-preserving code changes |

Use lowercase, hyphen-separated names, e.g. `feat/user-delete-action`, `fix/typecheck-script`.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by a `commit-msg` hook (commitlint):

```
<type>: <short imperative summary>
```

Examples:

```
feat: add user delete action with confirmation
fix: surface submit errors in AddUserForm
chore: enable strict mode in tsconfig
docs: rewrite README for the workflow scaffold
```

Keep the summary under about 72 characters, write in the imperative mood, and avoid duplicate or vague messages like "update stuff".

## Pull requests

1. Rebase or merge the latest `main` into your branch.
2. Make sure everything passes locally:
   ```bash
   npm run format:check && npm run lint && npm run typecheck && npm run build && npm run test:ci
   ```
3. Open a PR against `main`; the PR template will guide the description and checklist.
4. Add screenshots or a short recording for any UI change.
5. Keep PRs small. If a change touches unrelated concerns, split it.

CI must be green before merge. Both workflows (quality checks and tests) run on every PR.

## Code standards

- **TypeScript**: strict mode is on. Avoid `any`; prefer precise types and `import type` for type-only imports.
- **Formatting**: Prettier is the source of truth (single quotes, semicolons, trailing commas, 100 columns). Do not hand-format; run `npm run format`.
- **Linting**: type-aware ESLint (`recommendedTypeChecked`) plus the React Hooks rules. Fix findings instead of disabling rules. If you must disable one, scope it to a single line and add a `-- reason`.
- **Promises**: await them, return them, or mark intentional fire-and-forget with `void`.
- **Environment variables**: only `VITE_`-prefixed variables reach client code. Add new ones to `.env.example` and `src/vite-env.d.ts`.
- **API errors**: the API client rejects with a plain message string. Do not assume an `Error` instance; see `src/api/client.ts`.
- **Forms**: react-hook-form with a yup schema; show field errors inline and submission errors to the user, never only in the console.
- **Server state**: use TanStack Query hooks in `src/hooks`; keep raw API calls in `src/api`.

## Testing

- Co-locate tests in a `__test__` folder next to the code they cover.
- Use Testing Library and query by role or label, the way a user would find elements. Avoid testing implementation details.
- Mock the network with MSW handlers in `src/mocks`, not by stubbing `fetch` or `axios` directly. Build URLs with `apiUrl()` from `src/mocks/handlers.ts` so tests work regardless of `VITE_API_BASE_URL`.
- Every new component or hook should cover its loading, error, empty, and success states where relevant.
- When testing intermediate UI states (for example a submitting button), do not `await` the click that triggers the async work; assert the transient state, then await the final outcome.

## Project structure

```
src/
  api/          API client and request functions
  components/   UI components, with __test__ folders beside them
  hooks/        Data hooks (TanStack Query)
  lib/          Shared setup such as the query client
  mocks/        MSW handlers and fixtures
  pages/        Route-level pages
  test/         Shared test utilities
  types/        Shared TypeScript types
  vite-env.d.ts Typed `import.meta.env` variables
```

## Questions or proposals

Open an issue before starting large changes so we can agree on the approach first.
