import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createWorktree, removeWorktree, getChangedFiles } from '../src/core/git.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

describe('Git Worktree Logic', () => {
    const testRepoDir = path.join(os.tmpdir(), 'parallel-git-test-' + Date.now());

    beforeEach(() => {
        if (fs.existsSync(testRepoDir)) {
            fs.rmSync(testRepoDir, { recursive: true, force: true });
        }
        fs.mkdirSync(testRepoDir, { recursive: true });

        // Initialize a dummy git repo
        execSync('git init', { cwd: testRepoDir });
        execSync('git config user.email "test@example.com"', { cwd: testRepoDir });
        execSync('git config user.name "Tester"', { cwd: testRepoDir });
        fs.writeFileSync(path.join(testRepoDir, 'README.md'), '# Test Repo');
        execSync('git add README.md', { cwd: testRepoDir });
        execSync('git commit -m "initial commit"', { cwd: testRepoDir });
    });

    afterEach(() => {
        // Note: Worktrees might need careful cleanup if they are still attached
        if (fs.existsSync(testRepoDir)) {
            fs.rmSync(testRepoDir, { recursive: true, force: true });
        }
    });

    it('should create and remove a worktree', async () => {
        const branchName = 'test-feature';
        const result = await createWorktree(testRepoDir, branchName, []);

        expect(result.branch).toBe(branchName);
        expect(fs.existsSync(result.path)).toBe(true);
        expect(fs.existsSync(path.join(result.path, '.git'))).toBe(true);

        // Verify it's a worktree
        const worktreeList = execSync('git worktree list', { cwd: testRepoDir, encoding: 'utf8' });
        expect(worktreeList).toContain(branchName);

        // Cleanup
        await removeWorktree(testRepoDir, branchName, true);
        expect(fs.existsSync(result.path)).toBe(false);
    });

    it('should detect changed files in worktree', async () => {
        const branchName = 'test-changes';
        const { path: worktreePath } = await createWorktree(testRepoDir, branchName, []);

        // Create a new file
        fs.writeFileSync(path.join(worktreePath, 'new-file.txt'), 'hello');

        const changedFiles = await getChangedFiles(worktreePath);
        expect(changedFiles.some(f => f.path === 'new-file.txt')).toBe(true);

        await removeWorktree(testRepoDir, branchName, true);
    });
});
