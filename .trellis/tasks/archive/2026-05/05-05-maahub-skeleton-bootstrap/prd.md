# MaaHub Skeleton Bootstrap

## Goal

Based on [.tmp/MaaHub_PRD.md](../../../.tmp/MaaHub_PRD.md), establish the repository's initial skeleton so later feature work has the intended top-level layout, a bootstrapped Astro site, and basic contributor-facing documentation.

## What I already know

* The repo is effectively empty aside from Trellis/bootstrap files.
* The target structure in the PRD includes a root `Storage/` data area and a `website/` Astro site.
* The user wants placeholder directories created with `.gitkeep`.
* The user wants README content written now.
* The user wants Astro initialized now.
* The user explicitly does not want concrete business content implemented yet.

## Requirements

* Create the top-level repository skeleton aligned with the PRD.
* Add placeholder directories using `.gitkeep` where directories need to exist before real content is added.
* Initialize an Astro project under `website/`.
* Write human-facing README documentation that introduces MaaHub, explains the repository layout, and includes contributor guidance.
* Provide bilingual README documentation with Chinese as the default root document and a separate English version.
* Ignore the local scratch `.tmp/` directory at the repo root so bootstrap-era temporary files do not block Trellis finish-work archival.
* Keep the implementation limited to scaffolding and documentation; do not implement content models, pages, workflows, schemas, or market features yet.

## Acceptance Criteria

* [ ] The repo contains the expected top-level skeleton for `Storage/` and `website/`.
* [ ] Placeholder directories that should be committed before real content exists include `.gitkeep`.
* [ ] `website/` is an initialized Astro project that can be further developed later.
* [ ] Root `README.md` is Chinese-first and explains MaaHub positioning, current structure, bootstrap scope, and contribution guidance.
* [ ] A separate English README version exists and stays aligned with the Chinese root README at a high level.
* [ ] Root `.gitignore` ignores `.tmp/` so local scratch files do not appear as untracked work during archive/finish flow.
* [ ] No concrete market functionality beyond scaffolding is introduced.

## Definition of Done

* Relevant files are created and consistent with the PRD's initial structure.
* Lint/typecheck/build validation is run for the initialized Astro project if available.
* No extra product features are implemented outside the agreed bootstrap scope.

## Technical Approach

Use the PRD as the source of truth for directory names. Create the repository skeleton first, then bootstrap Astro in `website/`, then update the root README set so the docs match the actual scaffold on disk. Keep `README.md` as the default Chinese entry and provide an English companion document.

## Decision (ADR-lite)

**Context**: The repo needs an initial, shared structure before feature implementation starts.
**Decision**: Build only the filesystem scaffold, Astro starter, and README now.
**Consequences**: The repo becomes ready for incremental implementation while avoiding premature design lock-in for data schemas, UI pages, and CI logic.

## Out of Scope

* Astro page/content implementation
* Content collection schemas
* Search, file tree, detail pages, or listing pages
* GitHub Actions workflows
* Metadata validation scripts
* Any real items under `Storage/`

## Technical Notes

* Source requirement doc: `.tmp/MaaHub_PRD.md`
* Current repo state inspected on 2026-05-05: only Trellis/bootstrap files exist at the root.
* Frontend spec index exists but contains placeholder guidance only; no project-specific frontend conventions are defined yet.
