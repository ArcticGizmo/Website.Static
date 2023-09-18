export interface PagedData<T> {
  data: T[];
  page: number;
  pageSize: number;
  nextPage?: number;
}

export interface SortField {
  name: string;
  ascending: boolean;
  query: string;
}
