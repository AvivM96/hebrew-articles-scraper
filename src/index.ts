import ArticleDataCollector from "./article-data-collector";
import {Site} from "./types/types";

(async function main() {
    const logPrefix = 'HebrewArticlesScraper main';
    console.log(`${logPrefix} starting scrapers`);
    const articles = await ArticleDataCollector.collect({count: 50, maxAttempts: 1000, sites: [Site.Walla]});
    console.log(`${logPrefix} scrapers finished with ${articles.length} articles`);
})();

