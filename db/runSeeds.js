import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SEEDS_DIR = "./db/seeds";

const files = fs.readdirSync(SEEDS_DIR).filter((f) => f.endsWith(".sql"));

for (let i = 0; i < files.length; i++) {
  console.log(`Running seed file ${files[i]}`);

  try {
    execSync(`psql -f ${path.join(SEEDS_DIR, files[i])}`);
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
}

console.log("All seed run");
