/**
 * @this {import("@rspack/core").LoaderContext}
 * @param {string} contents
 */
function mdnsvgLoader(contents) {
  this?.cacheable?.();

  const callback = this.async();

  callback(
    null,
    `import { svg as s } from "lit-html"; const svg = s\`${contents}\`; export default svg;`,
  );
}

export default mdnsvgLoader;
