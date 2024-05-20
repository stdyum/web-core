export interface Pagination<T> {
  items: T[],
  perPage: number,
  total: number,
  page: number,
  next: PaginationParams,
  previous: PaginationParams
}

export interface PaginationParams {
  cursor?: string,
  page?: number,
  perPage?: number,
  [key: string]: any
}

