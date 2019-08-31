export * from "./validateQuery"

export interface ValidatedRequest<TSchema> extends Express.Request{
    query: TSchema
}