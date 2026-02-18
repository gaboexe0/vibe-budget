#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const result = spawn('npx', ['tsx', join(__dirname, 'index.ts'), ...args], {
  stdio: 'inherit',
  shell: true
});

result.on('exit', (code) => {
  process.exit(code || 0);
});
