const FLT_REGEX = /\.flt$/;

export const pluginFluent = () => ({
  name: "mdn-fluent-plugin",
  setup(api) {
    api.transform({ test: FLT_REGEX }, ({ code }) => {
      return ` const r = \`${code}\`; export default r;`;
    });
  },
});
