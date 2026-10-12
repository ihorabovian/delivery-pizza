---
name: git-naming
description: Name git commits as Conventional Commits and PRs using the [type]/[scope]/[short description] template. Use whenever creating a git commit or a pull request title, including plain requests like "commit this", "commit these changes", "open a PR" — do not wait for the user to mention naming conventions first. Also use when the user asks about commit/PR naming conventions directly.
---

# Git Commit and PR Naming

## Commit messages

Follow [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type**: `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`
- **scope**: the affected area/module, in parentheses, lowercase, when it clarifies the change (e.g. `feat(editing): add undo action`). Omit when there's no clear single scope.
- **description**: imperative mood, lowercase start, no trailing period (e.g. `add undo action`, not `Added undo action.`)
- Breaking changes: append `!` after type/scope (`feat(api)!: ...`) and/or add a `BREAKING CHANGE:` footer.
- Body and footers are optional; use them for context a one-liner can't carry (motivation, migration notes, `Fixes #123`).

Examples:
- `feat(editing): add undo action`
- `fix(auth): correct token refresh race`
- `chore: update readme`
- `refactor(parser)!: drop legacy AST format`

## Pull request titles

Use this exact template:

```
[type]/[scope]/[short description]
```

- **type**: same Conventional Commits type, capitalized (e.g. `Feat`, `Fix`, `Chore`, `Refactor`)
- **scope**: the affected area/module, capitalized, matching the commit scope when one exists
- **short description**: a few words, sentence case, describing the change

Example: `Feat/Editing/Add undo action`

When there is no clear single scope, omit that segment: `Chore/Update readme`.

Derive type and scope from the same reasoning used for the commit message(s) in the PR.
