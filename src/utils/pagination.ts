export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const paginateResults = <T>(
    data: T[],
    options: PaginationOptions,
    total: number
): PaginatedResult<T> => {
    const { page, limit } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
        data: data.slice(startIndex, endIndex),
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};
