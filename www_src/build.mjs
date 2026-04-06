import { build, context } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { watch as chokidarWatch } from 'chokidar';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__dirname, 'pages');
const sharedDir = join(__dirname, 'shared');
const stylesDir = join(__dirname, 'styles');
const distDir = join(__dirname, '..', 'www');
const watch = process.argv.includes('--watch');

function readShared() {
    return {
        header: readFileSync(join(sharedDir, 'header.html'), 'utf-8'),
        footer: readFileSync(join(sharedDir, 'footer.html'), 'utf-8'),
    };
}

const pages = readdirSync(pagesDir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => basename(f, '.ts'));

function assembleHtml() {
    const { header, footer } = readShared();

    for (const page of pages) {
        const src = join(pagesDir, `${page}.html`);
        if (!existsSync(src)) continue;

        const body = readFileSync(src, 'utf-8');
        const titleMatch = body.match(/<!--\s*title:\s*(.+?)\s*-->/);
        const title = titleMatch ? titleMatch[1] : page;

        const html = header.replace('{{title}}', title) + '\n' + body + '\n' + footer;

        const outDir = join(distDir, page);
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html);
    }
}

const logRebuild = {
    name: 'log-rebuild',
    setup(build) {
        let isRebuild = false;
        build.onStart(() => {
            if (isRebuild) console.log(`[esbuild] rebuilding...`);
            isRebuild = true;
        });
        build.onEnd((result) => {
            if (result.errors.length) return;
            console.log(`[esbuild] done`);
        });
    },
};

const entries = pages.map((page) => ({
    entryPoints: [join(pagesDir, `${page}.ts`)],
    outfile: join(distDir, page, 'index.js'),
    bundle: true,
    format: 'iife',
    target: 'es2020',
    plugins: [sassPlugin(), logRebuild],
}));

if (watch) {
    assembleHtml();
    const contexts = await Promise.all(entries.map((e) => context(e)));
    await Promise.all(contexts.map((c) => c.watch()));

    // Watch HTML files for changes
    chokidarWatch([join(pagesDir, '**/*.html'), join(sharedDir, '**/*.html')], {
        ignoreInitial: true,
    }).on('all', (event, path) => {
        console.log(`[html] ${event}: ${path}`);
        assembleHtml();
    });

    // Watch SCSS files for changes — rebuild all entries
    chokidarWatch([join(pagesDir, '**/*.scss'), join(stylesDir, '**/*.scss')], {
        ignoreInitial: true,
    }).on('all', async (event, path) => {
        console.log(`[scss] ${event}: ${path}`);
        await Promise.all(contexts.map((c) => c.rebuild()));
    });

    console.log('Watching for changes...');
} else {
    assembleHtml();
    await Promise.all(entries.map((e) => build(e)));
}
