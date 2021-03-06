import { BaseComicApi } from "./api.base";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";

export class PingccComicApi extends BaseComicApi {
  private domain = "http://api.pingcc.cn/";
  async comics(params: { c?: string; s?: string; t?: string; k?: string; pages?: number }): Promise<ComicDoc[]> {
    let { c, s, t, k } = params;

    if (k) {
      let res = await this.request({
        url: "http://api.pingcc.cn/",
        params: {
          name: k
        }
      });
      let comics = res.data.mhlist
        .map(l => {
          return {
            api: "pingcc",
            comicId: l.url,
            title: l.name,
            author: l.author,
            thumb: l.cover,
            finished: undefined,
            updatedAt: undefined
          };
        })
        .reverse();
      return comics;
    }
    return [];
  }
  async eps(comicId: string): Promise<EpDoc[]> {
    let res = await this.request({
      url: "http://api.pingcc.cn/",
      params: {
        mhurl1: comicId
      }
    });
    let eps = res.data.list
      .map(i => {
        return {
          comicId,
          epId: i.url,
          title: i.num,
          updatedAt: undefined
        };
      })
      .reverse();

    return eps;
  }
  async pages(comicId: string, epId: string): Promise<PageDoc[]> {
    let res = await this.request({
      url: "http://api.pingcc.cn/",
      params: {
        mhurl2: epId
      }
    });
    let pages = res.data.list.map(i => {
      return {
        pageId: i.img,
        comicId,
        epId,
        url: i.img
      };
    });
    return pages;
  }
}
