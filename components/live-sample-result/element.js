import { LitElement, html } from "lit";

import { styleMap } from "lit/directives/style-map.js";

import styles from "./element.css?lit";
import "../play-runner/element.js";

export class MDNLiveSampleResult extends LitElement {
  static styles = styles;

  static properties = {
    liveId: { attribute: "live-id" },
    code: { type: Object },
    allowed: {},
    sandbox: {},
    srcPrefix: { attribute: "src-prefix" },
    height: {},
  };

  constructor() {
    super();
    /** @type {string | undefined} */
    this.liveId = undefined;
    this.code = {};
    /** @type {string | undefined} */
    this.allow = undefined;
    /** @type {string | undefined} */
    this.sandbox = undefined;
    /** @type {string | undefined} */
    this.srcPrefix = undefined;
    /** @type {string | undefined} */
    this.height = undefined;
  }

  _openFullscreen(replace = false) {
    if (this._runnerSrc) {
      if (replace || this._fullscreenReplace) {
        location.replace(this._runnerSrc);
      } else {
        location.href = this._runnerSrc;
      }
    } else {
      this._fullscreenPending = true;
      if (replace) {
        this._fullscreenReplace = true;
      }
    }
  }

  /** @param {MouseEvent} event */
  _fullscreenClick(event) {
    if (
      this.liveId &&
      event.target instanceof HTMLAnchorElement &&
      event.target.hash === `#livesample_fullscreen=${this.liveId}`
    ) {
      event.preventDefault();
      this._openFullscreen();
    }
  }

  /** @param {CustomEvent<string>} event */
  _runnerSrcUpdated({ detail }) {
    this._runnerSrc = detail;
    if (this._fullscreenPending) {
      this._openFullscreen();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._fullscreenClick = this._fullscreenClick.bind(this);
    document.addEventListener("click", this._fullscreenClick);
    if (location.hash === `#livesample_fullscreen=${this.liveId}`) {
      this._openFullscreen();
    }
  }

  render() {
    return html`
      <div class="code-example">
        <div class="example-header"></div>
        <mdn-play-runner
          @mdn-play-runner-src=${this._runnerSrcUpdated}
          .code=${this.code}
          .allow=${this.allow}
          .sandbox=${this.sandbox}
          .srcPrefix=${this.srcPrefix}
          style=${styleMap({
            height: this.height ? this.height + "px" : undefined,
          })}
        ></mdn-play-runner>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._fullscreenClick);
  }
}

customElements.define("mdn-live-sample-result", MDNLiveSampleResult);
