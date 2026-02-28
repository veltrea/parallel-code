import path from 'path';
import os from 'os';

export interface ParallelCodeConfig {
  userDataPath: string;
  isDev: boolean;
}

let currentConfig: ParallelCodeConfig = {
  userDataPath: path.join(os.homedir(), '.parallel-code'),
  isDev: false,
};

export function setConfig(config: Partial<ParallelCodeConfig>) {
  currentConfig = { ...currentConfig, ...config };
}

export function getConfig(): ParallelCodeConfig {
  return currentConfig;
}
