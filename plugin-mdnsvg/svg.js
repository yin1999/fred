import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SVG_REGEX = /\.svg$/;

/** @returns {import("@rsbuild/core").RsbuildPlugin} */
export const pluginSvg = () => ({
  name: "mdn-svg-plugin",
  setup(api) {
    api.modifyBundlerChain(async (chain, { CHAIN_ID, environment }) => {
      const { config } = environment;
      const { dataUriLimit } = config.output;
      const maxSize =
        typeof dataUriLimit === "number" ? dataUriLimit : dataUriLimit.svg;

      let generatorOptions = {};

      if (chain.module.rules.has(CHAIN_ID.RULE.SVG)) {
        generatorOptions = chain.module.rules
          .get(CHAIN_ID.RULE.SVG)
          .oneOfs.get(CHAIN_ID.ONE_OF.SVG_URL)
          .get("generator");

        // delete Rsbuild builtin SVG rules
        chain.module.rules.delete(CHAIN_ID.RULE.SVG);
      }

      const rule = chain.module.rule(CHAIN_ID.RULE.SVG).test(SVG_REGEX); // force to url: "foo.svg?url",
      rule
        .oneOf(CHAIN_ID.ONE_OF.SVG_URL)
        .type("asset/resource")
        .resourceQuery(/(__inline=false|url)/)
        .set("generator", generatorOptions);

      // force to inline: "foo.svg?inline"
      rule
        .oneOf(CHAIN_ID.ONE_OF.SVG_INLINE)
        .type("asset/inline")
        .resourceQuery(/inline/);

      rule
        .oneOf("mdn-svg")
        .type("javascript/auto")
        .resourceQuery(/mdnsvg/)
        .use("mdn-svg")
        .loader(path.resolve(__dirname, "./loader.js"))
        .end();

      // SVG as assets
      rule
        .oneOf(CHAIN_ID.ONE_OF.SVG_ASSET)
        .type("asset")
        .parser({
          // Inline SVG if size < maxSize
          dataUrlCondition: {
            maxSize,
          },
        })
        .set("generator", generatorOptions);
    });
  },
});
