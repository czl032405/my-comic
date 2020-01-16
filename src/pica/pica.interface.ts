// http://json2ts.com/
interface Thumb {
  originalName: string;
  path: string;
  fileServer: string;
}

interface Doc {
  _id: string;
  title: string;
  author: string;
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  categories: string[];
  thumb: Thumb;
  totalLikes: number;
  totalViews: number;
  id: string;
  likesCount: number;
}

interface Comics {
  docs: Doc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

interface Avatar {
  fileServer: string;
  path: string;
  originalName: string;
}

interface Creator {
  _id: string;
  gender: string;
  name: string;
  slogan: string;
  title: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  role: string;
  avatar: Avatar;
  character: string;
}

interface Comic {
  _id: string;
  _creator: Creator;
  title: string;
  description: string;
  thumb: Thumb;
  author: string;
  chineseTeam: string;
  categories: string[];
  tags: string[];
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  updated_at: Date;
  created_at: Date;
  allowDownload: boolean;
  allowComment: boolean;
  totalLikes: number;
  totalViews: number;
  viewsCount: number;
  likesCount: number;
  isFavourite: boolean;
  isLiked: boolean;
  commentsCount: number;
}

export interface EpsDoc {
  _id: string;
  title: string;
  order: number;
  updated_at: Date;
  id: string;
}

interface Eps {
  docs: EpsDoc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Media {
  originalName: string;
  path: string;
  fileServer: string;
}

interface PageDoc {
  _id: string;
  media: Media;
  id: string;
}

interface Pages {
  docs: PageDoc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Ep {
  _id: string;
  title: string;
}

export interface ComicsResult {
  code: number;
  message: string;
  data: {
    comics: Comics;
  };
}

export interface ComicResult {
  code: number;
  message: string;
  data: {
    comic: Comic;
  };
}

export interface EpsResult {
  code: number;
  message: string;
  data: {
    eps: Eps;
  };
}

export interface EpResult {
  code: number;
  message: string;
  data: {
    pages: Pages;
    ep: Ep;
  };
}
