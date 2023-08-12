export interface Library {
  id: string;
  name: string;
}

export interface Book {
  id?: string;
  libraryId?: string;
  content: BookContent;
}

export interface BookContent {
  coverImageUrl?: string;
  isbn?: string;
  title: string;
  authors?: string[];
  series?: string;
  bookInSeries?: number;
  tags?: string[];
  rating?: number;
}

export interface LibraryWithBooks {
  library: Library;
  books: Book[];
}

export interface CreateBookReq {
  libraryId: string;
  content: BookContent;
}
