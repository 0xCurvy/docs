import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sdkConfig = resolve(packageRoot, "../@0xcurvy/sdk/tsconfig.json");
const prebuiltIndex = resolve(packageRoot, "docs/.vitepress/dist/index.html");

if (await isReadable(sdkConfig)) {
  await runVitePress();
} else if (await isReadable(prebuiltIndex)) {
  console.log("SDK source is not present; using the prebuilt VitePress output.");
} else {
  throw new Error("Cannot build docs: SDK source is missing and docs/.vitepress/dist/index.html was not prebuilt.");
}

async function isReadable(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function runVitePress() {
  await new Promise((resolvePromise, reject) => {
    const child = spawn("vitepress", ["build", "docs"], {
      cwd: packageRoot,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(`VitePress exited with ${signal ? `signal ${signal}` : `code ${code}`}.`));
    });
  });
}
