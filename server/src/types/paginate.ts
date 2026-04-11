export type PaginatedArgs = {
    page: number;
    limit: number;
    where?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: Record<string, any>;
};

export interface PaginatedQuery {
    page: string;
    limit: string;
    term: string;
    filterBy: string[];
    include: string;
    orderBy: string;
    where: string;
}

export interface PaginatedCategoriesQuery {
    page: string;
    limit: string;
    term: string;
}
