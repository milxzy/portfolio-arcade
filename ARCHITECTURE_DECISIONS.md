# architecture decisions

tracking all major decisions made during production-readiness refactoring.

## decision log

### 2026-02-11: production-readiness refactor

**context**: codebase was functionally complete but had build errors, unused code, missing docs, and wasn't ready for end users.

**goal**: make everything production-ready with zero build errors, comprehensive docs, proper testing, and polished user experience.

---

## phase 1: rust codebase cleanup

### decision 001: remove unused utility code

**what**: removed large portions of unused utility functions from `utils/errors.rs`, `utils/fs.rs`, and `utils/validation.rs`.

**why**: 
- dead code increases binary size and maintenance burden
- unused code suggests incomplete features or over-engineering
- cargo warns about it, creating noise that hides real issues

**breaking changes**: 
- removed `PortfolioError` enum (was never actually used, code uses `anyhow::Result` everywhere)
- removed 10+ unused fs utility functions
- removed unused validation functions

**kept**: functions that are currently used or clearly designed for future template generation features.

**impact**: cleaner codebase, smaller binary, easier maintenance.

---

### decision 002: remove unused event handling code

**what**: removed `EventHandler` struct and event helper functions from `tui/events.rs`.

**why**:
- `app.rs` handles events directly with pattern matching on `KeyCode`
- the abstraction wasn't being used and added complexity
- simpler direct pattern matching is more readable for this use case

**breaking changes**: removed `EventHandler`, `InputEvent` enum, and helper functions like `is_quit_key`, `is_enter_key`, etc.

**impact**: simpler event handling, less indirection.

---

### decision 003: keep `indicatif` dependency and integrate it

**what**: decided to use the `indicatif` dependency that was imported but not used.

**why**:
- provides better user feedback during long operations (npm install, template copying)
- professional CLI tools show progress bars
- already in dependencies, just needs integration

**alternative considered**: removing the dependency entirely, but UX would suffer.

**implementation**: add progress bars to template copying and dependency installation.

---

### decision 004: fix all clippy warnings

**what**: applied all clippy suggestions for code quality.

**changes**:
- removed nested `format!()` calls in print statements
- removed useless `format!()` for static strings (use `.to_string()`)
- fixed needless borrows in generic function calls
- collapsed nested if-let patterns

**why**: clippy catches real issues that can affect performance and readability.

**impact**: cleaner, more idiomatic rust code.

---

### decision 005: remove unused module exports

**what**: removed wildcard re-exports from `utils/mod.rs` for unused modules.

**why**:
- modules were re-exported but never imported elsewhere
- creates confusion about what's actually part of the public API

**breaking changes**: removed `pub use errors::*`, `pub use fs::*`, `pub use validation::*`.

**impact**: clearer module boundaries.

---

### decision 006: add MIT LICENSE file

**what**: created proper MIT license file.

**why**:
- `Cargo.toml` declares MIT license but file didn't exist
- open source projects need explicit licensing
- protects both users and maintainers

**content**: standard MIT license with copyright.

---

### decision 007: keep existing test coverage, add targeted tests

**what**: added tests for previously untested critical paths, but didn't aim for 100% coverage.

**why**:
- 100% coverage is often wasteful (testing trivial getters, etc.)
- focused on business logic and error paths
- TUI code is hard to test and better suited for manual QA

**additions**:
- template generation workflow tests
- error handling tests
- file operation tests with temp directories

**target**: ~50-60% meaningful coverage instead of 100% coverage.

---

## phase 2: template dependency fixes

### decision 008: downgrade date-fns to v3.x

**what**: changed `date-fns` from `4.1.0` to `^3.0.0` in all templates.

**why**:
- `react-day-picker@8.10.1` requires `date-fns@^2.28.0 || ^3.0.0`
- version 4 has breaking changes
- calendar components would fail with version mismatch

**alternative considered**: upgrading react-day-picker, but it doesn't support date-fns v4 yet.

**impact**: dependency installation now works without `--legacy-peer-deps`.

---

### decision 009: remove ignoreBuildErrors flag

**what**: removed `typescript: { ignoreBuildErrors: true }` from all `next.config.mjs` files.

**why**:
- silencing errors hides real bugs
- production code should have zero build errors
- users will get better error messages during customization

**risk mitigation**: fixed all TypeScript errors before removing the flag.

**impact**: builds will fail on type errors, catching bugs early.

---

### decision 010: fix image optimization

**what**: removed `images: { unoptimized: true }` from PS5 template config.

**why**:
- next.js image optimization is a major performance feature
- unoptimized images hurt lighthouse scores and load times
- no good reason to disable it

**impact**: better performance, smaller image payloads.

---

## phase 3: template documentation

### decision 011: casual, friendly documentation style

**what**: wrote all documentation in lowercase, conversational tone matching existing README.

**why**:
- consistency with existing voice
- more approachable for junior developers
- matches the fun, gaming-themed nature of the project

**example**: "hey! this is how you customize your portfolio" vs "Please customize your portfolio as follows:"

---

### decision 012: separate CUSTOMIZATION_GUIDE.md files

**what**: created dedicated customization guides instead of putting everything in README.

**why**:
- README should be quick-start focused
- customization is detailed and deserves its own doc
- easier to maintain and update separately

**content**: step-by-step instructions for editing data files, changing colors, adding projects, etc.

---

### decision 013: add inline TODO comments in data files

**what**: added clear `// TODO: customize this` comments in all template data files.

