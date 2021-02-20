import {ArticleTopic, Site} from "../../types/types";
import {Schema, Document, Model, model} from "mongoose";

export interface IArticle extends Document {
    articleId: string;
    title: string;
    summary: string;
    content: string;
    site: Site;
    topic?: ArticleTopic;
}

const ArticleSchema: Schema = new Schema({
    articleId: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    site: { type: Site, required: true },
    topic: { type: ArticleTopic, required: true },
})

export const Article: Model<IArticle> = model('Article', ArticleSchema);
