import ArticleDataCollector from "./article-data-collector";
import {Site} from "./types/types";
import Database from "./db/database";
import {Article} from "./db/models/article";
import * as _ from 'lodash';

(async function main() {
    const logPrefix = 'HebrewArticlesScraper main';
    console.log(`${logPrefix} starting scrapers`);
    console.time('scraping');

    await Database.connect();

    for (let page = 1; page <= 100000; page ++) {
        const articles = await ArticleDataCollector.collect({count: 50, maxAttempts: 5000, page, sites: [Site.Globes]});
        console.log(`${logPrefix} collected page: ${page}`);

        try {
            console.time('savingDB');
            await Article.collection.insertMany(articles.filter(article => !_.isEmpty(article.content)));
            console.timeEnd('savingDB');
        } catch (e) {
            console.error()
        }
    }

    console.timeEnd('scraping');
})();

