import { html, nothing } from "lit";

import bookmarkSvg from "../icon/bookmark.svg?lit";
import globeSvg from "../icon/globe.svg?lit";

import dividerSvg from "./divider.svg?lit";

import "./index.css";

/**
 * @param {Fred.Context} context
 */
export function BreadCrumbs(context) {
  const isDoc = context.renderer === "Doc";
  const colorScheme = context.renderer === "Homepage" ? "dark" : "";

  const path = isDoc
    ? html`
        <ul class="breadcrumbs__path">
          ${context.doc.parents.map(
            ({ uri, title }, index) => html`
              <li>
                ${index > 0 ? dividerSvg : nothing}
                <a href=${uri}>${title}</a>
              </li>
            `,
          )}
        </ul>
      `
    : nothing;

  return html`
    <div class="breadcrumbs" data-scheme=${colorScheme}>
      ${path}
      <mdn-color-theme></mdn-color-theme>
      <button class="breadcrumbs__component">${bookmarkSvg} Save</button>
      <button class="breadcrumbs__component">${globeSvg} English (US)</button>
    </div>
  `;
}
