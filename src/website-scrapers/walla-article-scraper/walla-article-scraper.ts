import WebsiteBaseArticleScraper from "../website-base-article-scraper";
import {Article, Site} from "../../types/types";
import cheerio from 'cheerio';
import * as _ from 'lodash';
import {isEnglish} from "../scraping-utils";

export default class WallaArticleScraper extends WebsiteBaseArticleScraper {
    get scrapingSite(): Site {
        return Site.Walla;
    }

    extractArticle(): Article {
        const $ = cheerio.load(this.siteData);

        const title = $('.item-main-content header h1').text();
        const summary = $('.item-main-content header h2').text();

        const articleContent = $('.article-content section');

        let articleText = '';

        articleContent.each((index, section) => {
            const paragraph = $(section).find('div p').text();

            if(!_.isEmpty(paragraph) && !isEnglish(paragraph)) {
                articleText += paragraph + '\n';
            }
        });

        return {
            id: `walla-${this.articleId}`,
            title,
            summary,
            content: articleText,
            site: this.scrapingSite
        };
    }

    isContentValid(): boolean {
        const $ = cheerio.load(this.siteData);

        const title = $('.item-main-content header h1').text();
        const summary = $('.item-main-content header h2').text();

        return !(_.isEmpty(title) || _.isEmpty(summary));
    }

    get siteUrl(): string {
        return 'https://ourbusiness.walla.co.il/item';
    }

    get articleUrl(): string {
        return `${this.siteUrl}/${this.articleId}`;
    }
}