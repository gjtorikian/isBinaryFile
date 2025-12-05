## Release

This project uses [release-please](https://github.com/googleapis/release-please) for automated releases with [conventional commits](https://www.conventionalcommits.org/).

### Commit Message Format

Version bumps are determined automatically from commit messages:

| Commit Type                    | Example                         | Version Bump          |
| ------------------------------ | ------------------------------- | --------------------- |
| `feat:`                        | `feat: add streaming detection` | Minor (5.0.0 → 5.1.0) |
| `fix:`                         | `fix: handle empty buffers`     | Patch (5.0.0 → 5.0.1) |
| `feat!:` or `BREAKING CHANGE:` | `feat!: require Node 24`        | Major (5.0.0 → 6.0.0) |
| `docs:`, `chore:`, `test:`     | `docs: update examples`         | No release            |

### Release Flow

1. Create a feature branch and make changes
2. Commit using conventional commit format (e.g., `feat: add new feature`)
3. Open a PR and merge to `main`
4. **release-please** automatically creates/updates a Release PR
5. The Release PR accumulates changes and shows the pending changelog
6. When ready to release, merge the Release PR
7. A git tag and GitHub Release are created automatically
8. GitHub Actions publishes to npm

### How the Workflows Interact

Two GitHub Actions workflows handle releases:

| Workflow             | Trigger             | Purpose                                                              |
| -------------------- | ------------------- | -------------------------------------------------------------------- |
| `release-please.yml` | Push to `main`      | Creates Release PR, manages versions and changelog, creates git tags |
| `publish.yml`        | Git tag `v*` pushed | Builds, tests, and publishes to npm via OIDC                         |

When you merge a Release PR, `release-please.yml` creates a git tag (e.g., `v5.1.0`), which triggers `publish.yml` to publish to npm.
