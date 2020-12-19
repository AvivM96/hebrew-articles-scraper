import WebsiteBaseArticleScraper from "../website-base-article-scraper";
import {Article, Site} from "../../types/types";
import cheerio from "cheerio";
import * as _ from "lodash";
import {isEnglish} from "../scraping-utils";

export default class CalcalistArticleScraper extends WebsiteBaseArticleScraper {
    extractArticle(): Article {
        const $ = cheerio.load(this.siteData);

        const title = $('.c-article-device__body h1').text();
        const summary = $('.c-article-device__body h2').text();


        const articleContent = $('.c-article-device__paragraph p:not([class])');

        let articleText = '';

        articleContent.each((index, section) => {
            const paragraph = $(section).text();

            if(!_.isEmpty(paragraph) && !isEnglish(paragraph)) {
                articleText += paragraph + '\n';
            }
        });

        return {
            id: `calcalist-${this.articleId}`,
            title,
            summary,
            content: articleText,
            site: this.scrapingSite
        };
    }

    isContentValid(): boolean {
        const $ = cheerio.load(this.siteData);

        const title = $('.c-article-device__body h1').text();
        const summary = $('.c-article-device__body h2').text();

        return !(_.isEmpty(title) || _.isEmpty(summary));
    }

    get scrapingSite(): Site {
        return Site.Calcalist;
    }

    get articleUrl(): string {
        return `${this.siteUrl}${this.articleId}`;
    }

    get siteUrl(): string {
        return "https://m.calcalist.co.il/Article.aspx?guid=";
    }

}