import {Site} from "./types/types";
import WebsiteBaseArticleScraper from "./website-scrapers/website-base-article-scraper";
import WallaArticleScraper from "./website-scrapers/walla-article-scraper/walla-article-scraper";
import Sport5ArticleScraper from "./website-scrapers/sport5-article-scraper/sport5-article-scraper";
import * as _ from 'lodash';
import CalcalistArticleScraper from "./website-scrapers/calcalist-article-scraper/calcalist-article-scraper";
import {IArticle} from "./db/models/article";
import GlobesArticleScraper from "./website-scrapers/globes-article-scraper/globes-article-scraper";

export type ArticleCollectOptions = Partial<{
    count: number;
    maxAttempts: number;
    sites: Site[];
    page?: number;
}>

const ArticleScrapers = new Map<Site, WebsiteBaseArticleScraper>([
    [Site.Walla, new WallaArticleScraper(3402535)],
    [Site.Sport5, new Sport5ArticleScraper(3402534)],
    [Site.Calcalist, new CalcalistArticleScraper(3894592)],
    [Site.Globes, new GlobesArticleScraper(1001361275)],
])

const sleep = async (seconds: number) => new Promise((resolve, reject) => setTimeout(() => resolve(0), 1000 * seconds));

export default class ArticleDataCollector {
    private static get logPrefix() {
        return 'ArticleDataCollector';
    }

    public static async collect(options: ArticleCollectOptions = {}): Promise<Partial<IArticle>[]> {
        const sites = options.sites || [];
        const scrapers = sites?.map(site => ArticleScrapers.get(site)) as WebsiteBaseArticleScraper[];
        const articles = await Promise.all(scrapers.map(scraper => this.collectArticlesFromSite(scraper, options)))
        return _.flatMap(articles);
    }

    private static async collectArticlesFromSite(scraper: WebsiteBaseArticleScraper, { count = 10, maxAttempts = 100, page = 1 }: ArticleCollectOptions): Promise<Partial<IArticle>[]> {
        const logPrefix = `${this.logPrefix} collectArticlesFromSite`;

        try {
            let articlesCollected: Partial<IArticle>[] = [];
            let attempts = 0;

            const articleStartIndex = Math.max(0, page - 1) * count;
            scraper.setArticleStartIndex(articleStartIndex);

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

                await sleep(2);

                articlesCollected = [...articlesCollected, ..._.compact(articles)];

                console.log(`${logPrefix} collected ${articlesCollected.length}`);
            }

            return articlesCollected;
        } catch (error) {
            console.error('Failed to scraper requested site', error);
            throw error
        }
    }
}