import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const storyPath = new URL("../app/story/page.tsx", import.meta.url);
const stylesPath = new URL("../app/globals.css", import.meta.url);
const storyStylesPath = new URL("../app/story/story.module.css", import.meta.url);
const productsDirectory = new URL("../public/products/", import.meta.url);
const gloveOutputPath = new URL("../public/products/specter-gloves-leather.webp", import.meta.url);
const cassockOutputPath = new URL("../public/products/ghost-cassock-hd-v3.webp", import.meta.url);
const EXPECTED_CASSOCK_BYTES = 55470;
const EXPECTED_CASSOCK_SHA256 = "f8300f6ee123262b07aafd13cc2255d0912744856891a88a4e73195062dd92ef";

const gloveChunkPaths = [0, 1, 2, 3, 4].map((index) =>
  new URL(`../assets/specter-gloves/part-${String(index).padStart(2, "0")}.txt`, import.meta.url),
);

const cassockChunkNames = [
  "part-00.txt",
  "part-01-00.txt",
  "part-01-01.txt",
  "part-01-02.txt",
  "part-01-03.txt",
  "part-01-04.txt",
  "part-01-05.txt",
  "part-02-00.txt",
  "part-02-01.txt",
  "part-02-02.txt",
  "part-02-03.txt",
  "part-02-04.txt",
  "part-02-05.txt",
  "part-03-00.txt",
  "part-03-01.txt",
  "part-03-02.txt",
  "part-03-03.txt",
  "part-03-04.txt",
  "part-03-05.txt",
];
const cassockChunkPaths = cassockChunkNames.map(
  (name) => new URL(`../assets/ghost-cassock-hd/${name}`, import.meta.url),
);

async function decodeChunks(chunkPaths) {
  const encodedImage = (
    await Promise.all(chunkPaths.map((path) => readFile(path, "utf8")))
  ).join("").trim();
  return Buffer.from(encodedImage, "base64");
}

await mkdir(productsDirectory, { recursive: true });
const [gloveImage, cassockImage] = await Promise.all([
  decodeChunks(gloveChunkPaths),
  decodeChunks(cassockChunkPaths),
]);

const cassockHash = createHash("sha256").update(cassockImage).digest("hex");
if (cassockImage.length !== EXPECTED_CASSOCK_BYTES || cassockHash !== EXPECTED_CASSOCK_SHA256) {
  throw new Error(`Ghost Cassock HD verification failed: ${cassockImage.length} bytes / ${cassockHash}`);
}

await Promise.all([
  writeFile(gloveOutputPath, gloveImage),
  writeFile(cassockOutputPath, cassockImage),
]);

// The cache-busted HD filename prevents browsers from reusing any earlier,
// heavily compressed Ghost Cassock image.
const pageOriginal = await readFile(pagePath, "utf8");
const pageUpdated = pageOriginal
  .replace(/^\s*gallery:\s*\[[^\n]*\],\s*$/gm, "")
  .replaceAll("/products/specter-gloves-leather.png", "/products/specter-gloves-leather.webp")
  .replaceAll("/products/male-ghost-cassock.png", "/products/ghost-cassock-hd-v3.webp")
  .replaceAll("/products/ghost-cassock.webp", "/products/ghost-cassock-hd-v3.webp")
  .replaceAll("/products/ghost-cassock-hd-v2.webp", "/products/ghost-cassock-hd-v3.webp");

if (pageUpdated !== pageOriginal) {
  await writeFile(pagePath, pageUpdated);
}

const storyOriginal = await readFile(storyPath, "utf8");
const storyUpdated = storyOriginal
  .replaceAll("/products/specter-gloves-leather.png", "/products/specter-gloves-leather.webp")
  .replaceAll("/products/male-ghost-cassock.png", "/products/ghost-cassock-hd-v3.webp")
  .replaceAll("/products/ghost-cassock.webp", "/products/ghost-cassock-hd-v3.webp")
  .replaceAll("/products/ghost-cassock-hd-v2.webp", "/products/ghost-cassock-hd-v3.webp");

if (storyUpdated !== storyOriginal) {
  await writeFile(storyPath, storyUpdated);
}

const responsiveMarker = "/* PRODUCT_IMAGES_HD_V3 */";
const responsiveStyles = `
${responsiveMarker}
.product-image img,
.modal-image-stage img,
.search-results img,
.cart-line img,
.secure-purchase-line img,
.ghost-line-grid img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  image-rendering: auto;
}

img[src$="ghost-cassock-hd-v3.webp"] {
  image-rendering: auto;
  object-position: 50% 34%;
  filter: none;
}

.ghost-line-grid img[src$="ghost-cassock-hd-v3.webp"] {
  mix-blend-mode: normal;
  filter: none;
}

@media (max-width: 720px) {
  .modal-image-stage img[src$="ghost-cassock-hd-v3.webp"] {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 76svh;
    margin-inline: auto;
    object-fit: contain;
    object-position: center;
  }

  .ghost-line-grid img[src$="ghost-cassock-hd-v3.webp"] {
    min-height: 0;
    object-fit: cover;
    object-position: 50% 30%;
  }
}
`;

const stylesOriginal = await readFile(stylesPath, "utf8");
if (!stylesOriginal.includes(responsiveMarker)) {
  await writeFile(stylesPath, `${stylesOriginal.trimEnd()}\n\n${responsiveStyles}`);
}

const storyResponsiveMarker = "/* STORY_PRODUCT_IMAGES_HD_V3 */";
const storyResponsiveStyles = `
${storyResponsiveMarker}
.productGrid img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  image-rendering: auto;
}
`;

const storyStylesOriginal = await readFile(storyStylesPath, "utf8");
if (!storyStylesOriginal.includes(storyResponsiveMarker)) {
  await writeFile(storyStylesPath, `${storyStylesOriginal.trimEnd()}\n\n${storyResponsiveStyles}`);
}

console.log(`Verified Ghost Cassock HD: ${cassockImage.length} bytes / ${cassockHash}`);
