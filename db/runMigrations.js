import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const MIGRATIONS_DIR = "./db/migrations";

const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));

for (let i = 0; i < files.length; i++) {
  console.log(`Running migration file ${files[i]}`);

  try {
    execSync(`psql -f ${path.join(MIGRATIONS_DIR, files[i])}`);
  } catch (e) {
    console.error(e);

    process.exit(1);
  }
}

console.log("All migrations run");
