import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist-pages");

const copyTargets = ["index.html", "site.css", "slide"];

await fs.rm(distDir, { force: true, recursive: true });
await fs.mkdir(distDir, { recursive: true });

for (const target of copyTargets) {
  const sourcePath = path.join(rootDir, target);
  const destinationPath = path.join(distDir, target);
  await fs.cp(sourcePath, destinationPath, { recursive: true });
}

await fs.writeFile(path.join(distDir, ".nojekyll"), "");

console.log(`Built GitHub Pages artifact at ${distDir}`);
