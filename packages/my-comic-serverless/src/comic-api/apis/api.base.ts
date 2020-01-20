import Axios, { AxiosRequestConfig } from "axios";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";

export abstract class BaseComicApi {
  /**
   * comics列表
   * @param params
   * @param {string} c 分区名字 categories里面的title，如"嗶咔漢化"
   * @param {string} t 标签的名字，由info返回数据里面的"tags"获得
   * @param {string} k 搜索词
   * @param {string} s 排序
   * @param {string} page 页码 默认1
   *  ua: 默认
   *  dd: 新到旧
   *  da: 旧到新
   *  ld: 最多爱心
   *  vd: 最多指名
   */
  abstract comics(params: { c?: string; s?: string; t?: string; k?: string; page?: number }): Promise<ComicDoc[]>;

  /**
   * 返回该漫画全部eps
   * @param comicId
   */
  abstract eps(comicId: string): Promise<EpDoc[]>;

  /**
   * 返回该漫画的Ep的全部图片
   * @param comicId
   * @param epId
   */
  abstract pages(comicId: string, epId: string): Promise<PageDoc[]>;

  async request(options: AxiosRequestConfig, proxy = false) {
    console.info(`Request ${options.url}`);
    // if (options.params) {
    //   options.params = JSON.parse(JSON.stringify(options.params));
    // }
    if (proxy) {
      let res = await Axios({
        method: "POST",
        url: "https://my-comic.heroku.app/proxy",
        data: options
      });
      return res;
    } else {
      let res = await Axios(options);
      return res;
    }
  }

  async getProxyImageUrl(url: string) {
    return `https://my-comic.heroku.app/proxy/image?url=${url}`;
  }
}
