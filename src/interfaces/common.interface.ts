export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type PaginationParams<T = Record<string, any>>= {
  page: number;
  pageSize: number; 
}&T