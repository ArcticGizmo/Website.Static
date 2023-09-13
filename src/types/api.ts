export interface PagedData<T> {
  data: T[];
  page: number;
  pageSize: number;
  nextPage?: number;
}
