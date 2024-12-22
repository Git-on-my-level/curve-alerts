import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/lambda/index.ts'],
    bundle: true,
    outfile: 'dist/index.cjs',
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    minify: false,
    sourcemap: true,
    external: ['aws-sdk'] // Don't bundle aws-sdk as it's provided by Lambda
}).catch(() => process.exit(1));
