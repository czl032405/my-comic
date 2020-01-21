export interface ComicDoc {
  comicId: string;
  api: string;
  title: string;
  author: string;
  thumb: string;
  finished: boolean;
  updated_at: Date;
}

export interface EpDoc {
  comicId: string;
  epId: string;
  title: string;
  updated_at: Date;
}

export interface PageDoc {
  pageId: string;
  comicId: string;
  epId: string;
  url: string;
}
