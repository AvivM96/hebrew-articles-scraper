import {Site} from "../types/types";
import axios from 'axios';
import * as _ from 'lodash';
import {IArticle} from "../db/models/article";

export default abstract class WebsiteBaseArticleScraper {
    protected siteData: string = '';
    protected articleId: number = 0;

    constructor(maxArticleId: number) {
        this.articleId = maxArticleId;
    }

    public nextArticle(articleIndex?: number): string {
        this.articleId -= articleIndex || 1;
        return this.articleUrl;
    }

    public async loadContent(): Promise<void> {
        const response = await axios.get(this.articleUrl);
        this.siteData = response.data;
    }

    public setArticleStartIndex(articleStartIndex: number) {
        this.articleId -= articleStartIndex;
    }

    get isLoaded(): boolean {
        return _.isEmpty(this.siteData);
    }

    abstract get scrapingSite(): Site;
    abstract get siteUrl(): string;
    abstract get articleUrl(): string;

    abstract isContentValid(): boolean;
    abstract extractArticle(): Partial<IArticle>;

}