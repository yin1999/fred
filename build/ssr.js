import { readFile, writeFile } from "node:fs/promises";

import { fdir } from "fdir";

import ssr from "../dist/ssr/index.cjs";
import { renderHTML } from "./utils.js";

const BUILD_OUT_ROOT = "./out"

const ssrManifest = await readFile(
  "./dist/ssr/manifest.json",
  "utf-8",
);
const clientManifest = await readFile(
  "./dist/client/manifest.json",
  "utf-8",
);

/**
 * @template T
 * @param {T[]} array 
 * @param {number} size 
 * @returns {Generator<T[]>}
 */
export function* chunks(array, size) {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

export async function ssrAllDocuments() {
  const files = await findDocuments();

  const renderedFiles = [];
  for (const chunk of chunks(files, 1000)) {
    const out = await Promise.all(chunk.map(ssrSingleDocument).filter(Boolean));
    renderedFiles.push(...out);
  }
}

async function findDocuments() {
  const api = new fdir()
    .withFullPaths()
    .withErrors()
    .filter(
      (filePath) => filePath.includes("/en-us/docs/") &&
        filePath.endsWith("index.json")
    )
    .crawl(BUILD_OUT_ROOT);
  const docs = await api.withPromise();
  return docs;
}

/**
 * @param {string} file 
 * @returns {Promise<string | undefined>}
 */
async function ssrSingleDocument(file) {
  const context = JSON.parse(await readFile(file, "utf-8"));
  if (!context?.url) {
    console.warn(
      `WARNING: Skipped rendering HTML. Document is missing url: ${file}`
    );
    return;
  }
  const markup = await ssr.renderWithContext(context);
  const html = renderHTML(ssrManifest, clientManifest, false, markup);
  const outputFile = file.replace(/.json$/, ".html");
  await writeFile(outputFile, html);
  return outputFile;
}

ssrAllDocuments();