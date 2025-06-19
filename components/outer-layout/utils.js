import { html } from "@lit-labs/ssr";

import { toCamelCase } from "../../build/utils.js";

/**
 * @param {import("@rspack/core").StatsCompilation} manifest
 * @param {string} [entry]
 */
export function tagsFromManifest(manifest, entry = "index") {
  const publicPath = manifest.publicPath;
  if (!publicPath) {
    throw new Error("publicPath is not defined in manifest");
  }

  const scriptTags = [];
  const styleTags = [];

  for (const { name } of manifest.entrypoints?.[entry]?.assets || []) {
    if (name.endsWith(".js")) {
      scriptTags.push(
        html`<script src=${publicPath + name} type="module"></script>`,
      );
    } else if (name.endsWith(".css")) {
      styleTags.push(html`<link rel="stylesheet" href=${publicPath + name} />`);
    }
  }

  return { scriptTags, styleTags };
}

/**
 * @param {string} component
 * @param {import("@rspack/core").StatsCompilation} manifest
 */
export function styleTagsForComponent(component, manifest) {
  return tagsFromManifest(manifest, `styles-${toCamelCase(component)}`)
    .styleTags;
}
