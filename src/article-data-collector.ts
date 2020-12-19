import {Article, Site} from "./types/types";
import WebsiteBaseArticleScraper from "./website-scrapers/website-base-article-scraper";
import WallaArticleScraper from "./website-scrapers/walla-article-scraper/walla-article-scraper";
import Sport5ArticleScraper from "./website-scrapers/sport5-article-scraper/sport5-article-scraper";
import * as _ from 'lodash';
import CalcalistArticleScraper from "./website-scrapers/calcalist-article-scraper/calcalist-article-scraper";

export type ArticleCollectOptions = Partial<{
    count: number;
    maxAttempts: number;
    sites: Site[]
}>

const ArticleScrapers = new Map<Site, WebsiteBaseArticleScraper>([
    [Site.Walla, new WallaArticleScraper(3402535)],
    [Site.Sport5, new Sport5ArticleScraper(3402534)],
    [Site.Calcalist, new CalcalistArticleScraper(3878333)],
])

export default class ArticleDataCollector {
    private static get logPrefix() {
        return 'ArticleDataCollector';
    }

    public static async collect(options: ArticleCollectOptions = {}): Promise<Article[]> {
        const sites = options.sites || [];
        const scrapers = sites?.map(site => ArticleScrapers.get(site)) as WebsiteBaseArticleScraper[];
        const articles = await Promise.all(scrapers.map(scraper => this.collectArticlesFromSite(scraper, options)))
        return _.flatMap(articles);
    }

    private static async collectArticlesFromSite(scraper: WebsiteBaseArticleScraper, { count = 10, maxAttempts = 100 }: ArticleCollectOptions): Promise<Article[]> {
        const logPrefix = `${this.logPrefix} collectArticlesFromSite`;

        try {
            let articlesCollected: Article[] = [];
            let attempts = 0;

            while (articlesCollected.length < count && attempts <= maxAttempts) {
                const articles = await Promise.all(_.times(count - articlesCollected.length, async () => {
                    const articleUrl = scraper.nextArticle();
                    attempts++;

                    try {
                        await scraper.loadContent();

                        if(!scraper.isContentValid()) {
                            console.log(`${logPrefix} ${articleUrl} content is not valid skipping to next page`);
                            return;
                        }

                        const article = scraper.extractArticle();
                        scraper.nextArticle();
                        return article;
                    } catch (error) {
                        console.log(`${logPrefix} Failed to get articleId ${articleUrl}`, error.message);
                    }
                }));

                articlesCollected = [...articlesCollected, ..._.compact(articles)];
            }

            return articlesCollected;
        } catch (error) {
            console.error('Failed to scraper requested site', error);
            throw error
        }
    }
}