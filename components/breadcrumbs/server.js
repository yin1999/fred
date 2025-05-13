import { html, nothing } from "lit";

import { ServerComponent } from "../server/index.js";

import dividerSvg from "./divider.svg?lit";

export class Breadcrumbs extends ServerComponent {
  /**
   * @param {Fred.Context} context
   */
  render(context) {
    if (context.renderer !== "Doc") {
      return nothing;
    }

    return html`
      <ul class="breadcrumbs">
        ${context.doc.parents.map(
          ({ uri, title }, index) => html`
            <li>
              ${index > 0 ? dividerSvg : nothing}
              <a href=${uri}>${title}</a>
            </li>
          `,
        )}
      </ul>
    `;
  }
}
