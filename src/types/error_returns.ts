// Slick way to avoid try/catch towers in larger event handlers
export type DataOrError<T> = [T | null, Error | null]
