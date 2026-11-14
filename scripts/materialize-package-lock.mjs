import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { gunzipSync } from "node:zlib";
const parts = [1,2,3,4].map((n) =>
  readFileSync(`.sheetforge-build/package-lock.json.gz.b64.${n}`, "utf8")
);
const buf = gunzipSync(Buffer.from(parts.join(""), "base64"));
writeFileSync("package-lock.json", buf);
try { rmSync(".sheetforge-build", { recursive: true, force: true }); } catch {}
console.log("Wrote package-lock.json", buf.length, "bytes");
