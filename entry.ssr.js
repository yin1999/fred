import { render as r } from "@lit-labs/ssr";
import { DocBody } from "./pages/doc/index.js";
import { collectResult } from "@lit-labs/ssr/lib/render-result.js";
import { SettingsBody } from "./pages/settings/index.js";
import l10n from "./fluent.js";

/**
 * @param {string} path
 * @returns {Promise<Fred.Context<Rari.DocPage>>}
 */
async function fetch_from_rari(path) {
  const external_url = `http://localhost:8083${path}`;
  console.log(`using ${external_url}`);
  return await (await fetch(external_url)).json();
}

/**
 * @param {string} path 
 */
export async function render(path) {
  let result;
  if (path.endsWith("settings")) {
    result = r(SettingsBody());
  } else {
    const context = await fetch_from_rari(path);
    context.l10n = await l10n(context.locale);
    console.log("context", context.url);
    result = r(DocBody(context));
  }
  return await collectResult(result);
}

/**
 * @param {Rari.BuiltPage} context 
 */
export async function renderWithContext(context) {
  context.l10n = await l10n(context.locale);
  const result = r(DocBody(context));
  return await collectResult(result);
}
