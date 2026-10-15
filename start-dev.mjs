
import { MongoMemoryServer } from "mongodb-memory-server";
import { pathToFileURL } from "url";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cachedBinary = `${process.env.USERPROFILE}\\.cache\\mongodb-binaries\\mongod-x64-win32-8.2.6.exe`;
if (process.env.MONGOMS_SYSTEM_BINARY || fs.existsSync(cachedBinary)) {
  process.env.MONGOMS_SYSTEM_BINARY = process.env.MONGOMS_SYSTEM_BINARY || cachedBinary;
}

console.log("⏳  Starting in-memory MongoDB...");
const mongod = await MongoMemoryServer.create({
  binary: { skipMD5: true },
  instance: { launchTimeout: 60000 },
});
const uri = mongod.getUri();
console.log("✅  In-memory MongoDB ready →", uri);

process.env.MONGO_URI   = uri;
process.env.JWT_SECRET  = process.env.JWT_SECRET  || "my_super_secret_key_12345";
process.env.PORT        = process.env.PORT         || "8000";

const entry = pathToFileURL(path.join(__dirname, "backend", "index.js")).href;
await import(entry);
