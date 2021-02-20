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

    for (let page = 178; page <= 10000; page ++) {
        const articles = await ArticleDataCollector.collect({count: 50, maxAttempts: 5000, page, sites: [Site.Calcalist]});
        console.log(`${logPrefix} collected page: ${page}`);

        console.time('savingDB');
        await Article.collection.insertMany(articles.filter(article => !_.isEmpty(article.content)));
        console.timeEnd('savingDB');
    }

    console.timeEnd('scraping');
})();

