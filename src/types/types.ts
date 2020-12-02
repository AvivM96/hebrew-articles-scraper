export type Article = {
    id: string;
    title: string;
    summary: string;
    content: string;
    site: Site;
}

export enum Site {
    Walla = "Walla",
    Sport5 = "Sport5"
}