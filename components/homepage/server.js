import { html } from "lit";

import { FeaturedArticles } from "../featured-articles/server.js";
import { HomepageHeader } from "../homepage-header/server.js";
import { LatestNews } from "../latest-news/server.js";
import { PageLayout } from "../page-layout/server.js";
import { RecentContributions } from "../recent-contributions/server.js";
import { ServerComponent } from "../server/index.js";

export class Homepage extends ServerComponent {
  /**
   * @param {import("@fred").Context<import("@rari").HomePage>} context
   */
  render(context) {
    return PageLayout.render(
      context,
      html`
        <div class="homepage homepage--dark">
          ${HomepageHeader.render(context)}
        </div>
        <div class="homepage">
          <mdn-placement-hp-main></mdn-placement-hp-main>
          <section class="homepage__section">
            <h2>${context.l10n`Featured articles`}</h2>
            ${FeaturedArticles.render(context.hyData.featuredArticles)}
          </section>
          <section class="homepage__section">
            <h2>${context.l10n`Latest news`}</h2>
            ${LatestNews.render(
              context.hyData.latestNews.items,
              context.locale,
            )}
          </section>
          <section class="homepage__section">
            <h2>${context.l10n`Recent contributions`}</h2>
            ${RecentContributions.render(
              context.hyData.recentContributions.items,
              context.locale,
            )}
          </section>
        </div>
      `,
    );
  }
}
