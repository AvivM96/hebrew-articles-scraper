export type Article = {
    id: string;
    title: string;
    summary: string;
    content: string;
    site: Site;
    topic?: ArticleTopic;
}

export enum ArticleTopic {
    Economy = "Economy"
}

export enum Site {
    Walla = "Walla",
    Sport5 = "Sport5",
    Calcalist = "Calcalist"
}