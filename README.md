# Agent Skills Hub

这是一个用于在线收集、存储和维护智能体 Skill 文件的仓库。

仓库根目录采用“四个一级分类 + 技能文件夹”的结构。先进入分类文件夹，再进入以技能名称命名的独立文件夹，即可看到该技能的说明文档、代码、参考资料、资产模板和依赖声明。

## 目录结构

```text
Agent-skills-hub/
├── Lark/
│   └── feishu-ops/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       ├── scripts/
│       ├── references/
│       └── requirements.txt
├── Office/
│   └── .gitkeep
├── Data/
│   └── data-analysis-playbook/
│       ├── SKILL.md
│       ├── agents/openai.yaml
│       ├── scripts/
│       ├── references/
│       └── requirements.txt
└── App/
    ├── chemical-safety/
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   ├── references/
    │   ├── assets/
    │   └── requirements.txt
    ├── build-local-performance-bi/
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   ├── scripts/
    │   ├── references/
    │   └── assets/
    └── build-token-bi/
        ├── SKILL.md
        ├── agents/openai.yaml
        ├── scripts/
        ├── references/
        └── assets/
```

## 一级分类

| 分类 | 用途 |
| --- | --- |
| `Lark/` | 飞书相关技能，例如消息、日程、任务、审批、文档、表格、多维表格、会议纪要 |
| `Office/` | 日常办公技能，例如 Word、PPT、Excel、PDF、邮件、报告排版 |
| `Data/` | 数据分析技能，例如指标诊断、KPI 报告、数据清洗、可视化、仪表盘 |
| `App/` | 场景应用技能，例如化工安全、项目执行、生活事务、行业专用工作流 |

## 技能文件夹规范

每个技能文件夹建议包含：

- `SKILL.md`：必需。写明技能名称、触发场景、执行流程和资源导航。
- `agents/openai.yaml`：推荐。用于展示名称、简介和默认调用提示。
- `scripts/`：可选。存放可执行脚本、工具函数或自动化代码。
- `references/`：可选。存放流程说明、制度、接口说明、数据字典等详细参考资料。
- `assets/`：可选。存放模板、表单、图片、示例文件等输出资产。
- `requirements.txt` / `package.json`：可选。声明该技能代码运行所需依赖。

## 命名约定

- 一级分类固定为 `Lark/`、`Office/`、`Data/`、`App/`。
- 技能文件夹使用小写英文、数字和连字符，例如 `feishu-ops`。
- 文件夹名称应与 `SKILL.md` frontmatter 中的 `name` 一致。
- 一个技能只解决一类稳定任务，避免把不相关流程混在同一个文件夹。

## 当前技能

| 分类 | 技能 | 用途 |
| --- | --- | --- |
| `Lark/` | `feishu-ops` | 飞书消息、日程、任务、文档等协作事务的处理流程 |
| `Data/` | `data-analysis-playbook` | 数据分析任务拆解、CSV 画像、报告产出规范 |
| `App/` | `chemical-safety` | 化工安全生产检查、隐患闭环和方案辅助 |
| `App/` | `build-local-performance-bi` | 本地 Windows 电脑性能 BI 小浮窗生成与调试 |
| `App/` | `build-token-bi` | 本地 AI 服务 Token 套餐与余额 BI 小浮窗 |

## 新增技能流程

1. 先选择一级分类：`Lark/`、`Office/`、`Data/` 或 `App/`。
2. 在对应分类目录下创建一个以技能名命名的文件夹。
3. 添加 `SKILL.md`，至少包含 `name` 和 `description` frontmatter。
4. 按需添加 `scripts/`、`references/`、`assets/` 和依赖文件。
5. 确认技能名称、触发描述和资源引用准确。
6. 提交前运行基础检查，例如 Markdown 检查、脚本语法检查或 Skill 校验脚本。
