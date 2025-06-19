import { html } from "@lit-labs/ssr";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import inlineScript from "../../entry.inline.js?source&csp=true";
import Favicon from "../favicon/pure.js";
import { asyncLocalStorage } from "../server/async-local-storage.js";
import { ServerComponent } from "../server/index.js";

import { styleTagsForComponent, tagsFromManifest } from "./utils.js";

export class OuterLayout extends ServerComponent {
  /**
   * @param {import("@fred").Context} context
   * @param {import("lit-html").TemplateResult} markup
   */
  render(context, markup) {
    const {
      componentsUsed = new Set(),
      componentsWithStylesInHead = new Set(),
      compilationStats,
    } = asyncLocalStorage.getStore() || {};

    if (!compilationStats) {
      throw new Error("compilation stats missing");
    }

    let legacyTags;
    if (componentsUsed.has("legacy")) {
      componentsUsed.delete("legacy");
      legacyTags = Object.values(
        tagsFromManifest(compilationStats.legacy),
      ).flat();
    }

    const { scriptTags } = tagsFromManifest(compilationStats.client);
    const styleTags = ["global", ...componentsWithStylesInHead].flatMap(
      (component) => styleTagsForComponent(component, compilationStats.client),
    );

    // if you want to put some script inline, put it in entry.inline.js
    // and you'll get CSP generation: see the README
    return html`
      <!doctype html>
      <html
        lang="en"
        style="color-scheme: light dark;"
        data-renderer=${context.renderer}
      >
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          ${Favicon()} ${unsafeHTML(`<script>${inlineScript}</script>`)}
          ${styleTags} ${scriptTags} ${legacyTags}
          <title>${context.pageTitle || "MDN"}</title>
        </head>
        ${markup}
      </html>
    `;
  }
}
