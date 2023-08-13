export interface Library {
  id: string;
  ownerUserId: string;
  name: string;
}

export interface Book {
  id?: string;
  libraryId?: string;
  content: BookContent;
}

export interface BookContent {
  isbn?: string;
  title: string;
  authors?: string[];
  coverImageUrl?: string;
  series?: string;
  pageCount?: number;
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
