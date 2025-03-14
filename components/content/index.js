import { html } from "lit-html";
import { unsafeStatic, html as hh } from "lit-html/static.js";

import { Heading } from "../heading-anchor/index.js";

import "./index.css";

export function Content(context) {
  return html`<div class="content">
    <h1>${context?.doc?.title}</h1>
    ${context?.doc?.body.map((section) => Section(section))}
  </div>`;
}

function Section({ type, value }) {
  switch (type) {
    case "browser_compatibility":
      return BCD(value);
    default:
      return Prose(value);
  }
}

function Prose({ id, title, content, isH3 }) {
  const level = isH3 ? 3 : 2;
  return hh`<section aria-labelledby="${id}">
    ${Heading(level, id, title)} ${unsafeStatic(content)}
  </section>`;
}

function BCD({ id, title, query, isH3 }) {
  const level = isH3 ? 3 : 2;
  return hh`<section aria-labelledby="${id}">
    ${Heading(level, id, title)} <bcd-table query="${query}"></bcd-table>
  </section>`;
}
