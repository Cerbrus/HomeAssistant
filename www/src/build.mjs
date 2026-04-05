import { build, context } from 'esbuild';
import { readdirSync } from 'fs';
import { basename, join } from 'path';

const scriptsDir = 'scripts';
const distDir = '../dist';
const watch = process.argv.includes('--watch');

const entries = readdirSync(scriptsDir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => {
        const name = basename(f, '.ts');
        return {
            entryPoints: [join(scriptsDir, f)],
            outfile: join(distDir, name, 'index.js'),
            bundle: true,
            format: 'iife',
            target: 'es2020',
        };
    });

if (watch) {
    const contexts = await Promise.all(entries.map((e) => context(e)));
    await Promise.all(contexts.map((c) => c.watch()));
    console.log('Watching for changes...');
} else {
    await Promise.all(entries.map((e) => build(e)));
}
