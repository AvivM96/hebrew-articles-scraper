import mongoose from "mongoose";

export default class Database {
    public static async connect() {
        await mongoose.connect('mongodb://localhost/articles_database3', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }
}