const esbuild = require("esbuild");

async function build() {
  try {
    // Build the Lambda function
    await esbuild.build({
      entryPoints: ["src/lambda/index.ts"],
      bundle: true,
      outfile: "dist/index.js",
      platform: "node",
      target: "node18",
      format: "cjs",
      minify: false,
      sourcemap: true,
      external: ["aws-sdk"], // Don't bundle aws-sdk as it's provided by Lambda
      loader: { ".ts": "ts" },
    });

    // Build the CDK app
    await esbuild.build({
      entryPoints: ["bin/app.ts"],
      bundle: true,
      outfile: "dist/cdk.cjs",
      platform: "node",
      target: "node18",
      format: "cjs",
      minify: false,
      sourcemap: true,
      loader: { ".ts": "ts" },
    });
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
