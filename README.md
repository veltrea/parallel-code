# Parallel Code - Headless Core Library

This is a headless TypeScript library extracted and refactored from the original [Parallel Code](https://github.com/parallel-code/parallel-code) project.

## Background & Motivation

As developers of VS Code-based AI agents, we needed a robust, standalone engine to handle multi-agent orchestration, Git worktree management, and PTY processes without the overhead of an Electron GUI. 

We believe that the future of AI-assisted coding should not depend solely on proprietary, closed-source platforms. A single corporate decision could suddenly restrict our ability to develop with AI. To prevent this, our community needs a diverse ecosystem of open-source tools. 

We encourage other developers building AI coding agents and tools to use, fork, and improve this library.

## Key Features

- **Multi-Agent Management**: Orchestrate Claude Code, Gemini, and other CLI agents.
- **Git Worktree Integration**: Create isolated task environments automatically.
- **Headless PTY**: Manage terminal-based agent processes programmatically.
- **Platform Agnostic**: Decoupled from Electron; works in any Node.js/TypeScript environment.

## Usage

```typescript
import { spawnAgent, createTask } from '@veltrea/parallel-code';

// Example: Create a task worktree
const task = await createTask('fix-issue', '/path/to/repo', [], 'feature');
console.log(`Working on ${task.branch_name} at ${task.worktree_path}`);
```

## License

MIT License - same as the original Parallel Code project.
