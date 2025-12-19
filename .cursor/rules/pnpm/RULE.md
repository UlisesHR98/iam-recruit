---
alwaysApply: true
---

## Package Manager and OS

- **OS**: Windows
- **Package Manager**: pnpm (always use pnpm, never npm or npx)
- When installing packages or running shadcn/ui commands, use:
  - `pnpm add <package>` instead of `npm install <package>`
  - `pnpm dlx <command>` instead of `npx <command>`
  - `pnpm shadcn@latest add <component>` instead of `npx shadcn@latest add <component>`
