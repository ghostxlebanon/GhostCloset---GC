import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const original = await readFile(pagePath, "utf8");

// Product cards and product dialogs must use only the primary `image` field.
// Remove every optional gallery declaration before the production build.
const updated = original.replace(/^\s*gallery:\s*\[[^\n]*\],\s*$/gm, "");

if (updated !== original) {
  await writeFile(pagePath, updated);
  console.log("Removed secondary product images; primary images only.");
} else {
  console.log("Products already use primary images only.");
}
