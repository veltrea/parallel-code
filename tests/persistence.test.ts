import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveAppState, loadAppState } from '../src/core/persistence.js';
import { setConfig } from '../src/core/config.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Persistence Logic', () => {
    const testDir = path.join(os.tmpdir(), 'parallel-code-test-' + Date.now());

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
        fs.mkdirSync(testDir, { recursive: true });
        setConfig({ userDataPath: testDir, isDev: false });
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should save and load app state', () => {
        const testData = JSON.stringify({ version: '1.0.0', tasks: {} });
        saveAppState(testData);

        const loaded = loadAppState();
        expect(loaded).toBe(testData);
    });

    it('should handle backups on save', () => {
        const data1 = JSON.stringify({ val: 1 });
        const data2 = JSON.stringify({ val: 2 });

        saveAppState(data1);
        saveAppState(data2); // This should create a backup of data1

        const statePath = path.join(testDir, 'state.json');
        const bakPath = path.join(testDir, 'state.json.bak');

        expect(fs.existsSync(statePath)).toBe(true);
        expect(fs.existsSync(bakPath)).toBe(true);

        expect(fs.readFileSync(statePath, 'utf8')).toBe(data2);
        expect(fs.readFileSync(bakPath, 'utf8')).toBe(data1);
    });
});
