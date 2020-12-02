import WebsiteBaseArticleScraper from "../website-base-article-scraper";
import {Article, Site} from "../../types/types";

export default class Sport5ArticleScraper extends WebsiteBaseArticleScraper {
    get scrapingSite(): Site {
        return Site.Sport5;
    }

    extractArticle(): Article {
        return {} as Article;
    }

    isContentValid(): boolean {
        return false;
    }

    loadContent(): Promise<void> {
        return Promise.resolve(undefined);
    }

    get siteUrl(): string {
        return "";
    }

    get articleUrl(): string {
        return "";
    }
}