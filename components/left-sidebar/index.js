import { unsafeStatic, html as hh } from "lit-html/static.js";

import "./index.css";

/**
 * @param {Fred.Context<Rari.DocPage>} context 
 */
export function LeftSidebar(context) {
  return hh`<nav class="left-sidebar">
    ${unsafeStatic(context?.doc?.sidebarHTML)}
  </nav>`;
}
