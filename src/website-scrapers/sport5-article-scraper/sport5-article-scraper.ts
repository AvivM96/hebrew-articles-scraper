import WebsiteBaseArticleScraper from "../website-base-article-scraper";
import {Site} from "../../types/types";
import {IArticle} from "../../db/models/article";

export default class Sport5ArticleScraper extends WebsiteBaseArticleScraper {
    get scrapingSite(): Site {
        return Site.Sport5;
    }

    extractArticle(): Partial<IArticle> {
        return {} as Partial<IArticle>;
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