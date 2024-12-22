import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

// Build the CDK app
await build({
  entryPoints: ["./bin/app.ts"],
  bundle: true,
  outfile: "dist/cdk.js",
  platform: "node",
  format: "cjs",
  plugins: [nodeExternalsPlugin()],
  sourcemap: true,
  target: "node18",
  loader: { ".ts": "ts" },
});

// Build the Lambda function and local runner
await build({
  entryPoints: ["./src/lambda/index.ts", "./src/lambda/local.ts"],
  bundle: true,
  outdir: "dist/lambda",
  platform: "node",
  format: "esm",
  plugins: [nodeExternalsPlugin()],
  sourcemap: true,
  target: "node18",
  external: ["@aws-sdk/*", "aws-sdk"],
  loader: { ".ts": "ts" },
});
