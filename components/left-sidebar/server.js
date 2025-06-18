import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { ServerComponent } from "../server/index.js";

export class LeftSidebar extends ServerComponent {
  /**
   * @param {import("@fred").Context<import("@rari").DocPage>} context
   */
  render(context) {
    const content = context?.doc?.sidebarHTML;

    if (!content) {
      return nothing;
    }

    return html`<nav class="left-sidebar">
      <mdn-sidebar-filter></mdn-sidebar-filter>
      <section class="left-sidebar--content">${unsafeHTML(content)}</section>
    </nav>`;
  }
}
