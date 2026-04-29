const path = require("path");
const fs = require("fs");

// Find a workspace root for a file by looking for eslint.config.* or package.json
function findWorkspaceRoot(file) {
  let dir = path.dirname(file);
  const root = process.cwd();

  while (dir !== root) {
    // Check if this directory has an eslint config
    const hasEslintConfig =
      fs.existsSync(path.join(dir, "eslint.config.js")) ||
      fs.existsSync(path.join(dir, "eslint.config.mjs")) ||
      fs.existsSync(path.join(dir, "eslint.config.cjs")) ||
      fs.existsSync(path.join(dir, "eslint.config.ts"));

    if (hasEslintConfig) {
      return dir;
    }

    dir = path.dirname(dir);
  }

  return null;
}

module.exports = {
  "*.{ts,tsx,js,vue}": (files) => {
    const commands = [];

    // Run prettier on all files
    commands.push(`prettier --write ${files.join(" ")}`);

    // Group files by their workspace root
    const workspaceGroups = {};

    files.forEach((file) => {
      const workspaceRoot = findWorkspaceRoot(file);

      if (workspaceRoot) {
        if (!workspaceGroups[workspaceRoot]) {
          workspaceGroups[workspaceRoot] = [];
        }

        workspaceGroups[workspaceRoot].push(file);
      }
    });

    // Run eslint for each workspace
    Object.entries(workspaceGroups).forEach(([workspace, workspaceFiles]) => {
      const relativeFiles = workspaceFiles
        .map((f) => path.relative(workspace, f))
        .join(" ");
      commands.push(`cd ${workspace} && eslint --fix ${relativeFiles}`);
    });

    return commands;
  },
  "*.{md,json,yml,yaml}": "prettier --write",
};