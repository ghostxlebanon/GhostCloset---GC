import { mkdir, readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
const storyPath = new URL("../app/story/page.tsx", import.meta.url);
const stylesPath = new URL("../app/globals.css", import.meta.url);
const storyStylesPath = new URL("../app/story/story.module.css", import.meta.url);
const productsDirectory = new URL("../public/products/", import.meta.url);
const gloveOutputPath = new URL("../public/products/specter-gloves-leather.webp", import.meta.url);
const cassockOutputPath = new URL("../public/products/ghost-cassock.webp", import.meta.url);

const gloveChunkPaths = [0, 1, 2, 3, 4].map((index) =>
  new URL(`../assets/specter-gloves/part-${String(index).padStart(2, "0")}.txt`, import.meta.url),
);
const cassockChunkPaths = [0, 1, 2].map((index) =>
  new URL(`../assets/ghost-cassock/part-${String(index).padStart(2, "0")}.txt`, import.meta.url),
);

async function restoreImage(chunkPaths, outputPath) {
  const encodedImage = (
    await Promise.all(chunkPaths.map((path) => readFile(path, "utf8")))
  ).join("").trim();
  await writeFile(outputPath, Buffer.from(encodedImage, "base64"));
}

await mkdir(productsDirectory, { recursive: true });
await Promise.all([
  restoreImage(gloveChunkPaths, gloveOutputPath),
  restoreImage(cassockChunkPaths, cassockOutputPath),
]);

// Product cards and dialogs use only the primary image. Uploaded replacement
// photos are restored during the static build and used everywhere on the site.
const pageOriginal = await readFile(pagePath, "utf8");
const pageUpdated = pageOriginal
  .replace(/^\s*gallery:\s*\[[^\n]*\],\s*$/gm, "")
  .replaceAll("/products/specter-gloves-leather.png", "/products/specter-gloves-leather.webp")
  .replaceAll("/products/male-ghost-cassock.png", "/products/ghost-cassock.webp");

if (pageUpdated !== pageOriginal) {
  await writeFile(pagePath, pageUpdated);
}

const storyOriginal = await readFile(storyPath, "utf8");
const storyUpdated = storyOriginal
  .replaceAll("/products/specter-gloves-leather.png", "/products/specter-gloves-leather.webp")
  .replaceAll("/products/male-ghost-cassock.png", "/products/ghost-cassock.webp");

if (storyUpdated !== storyOriginal) {
  await writeFile(storyPath, storyUpdated);
}

const responsiveMarker = "/* PRODUCT_IMAGES_RESPONSIVE */";
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
}

@media (max-width: 720px) {
  .modal-image-stage img {
    height: auto;
    max-height: 70svh;
    object-fit: contain;
    object-position: center;
  }

  .ghost-line-grid img {
    min-height: 0;
    object-fit: cover;
    object-position: 50% 35%;
  }
}
`;

const stylesOriginal = await readFile(stylesPath, "utf8");
if (!stylesOriginal.includes(responsiveMarker)) {
  await writeFile(stylesPath, `${stylesOriginal.trimEnd()}\n\n${responsiveStyles}`);
}

const storyResponsiveMarker = "/* STORY_PRODUCT_IMAGES_RESPONSIVE */";
const storyResponsiveStyles = `
${storyResponsiveMarker}
.productGrid img {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
`;

const storyStylesOriginal = await readFile(storyStylesPath, "utf8");
if (!storyStylesOriginal.includes(storyResponsiveMarker)) {
  await writeFile(storyStylesPath, `${storyStylesOriginal.trimEnd()}\n\n${storyResponsiveStyles}`);
}

console.log("Installed responsive Ghost Cassock and Specter Gloves replacement images.");