**why**:
- users need to know what to change
- reduces support burden (obvious what needs editing)
- follows principle of "make the right thing easy"

**example**: 
```typescript
// TODO: replace with your actual email
email: "hello@developer.dev"
```

---

### decision 014: add comprehensive .env.example files

**what**: created `.env.example` with common optional features.

**why**:
- shows users what's configurable via environment variables
- standard practice for modern web apps
- makes adding analytics/forms easier

**content**: analytics IDs, form endpoints, site URLs (all optional).

---

## phase 4: production polish

### decision 015: add error boundaries to all templates

**what**: created reusable `ErrorBoundary` component for all templates.

**why**:
- prevents white screen of death
- shows friendly error messages to users
- logs errors for debugging

**implementation**: wrap main app content in error boundary.

---

### decision 016: add comprehensive metadata

**what**: added OpenGraph, Twitter cards, and proper SEO metadata.

**why**:
- portfolios are meant to be shared
- good metadata improves social media previews
- helps with discoverability

**made configurable**: metadata pulls from portfolio config, not hardcoded.

---

### decision 017: fix hardcoded "MilxOS" branding

**what**: replaced hardcoded "MilxOS" in PS5 template with configurable name.

**why**:
- users should have their own branding
- "MilxOS" is developer's personal branding
- makes template truly reusable

**impact**: pulls from portfolio config like other templates.

---

### decision 018: add localStorage persistence for settings

**what**: made settings (sound, scanlines, etc.) persist across sessions.

**why**:
- better UX - users don't have to reconfigure every visit
- standard behavior for settings toggles
- trivial to implement

**implementation**: simple localStorage wrapper with JSON serialization.

---

### decision 019: add proper 404 pages

**what**: created custom 404 pages for each template matching their theme.

**why**:
- default next.js 404 breaks immersion
- shows attention to detail
- opportunity for creative theme consistency

**style**: PS3 gets XMB-styled 404, PS5 gets card-based, Wii gets channel-style.

---

### decision 020: fix accessibility issues

**what**: added skip-to-content links, improved ARIA labels, fixed color contrast.

**why**:
- accessibility is not optional for production sites
- widens potential user base
- good practice for portfolio sites (shows you care about a11y)

**testing**: used Lighthouse accessibility audits to identify issues.

---

## phase 5: testing & ci/cd

### decision 021: pragmatic test coverage approach

**what**: focused tests on critical paths, not chasing 100% coverage.

**rationale**:
- TUI code is hard to unit test, better suited for manual QA
- template generation is integration-test territory
- utility functions already have good coverage

**added**:
- integration tests for full workflow
- tests for file operations with actual temp directories
- error path testing

**skipped**: 
- TUI rendering tests (manual QA more effective)
- trivial getter/setter tests

---

### decision 022: github actions for CI

**what**: added `.github/workflows/ci.yml` for rust checks and template builds.

**why**:
- github actions is free for public repos
- most common CI platform
- good integration with github

**pipeline**:
1. rust: cargo check, cargo test, cargo clippy, cargo fmt
2. templates: npm install, npm run build for each template
3. runs on: push to main, pull requests

---

### decision 023: pre-commit hooks via cargo-husky

**what**: added git pre-commit hooks for cargo fmt and clippy.

**why**:
- catches issues before they hit CI
- enforces code quality locally
- saves time (no failed CI builds for formatting)

**implementation**: simple shell script in `.git/hooks/pre-commit`.

---

### decision 024: semantic versioning and releases

**what**: set up automated releases with version bumping.

**why**:
- users need stable release points
- cargo and npm both use semver
- automated releases reduce friction

**workflow**: tag-based releases with changelog generation.

---

## phase 6: nice-to-haves

### decision 025: add analytics integration examples

**what**: added commented-out analytics code examples in templates.

**why**:
- common need for portfolio sites
- showing good patterns helps users
- keeping commented keeps it optional

**providers**: google analytics, plausible (privacy-focused alternative).

---

### decision 026: add contact form examples

**what**: added example contact form integration with formspree/getform.

**why**:
- portfolios often need contact forms
- reduces support burden (users ask for this)
- shows integration patterns

**approach**: example code, commented out, with setup instructions.

---

### decision 027: create demo GIFs for README

**what**: recorded short GIFs showing each template in action.

**why**:
- visual demos sell the project better than text
- shows the UX immediately
- reduces "what does this look like?" questions

**tool**: gifski for high-quality GIFs.

---

### decision 028: skip storybook for now

**what**: decided not to add storybook component documentation.

**why**:
- templates are end-user products, not component libraries
- users customize data, not components
- storybook adds significant dependency weight
- documentation burden would be high

**alternative**: good inline comments in component files.

---

## general principles followed

1. **break when necessary**: made breaking changes where they improved the codebase
2. **document everything**: every change has a clear rationale
3. **user-first**: prioritized end-user experience over developer convenience
4. **pragmatic testing**: test what matters, skip what doesn't
5. **casual voice**: kept friendly, lowercase documentation style
6. **production-ready**: zero tolerance for build errors or warnings
7. **optional features**: made advanced features opt-in, not mandatory

---

## impact summary

**before**: 
- 26 rust warnings, 7 clippy warnings
- templates fail to install (dependency conflicts)
- no documentation for users
- build errors hidden
- no tests for critical paths

**after**:
- zero warnings or errors
- clean installs, successful builds
- comprehensive documentation
- proper error handling
- meaningful test coverage
- ready for public use

---

*this document will be updated as more decisions are made.*
