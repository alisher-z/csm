export type DBMessageType = {
    message: string,
    status: number
};

export type DBResultType =
    | { success: DBMessageType, error?: never }
    | { success?: never, error: DBMessageType }