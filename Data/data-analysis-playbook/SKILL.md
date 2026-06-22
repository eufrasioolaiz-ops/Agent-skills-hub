---
name: data-analysis-playbook
description: Guide repeatable data analysis work, including CSV profiling, KPI definition, metric diagnostics, exploratory analysis, chart selection, and concise report drafting. Use when the user asks to analyze datasets, build operational reports, compare metrics, or prepare data-backed decisions.
---

# Data Analysis Playbook

## Workflow

1. Define the decision, audience, grain, time window, and success metric.
2. Inspect source files, schemas, missing values, duplicates, and units.
3. Reproduce core metrics with transparent formulas.
4. Compare across time, segment, product, owner, or process stage.
5. Summarize findings as decision-ready bullets with caveats and next checks.

## Resource Guide

- Read `references/report-structure.md` for report sections and wording.
- Use `scripts/profile_csv.py` for a quick CSV profile before deeper analysis.

## Output Style

- Put the answer before methodology.
- State sample size, filters, and date range.
- Distinguish observed data from interpretation.

