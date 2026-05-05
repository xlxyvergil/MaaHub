# MaaHub

[中文](./README.md) | English

MaaHub is a community-oriented repository skeleton intended to host Maa-related `Skills`, `Pipelines`, `Customs`, and `Experiences`, and later present them through a static website that is easy to browse, search, and contribute to.

The repository is still in its bootstrap phase. The base folders, placeholder content area, and website workspace already exist, but real product implementation has not started yet. This phase does not introduce content schemas, marketplace pages, search, or release workflows ahead of time.

## Repository Purpose

- `Storage/` is reserved for future community-contributed content, grouped by content type.
- `website/` is the Astro workspace for the future site and currently serves only as an initialization area.
- The root documentation answers two questions first: what this repository is for, and how contributors should participate right now.

At this stage, MaaHub is primarily a collaboration starting point, not a finished product site.

## Current Repository Structure

```text
.
|-- Storage/
|   |-- customs/
|   |-- experiences/
|   |-- pipelines/
|   `-- skills/
|-- website/
|-- README.md
`-- README.en.md
```

### Structure Notes

| Path                   | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `Storage/customs/`     | Future home for community custom-code entries                                     |
| `Storage/experiences/` | Future home for tutorials, notes, and experience write-ups                        |
| `Storage/pipelines/`   | Future home for pipeline entries                                                  |
| `Storage/skills/`      | Future home for skill entries                                                     |
| `website/`             | Astro workspace for the future site, currently kept at initialized scaffold level |

Each content-type directory under `Storage/` currently contains only `.gitkeep`, which means the structure is reserved but real community content has not been added yet.

## Bootstrap Status

The current state is:

- The top-level responsibilities are defined clearly: content storage and website workspace are separated.
- The README set now acts as the human-facing entry point for contributors.
- The base directory layout already exists, and `website/` has been initialized with Astro so follow-up implementation can proceed incrementally.
- Real marketplace features, sample entries, metadata schemas, CI/CD, and page architecture are still intentionally absent.

If you are entering the repo for the first time, the key takeaway is simple: the structure is ready for building, but the product is not yet ready for operation.

## How To Contribute Right Now

The most useful contributions in the current phase are:

1. Suggest improvements to repository positioning, information architecture, and collaboration flow.
2. Improve documentation so future contributors can understand MaaHub's goals and boundaries faster.
3. Move forward on scoped bootstrap tasks without breaking the existing skeleton.

Things to avoid at this stage:

1. Adding temporary sample content under `Storage/` unless a task explicitly asks for it.
2. Expanding product features or pages without a clearly scoped task.
3. Changing the meaning of top-level directories in ways that drift away from the PRD and agreed repository shape.

## Recommended Working Flow

1. Read this README first and treat the repository as bootstrap-only unless a task says otherwise.
2. Use [README.md](./README.md) for the Chinese-first default description.
3. Confirm the task or PRD scope before implementing changes.
4. Keep each change focused so skeleton adjustments, product features, and sample content do not get mixed together.

## What Will Be Added Later

- Directory and metadata conventions for community entries
- Website pages and presentation patterns
- Contribution submission and validation workflows
- Human-facing and AI-facing installation or integration guidance

Those items will be introduced in later tasks. The job of the current README set is to explain the repository's present state and boundaries, not to pretend future implementation details already exist.
