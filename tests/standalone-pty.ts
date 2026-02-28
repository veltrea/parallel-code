import * as pty from 'node-pty';
import os from 'os';

const shell = process.env.SHELL || 'sh';
console.log('Spawning shell:', shell);

try {
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: process.env
    });

    ptyProcess.onData((data) => {
        console.log('Data:', data);
        process.exit(0);
    });

    ptyProcess.write('ls\r');

    setTimeout(() => {
        console.log('Timeout');
        process.exit(1);
    }, 2000);
} catch (e) {
    console.error('Spawn failed:', e);
    process.exit(1);
}
