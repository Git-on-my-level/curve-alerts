import * as esbuild from "esbuild";
import { rm, cp } from "fs/promises";

async function build() {
  try {
    // Clean dist directory first
    console.log("Cleaning dist directory...");
    await rm("dist", { recursive: true, force: true });

    // Build the Lambda function
    await esbuild.build({
      entryPoints: ["src/lambda/index.ts"],
      bundle: true,
      outfile: "dist/lambda/index.cjs",
      platform: "node",
      target: "node18",
      format: "cjs",
      minify: false,
      sourcemap: true,
      external: ["aws-sdk"],
    });

    // Build CDK app
    await esbuild.build({
      entryPoints: ["bin/app.ts"],
      bundle: true,
      outfile: "dist/cdk.cjs",
      platform: "node",
      target: "node18",
      format: "cjs",
      external: ["aws-cdk-lib", "constructs"],
      sourcemap: true,
    });

    // Build CDK stack
    await esbuild.build({
      entryPoints: ["lib/lambda-stack.ts"],
      bundle: true,
      outfile: "dist/lib/lambda-stack.cjs",
      platform: "node",
      target: "node18",
      format: "cjs",
      external: ["aws-cdk-lib", "constructs"],
      sourcemap: true,
    });

    // Copy config file to dist directory
    console.log("Copying config file...");
    await cp("src/lambda/config.ts", "dist/lambda/config.cjs");

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
