# Contributing

欢迎向本仓库添加新的智能体 Skill。

## 一级分类

新技能必须放在一个一级分类目录下：

```text
Lark/skill-name/
Office/skill-name/
Data/skill-name/
App/skill-name/
```

- `Lark/`：飞书相关技能。
- `Office/`：日常办公技能。
- `Data/`：数据分析技能。
- `App/`：场景应用技能。

## 新技能最小要求

```text
Category/skill-name/
├── SKILL.md
└── agents/openai.yaml
```

如技能需要代码、资料或模板，再添加：

```text
Category/skill-name/
├── scripts/
├── references/
├── assets/
├── requirements.txt
└── package.json
```

## `SKILL.md` 要求

```markdown
---
name: skill-name
description: 说明技能做什么，以及什么场景下应该使用它。
---

# Skill Title

## Workflow

1. ...
```

`description` 是技能触发的关键，请明确写出使用场景、任务类型和边界。

## 代码与依赖

- Python 依赖写入 `requirements.txt`。
- Node.js 依赖写入 `package.json`。
- 脚本应能从技能文件夹内独立运行，避免依赖仓库外部的私有路径。

