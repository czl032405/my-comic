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
      let comics = res.data.mhlist.map(l => {
        return {
          _id: l.url,
          api: "pingcc",
          title: l.name,
          author: l.author,
          thumb: l.cover,
          finished: undefined,
          updated_at: undefined
        };
      });
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
          _id: i.url,
          comicId,
          title: i.num,
          updated_at: undefined
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
        _id: i.img,
        comicId,
        epId,
        url: i.img
      };
    });
    return pages;
  }
}
