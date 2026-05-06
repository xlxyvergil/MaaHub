以下的 markdown 是为修改此仓库的 AI 看的，如果你正在打算修改 `website`，请务必遵守 trellis 工作流与其他约定。

```md
<!-- TRELLIS:START -->

# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:

- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

## Subagents

- ALWAYS wait for all subagents to complete before yielding.
- Spawn subagents automatically when:
  - Parallelizable work (e.g., install + verify, npm test + typecheck, multiple tasks from plan)
  - Long-running or blocking tasks where a worker can run independently.
  - Isolation for risky changes or checks

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->

# 关于 MaaHub 与 MaaFramework

MaaHub 是 为 MaaFramework(maafw) 开源框架构建的范式参考社区，有关 `pipeline`、`custom` 等为 MaaFramework 专属概念，详情参考 `\dev\instructions\maafw-guide`。

简要而言，各模块指：

- `skills`：用于辅助 AI 理解 maafw 的 agent skill，并非 maafw 的概念
- `pipeline`：maafw 的流水线管线配置文件，一般为 json 或 jsonc 文件，具体规则参考`\dev\instructions\maafw-guide\3.1-任务流水线协议.md`
- `custom`：maafw 的自定义代码模块，一般用于自定义 pipeline 无法达成的功能，支持多语言
- `经验`：maafw 社区开发者撰写的使用框架开发自己项目的经验心得
```

以下的目录是为检索此仓库的 AI 看的。如果你打算搜索与下载某个 skill，或是参考某个 pipeline 等，可参考以下目录：

```tree
.
|-- Storage/
|   |-- customs/        # python、go 等自定义代码
|   |-- experiences/    # 开发经验
|   |-- pipelines/      # pipeline 范式
|   `-- skills/         # 用于 AI 的 skills
```
