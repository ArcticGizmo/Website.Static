import { OpenBookContent } from '@/types/openLibrary';
import wretch from 'wretch';

interface BookResp {
  [key: string]: BookRespContent;
}

interface BookRespContent {
  title: string;
  authors: Author[];
  number_of_pages?: number;
  subjects?: SubjectLink[];
  cover?: BookCover;
}

interface Author {
  url: string;
  name: string;
}

interface SubjectLink {
  name: string;
  url: string;
}

interface BookCover {
  small?: string;
  medium?: string;
  large?: string;
}

const BASE_URL = 'https://openlibrary.org/';

const client = wretch();

const http = (url: string) => client.url(`${BASE_URL}${url}`);

const fetchBook = async (isbn: string): Promise<OpenBookContent | undefined> => {
  const rawBook = await getBook(isbn);

  if (!rawBook) {
    return;
  }

  return toBookContent(rawBook);
};

const getBook = async (isbn: string): Promise<BookRespContent | undefined> => {
  const resp = await http(`api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
    .get()
    .json<BookResp>();
  return Object.values(resp)[0];
};

const toBookContent = (book: BookRespContent): OpenBookContent => {
  const authors = book.authors.map(a => a.name);
  const cover = book.cover?.medium || book.cover?.small;
  const series = extractSeries(book);

  return {
    title: book.title,
    authors,
    coverImageUrl: cover,
    series,
    pageCount: book.number_of_pages,
  };
};

const extractSeries = (book: BookRespContent) => {
  const match = (book.subjects || []).find(s => s.name.includes('series:'));
  if (!match) {
    return;
  }

  return match.name.replace('series:', '').replace('[', '').replace(']', '').replaceAll('_', ' ');
};

export const useOpenBooks = () => {
  return { fetchBook };
};
