const FLT_REGEX = /\.flt$/;

/** @returns {import("@rsbuild/core").RsbuildPlugin} */
export const pluginFluent = () => ({
  name: "mdn-fluent-plugin",
  setup(api) {
    api.transform({ test: FLT_REGEX }, ({ code }) => {
      return ` const r = \`${code}\`; export default r;`;
    });
  },
});
