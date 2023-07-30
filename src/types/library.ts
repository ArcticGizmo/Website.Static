export interface Library {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  libraryId: string;
  isbn?: string;
  title: string;
  authors?: string[];
  series?: BookSeries;
  tags?: string[];
  rating?: number;
}

export interface BookSeries {
  name: string;
  bookInSeries: number;
}
