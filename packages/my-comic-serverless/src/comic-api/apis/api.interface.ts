export interface ComicDoc {
  _id: string;
  api: string;
  title: string;
  author: string;
  finished: boolean;
  thumb: string;
  updated_at: Date;
}

export interface EpDoc {
  _id: string;
  comicId: string;
  title: string;
  updated_at: Date;
}

export interface PageDoc {
  _id: string;
  comicId: string;
  epId: string;
  url: string;
}