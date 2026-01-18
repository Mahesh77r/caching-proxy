#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Read package.json to get name and version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

export const program = new Command();

program
    .name(Object.keys(packageJson.bin || {})[0] || 'caching-proxy') // Dynamically get CLI name from bin field
    .description('A CLI application for caching HTTP responses')
    .version(packageJson.version); // Dynamic version too!

program
    .option('-p, --port <number>', 'Port number', '8001')
    .option('--origin <url>', 'Origin URL', 'https://example.com')
    .option('--clear-cache', 'Clear the cache')
    .option('--ttl <number>', 'Time to live in seconds', '60 * 60 * 24 * 7');

program.parse(process.argv);

console.log(program.opts());

// Import server after parsing to ensure options are available
// Use dynamic import to avoid circular dependency issues
try {
    const { startServer } = await import('./server.js');
    const { setProxyConfig } = await import('./proxy.js');
    const options = program.opts();
    const port = parseInt(options.port || '8001');
    const ttl = parseInt(options.ttl);

    // Set proxy configuration before starting server
    setProxyConfig({
        origin: options.origin,
        ttl
    });

    startServer(port);
} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}

// ttl set by option

// create build
// optional: npm unlink -g <old_name || name>
// npm link
// my-cli --help


