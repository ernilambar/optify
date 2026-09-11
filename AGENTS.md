# AGENTS.md

Vendor-neutral guidance for any AI coding agent working in this repository.

## Overview

Optify is a WordPress panel system library that renders React-based option panels anywhere in a
plugin and exposes REST endpoints for field configuration and option storage. Core stack: PHP 7.4+
(PSR-4, Composer) plus a React 18 frontend bundled with `@wordpress/scripts` (webpack) and PostCSS;
pnpm is the JavaScript package manager.

## Setup

Install both dependency sets before doing anything else:

```bash
composer install
pnpm install
```

Requirements: PHP >= 7.4 and Node.js with pnpm. No `.env` file or external services are needed for
local development.

## Commands

Run each from the repository root.

- Install (PHP): `composer install`
- Install (JS): `pnpm install`
- Build: `pnpm run build`
- Dev/watch: `pnpm run start`
- Test (PHP): none configured; the closest executable check is `composer lint`
- Test (JS): `pnpm run test:unit` / `pnpm run test:e2e` (wrappers only; need test files, no suite exists yet)
- Lint (PHP): `composer lint`
- Lint (JS): `pnpm run lint:js`
- Lint (CSS): `pnpm run lint:css`
- Lint (Markdown): `pnpm run lint:md:docs`
- Format (PHP): `composer format`
- Format (JS/CSS): `pnpm run format`
- Typecheck: not applicable (no TypeScript or `tsconfig.json` in this project)

## Conventions

- **PHP structure**: code lives in `src/` under the PSR-4 namespace `Nilambar\Optify\`; file names
  match their class names (e.g. `Panel_Manager.php`, `Abstract_Panel.php`).
- **WordPress standards**: follow WPCS — tabs for indentation, Yoda conditions, snake_case names,
  and short array syntax (`[]`, long arrays are disallowed).
- **Compatibility floor**: support PHP 7.4+ and WordPress 6.0+; do not introduce newer syntax or
  functions.
- **Internationalization**: all translatable strings use the `optify` text domain.
- **Generated assets**: `assets/` is webpack build output (excluded from PHPCS and Prettier, and
  never cleaned on build). Edit `resources/` and rebuild; never hand-edit `assets/`.
- **CSS**: PostCSS with nesting allowed only up to two levels.
- **Comments**: inline comments start with a capital letter and end with a period.

## Quality gate

Run this exact sequence before declaring any task complete. Every command must exit with code 0.

```bash
composer install
pnpm install
composer lint
pnpm run lint:js
pnpm run lint:css
pnpm run build
```

If a command fails, fix the underlying issue and re-run the full sequence until all commands pass.
