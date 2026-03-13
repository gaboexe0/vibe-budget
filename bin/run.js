#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const indexPath = join(__dirname, '../dist/bin/index.js');

const result = spawn('node', [indexPath, ...args], {
  stdio: 'inherit',
  shell: true
});

result.on('exit', (code) => {
  process.exit(code || 0);
});
