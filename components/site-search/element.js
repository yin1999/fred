import { Task } from "@lit/task";
import { LitElement, html } from "lit";

import { L10nMixin } from "../../l10n/mixin.js";

import styles from "./element.css?lit";
export class MDNSiteSearch extends L10nMixin(LitElement) {
  static styles = styles;

  static properties = {
    _query: { state: true },
    _page: { state: true },
  };

  constructor() {
    super();
    /** @type {string | undefined} */
    this._query = undefined;
    /** @type {string} */
    this._sort = "";
    this._page = 1;
  }

  _searchTask = new Task(this, {
    args: () => [this._query, this._sort, this._page],
    task: async ([query, sort, page], { signal }) => {
      if (!query) {
        return;
      }
      const params = new URLSearchParams({
        q: query,
        sort,
        page: page.toString(),
      });
      const res = await fetch(`/api/v1/search?${params}`, { signal });
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      return /** @type {Promise<import("./types.js").SearchResponse>} */ (
        res.json()
      );
    },
  });

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(location.search);
    this._query = params.get("q") || undefined;
    this._sort = params.get("sort") || "best";
    const page = params.get("page");
    if (page) {
      this._page = Number.parseInt(page, 10);
    }
  }

  render() {
    /** @type {[string, string][]} */
    const SORT_OPTIONS = [
      ["best", this.l10n`Best`],
      ["relevance", this.l10n`Relevance`],
      ["popularity", this.l10n`Popularity`],
    ];

    return this._searchTask.render({
      complete: (results) =>
        results
          ? html`<h1>
                ${this.l10n.raw({
                  id: "search_title",
                  args: {
                    query: this._query,
                  },
                })}
              </h1>
              <section class="site-search__options">
                <h2>${this.l10n`Sort by`}</h2>
                <ul>
                ${SORT_OPTIONS.map(([sort, label]) => {
                  if (this._sort === sort) {
                    return html`<li><em>${label}</em></li>`;
                  } else {
                    const url = new URL(location.href);
                    url.searchParams.set("sort", sort);
                    return html`<li><a href=${url}>${label}</a></li>`;
                  }
                })}
                </ul>
              </section>
              <section class="site-search__results">
                <h2>${this.l10n`Results`}</h2>
                ${this.l10n.raw({
                  id: "search_stats",
                  args: {
                    results: results.metadata.total.value,
                    time: results.metadata.took_ms,
                  },
                })}
                <ul>
                  ${results.documents.map(
                    (result) =>
                      html`<li>
                        <article>
                          <h2><a href=${result.mdn_url}>${result.title}</a></h2>
                          <p>${result.summary}</p>
                        </article>
                      </li>`,
                  )}
                </ul>
                </div>`
          : "No results!",
      error: (e) => html`Error: ${e}`,
    });
  }
}

customElements.define("mdn-site-search", MDNSiteSearch);
