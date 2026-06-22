# Agent Skills Hub

这是一个用于在线收集、存储和维护智能体 Skill 文件的仓库。

仓库根目录采用“一个文件夹就是一个技能”的结构。技能文件夹以技能名称命名，点进文件夹即可看到该技能的说明文档、代码、参考资料、资产模板和依赖声明。

## 目录结构

```text
Agent-skills-hub/
├── feishu-ops/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── scripts/
│   ├── references/
│   └── requirements.txt
├── chemical-safety/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── references/
│   ├── assets/
│   └── requirements.txt
└── data-analysis-playbook/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── scripts/
    ├── references/
    └── requirements.txt
```

## 技能文件夹规范

每个技能文件夹建议包含：

- `SKILL.md`：必需。写明技能名称、触发场景、执行流程和资源导航。
- `agents/openai.yaml`：推荐。用于展示名称、简介和默认调用提示。
- `scripts/`：可选。存放可执行脚本、工具函数或自动化代码。
- `references/`：可选。存放流程说明、制度、接口说明、数据字典等详细参考资料。
- `assets/`：可选。存放模板、表单、图片、示例文件等输出资产。
- `requirements.txt` / `package.json`：可选。声明该技能代码运行所需依赖。

## 命名约定

- 技能文件夹使用小写英文、数字和连字符，例如 `feishu-ops`。
- 文件夹名称应与 `SKILL.md` frontmatter 中的 `name` 一致。
- 一个技能只解决一类稳定任务，避免把不相关流程混在同一个文件夹。

## 当前示例技能

| 技能 | 用途 |
| --- | --- |
| `feishu-ops` | 飞书消息、日程、任务、文档等协作事务的处理流程 |
| `chemical-safety` | 化工安全生产检查、隐患闭环和方案辅助 |
| `data-analysis-playbook` | 数据分析任务拆解、CSV 画像、报告产出规范 |

## 新增技能流程

1. 在根目录创建一个以技能名命名的文件夹。
2. 添加 `SKILL.md`，至少包含 `name` 和 `description` frontmatter。
3. 按需添加 `scripts/`、`references/`、`assets/` 和依赖文件。
4. 确认技能名称、触发描述和资源引用准确。
5. 提交前运行基础检查，例如 Markdown 检查、脚本语法检查或 Skill 校验脚本。

