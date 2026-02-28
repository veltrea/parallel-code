import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTask, deleteTask } from '../src/core/tasks.js';
import { setConfig } from '../src/core/config.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

describe('Tasks Management Logic', () => {
    const testDir = path.join(os.tmpdir(), 'parallel-tasks-test-' + Date.now());
    const projectRepoDir = path.join(testDir, 'repo');

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
        fs.mkdirSync(projectRepoDir, { recursive: true });

        // Init git repo for tasks
        execSync('git init', { cwd: projectRepoDir });
        execSync('git config user.email "test@example.com"', { cwd: projectRepoDir });
        execSync('git config user.name "Tester"', { cwd: projectRepoDir });
        fs.writeFileSync(path.join(projectRepoDir, 'init.txt'), 'init');
        execSync('git add . && git commit -m "init"', { cwd: projectRepoDir });

        setConfig({ userDataPath: testDir, isDev: false });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should create a task with a worktree', async () => {
        const taskName = 'Fix Bug 123';
        const result = await createTask(taskName, projectRepoDir, [], 'features');

        expect(result.id).toBeDefined();
        expect(result.branch_name).toBe('features/fix-bug-123');
        expect(fs.existsSync(result.worktree_path)).toBe(true);
    });

    it('should delete a task and clean up worktree', async () => {
        const task = await createTask('To Delete', projectRepoDir, [], 'features');
        expect(fs.existsSync(task.worktree_path)).toBe(true);

        await deleteTask([], task.branch_name, true, projectRepoDir);
        expect(fs.existsSync(task.worktree_path)).toBe(false);
    });
});
