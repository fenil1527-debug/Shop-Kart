// start-dev.mjs
// Boots the real backend with an in-memory MongoDB — no Atlas needed.
// Run: node start-dev.mjs

import { MongoMemoryServer } from "mongodb-memory-server";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tell mongodb-memory-server exactly where the binary lives
process.env.MONGOMS_SYSTEM_BINARY =
  process.env.MONGOMS_SYSTEM_BINARY ||
  `${process.env.USERPROFILE}\\.cache\\mongodb-binaries\\mongod-x64-win32-8.2.6.exe`;

console.log("⏳  Starting in-memory MongoDB...");
const mongod = await MongoMemoryServer.create({
  binary: { skipMD5: true },
});
const uri = mongod.getUri();
console.log("✅  In-memory MongoDB ready →", uri);

// Patch env so backend picks it up
process.env.MONGO_URI   = uri;
process.env.JWT_SECRET  = process.env.JWT_SECRET  || "my_super_secret_key_12345";
process.env.PORT        = process.env.PORT         || "8000";

// Boot real backend
const entry = pathToFileURL(path.join(__dirname, "backend", "index.js")).href;
await import(entry);
