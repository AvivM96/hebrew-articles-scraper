import {Article, Site} from "../types/types";
import axios from 'axios';
import * as _ from 'lodash';

export default abstract class WebsiteBaseArticleScraper {
    protected siteData: string = '';
    protected articleId: number = 0;

    constructor(maxArticleId: number) {
        this.articleId = maxArticleId;
    }

    public nextArticle() {
        this.articleId -= 1;
    }

    public async loadContent(): Promise<void> {
        const response = await axios.get(this.articleUrl);
        this.siteData = response.data;
    }

    get isLoaded(): boolean {
        return _.isEmpty(this.siteData);
    }

    abstract get scrapingSite(): Site;
    abstract get siteUrl(): string;
    abstract get articleUrl(): string;

    abstract isContentValid(): boolean;
    abstract extractArticle(): Article;

}