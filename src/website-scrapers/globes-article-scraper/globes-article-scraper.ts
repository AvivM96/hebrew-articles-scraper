import WebsiteBaseArticleScraper from "../../website-scrapers/website-base-article-scraper";
import {IArticle} from "../../db/models/article";
import {ArticleTopic, Site} from "../../types/types";
import cheerio from "cheerio";
import * as _ from "lodash";
import {isEnglish} from "../../website-scrapers/scraping-utils";

export default class GlobesArticleScraper extends WebsiteBaseArticleScraper {
    extractArticle(): Partial<IArticle> {
        const $ = cheerio.load(this.siteData);

        const title = $('#F_Title').text();
        const summary = $('#coteret_SubCoteretText').text().replace(/•/g, "");

        const articleContent = $('.articleInner p');

        let articleText = '';

        articleContent.each((index, section) => {
            const paragraph = $(section).text();

            if(!_.isEmpty(paragraph) && !isEnglish(paragraph)) {
                articleText += paragraph + '\n';
            }
        });

        return {
            articleId: `globes-${this.articleId}`,
            title,
            summary,
            content: articleText,
            site: this.scrapingSite,
            topic: ArticleTopic.Economy
        };
    }

    isContentValid(): boolean {
        const $ = cheerio.load(this.siteData);

        const title = $('#F_Title').text();
        const summary = $('#coteret_SubCoteretText').text().replace(/•/g, "");

        return !(_.isEmpty(title) || _.isEmpty(summary));
    }

    get scrapingSite(): Site {
        return Site.Globes;
    }

    get articleUrl(): string {
        return `${this.siteUrl}${this.articleId}`;
    }

    get siteUrl(): string {
        return "https://www.globes.co.il/news/article.aspx?did=";
    }

}