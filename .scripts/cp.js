#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: copy <source> <destination>');
  process.exit(1);
}

const source = args[0];
const destination = args[1];

const sourceBaseName = path.basename(source);
const targetPath = path.join(destination, sourceBaseName);

copyRecursiveSync(source, targetPath);
console.log(`Copied ${source} to ${targetPath}`);
