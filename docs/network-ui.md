# Domain Mapping UI

This document describes the Domain Mapping interface.

## Components

| Component | Props | Description |
|-----------|-------|-------------|
| `MappingGrid` | `mappings: DomainMapping[]`<br>`onUpdate(m: DomainMapping)` | Displays cards in a responsive grid |
| `MappingCard` | `mapping: DomainMapping`<br>`onSave(m: DomainMapping)` | Summary card with inline editor |
| `MappingEditor` | `mapping: DomainMapping`<br>`onSave(m)`<br>`onCancel()` | Expanded form with validators |
| `StatusDot` | `ok: boolean` | Colored status indicator |
| `ValidatorIcon` | `valid: boolean` | Shows ✓ or ❌ |

Example YAML snippet representing a mapping:

```yaml
- domain: example.com
  aliases: [www.example.com]
  path: /
  ip: 10.0.5.9
  port: 7802
```

## Dev Setup - JS tests & lint

Install Node dependencies with `pnpm install --frozen-lockfile`.
Run `pnpm lint` to check code style and `pnpm test` to execute Jest tests using Jest and React Testing Library.
