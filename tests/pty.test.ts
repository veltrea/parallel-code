import { describe, it, expect, vi } from 'vitest';
import { spawnAgent, writeToAgent, killAgent } from '../src/core/pty.js';

describe('PTY Logic', () => {
    it('should spawn a process and receive output', async () => {
        const onData = vi.fn();
        const agentId = 'test-agent-' + Date.now();

        spawnAgent({
            taskId: 'test-task',
            agentId: agentId,
            command: '/bin/zsh',
            args: ['-c', 'ls -a'],
            cwd: process.cwd(),
            env: process.env,
            cols: 80,
            rows: 24,
            onOutput: { __CHANNEL_ID__: 'test-channel' },
            onData: (msg) => {
                if (msg.type === 'Data') {
                    onData(Buffer.from(msg.data, 'base64').toString('utf8'));
                }
            }
        });

        // Wait for output
        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(onData).toHaveBeenCalled();
        const allOutput = onData.mock.calls.map(call => call[0]).join('');
        expect(allOutput).toContain('.');

        killAgent(agentId);
    });
});
