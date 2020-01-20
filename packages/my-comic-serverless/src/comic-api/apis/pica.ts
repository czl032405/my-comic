import { BaseComicApi } from "./api.base";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";
import * as crypto from "crypto";
import * as uuidv4 from "uuid/v4";
import Axios, { Method, AxiosRequestConfig } from "axios";
import * as qs from "querystring";

export class PicaComicApi extends BaseComicApi {
  private domain = "https://picaapi.picacomic.com";
  private secretKey = "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn";
  private token = "";
  private apiKey = "C69BAF41DA5ABD1FFEDC6D2FEA56B";
  private version = "2.2.1.2.3.3";
  private buildVersion = "44";
  private uuid = uuidv4();
  private getSign(url: string, method: string, time: string, nonce: string) {
    let raw = `${url.replace(this.domain + "/", "")}${time}${nonce}${method}${this.apiKey}`.toLowerCase();
    let hash = crypto
      .createHmac("sha256", this.secretKey)
      .update(raw)
      .digest("hex");
    return hash;
  }

  private getHeader(url: string, method: string) {
    let nonce = uuidv4().replace(/-/i, "");
    let time = Math.floor(new Date().getTime() / 1000 + 10);
    let headers = {
      accept: "application/vnd.picacomic.com.v1+json",
      "Content-Type": "application/json; charset=UTF-8",
      "api-key": this.apiKey,
      "app-channel": "2",
      "app-version": this.version,
      "app-uuid": this.uuid,
      "app-platform": "android",
      "app-build-version": this.buildVersion,
      "User-Agent": "okhttp/3.8.1",
      "image-quality": "original",
      Host: "picaapi.picacomic.com",
      time: time,
      nonce,
      signature: this.getSign(url, method, time + "", nonce)
    };

    if (this.token) {
      headers["authorization"] = this.token;
    }

    return headers;
  }

  async request(options: AxiosRequestConfig) {
    let loginTry = false;
    let query = qs.stringify(JSON.parse(JSON.stringify(options.params || {})));
    delete options.params;
    if (options.url.indexOf(this.domain) == -1) {
      options.url = `${this.domain}/${options.url}`;
    }
    if (query) {
      options.url = `${options.url.replace(/\?.*/, "")}?${query}`;
    }
    options.headers = this.getHeader(options.url, options.method);

    try {
      let response = await super.request(options, true);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message == "unauthorized" && !/auth\/login/.test(options.url) && !loginTry) {
          await this.login();
          loginTry = true;
          options.headers = this.getHeader(options.url, options.method);
          return await super.request(options, true);
        }
        throw error.response.data;
      }
      throw error;
    }
  }

  async login(data: { email?: string; password?: string } = {}) {
    console.info(`login `, process.env.PICA_EMAIL);
    let { email = process.env.PICA_EMAIL, password = process.env.PICA_PASSWORD } = data;
    this.token = "";
    let url = `auth/sign-in`;
    let response = await this.request({ url, method: "POST", data: { email, password } });
    let result = response.data;
    if (result.data && result.data.token) {
      this.token = result.data.token;
    }
    return response.data;
  }

  async comics(params: { c?: string; s?: string; t?: string; k?: string }): Promise<ComicDoc[]> {
    let { c, s, t, k } = params;
    if (k) {
      let url = `comics/advanced-search`;
      let response = await this.request({ url, method: "POST", params: { page: 1 }, data: { keyword: k, sort: s } });
      let result = response.data;
      return result.data.comics.docs.map(doc => {
        return {
          _id: doc._id,
          api: "pica",
          title: doc.title,
          author: doc.author,
          finished: doc.finished,
          thumb: this.getProxyImageUrl(`${doc.thumb.fileServer}/static/${doc.thumb.path}`),
          updated_at: undefined
        };
      });
    } else {
      let url = "comics";
      let response = await this.request({ url, method: "GET", params });
      let result = response.data;
      return result.data.comics.docs.map(doc => {
        return {
          _id: doc._id,
          api: "pica",
          title: doc.title,
          author: doc.author,
          finished: doc.finished,
          thumb: this.getProxyImageUrl(`${doc.thumb.fileServer}/static/${doc.thumb.path}`),
          updated_at: undefined
        };
      });
    }
  }

  async eps(comicId: string): Promise<EpDoc[]> {
    let url = `comics/${comicId}/eps`;
    let pages = 1;
    let page = 1;
    let eps: EpDoc[] = [];
    let maxTry = 20;
    let tryCount = 0;
    while (pages >= page && tryCount < maxTry) {
      let response = await this.request({
        url,
        method: "GET",
        params: { page }
      });
      let result = response.data;
      pages = result.data.eps.pages;
      page = result.data.eps.page + 1;
      eps = eps.concat(
        result.data.eps.docs.map(doc => {
          return {
            _id: doc._id,
            comicId,
            title: doc.title,
            updated_at: doc.updated_at
          };
        })
      );
      tryCount++;
    }
    return eps;
  }
  async pages(comicId: string, epId: string): Promise<PageDoc[]> {
    let result: PageDoc[] = [];
    let pages = 1;
    let page = 1;
    let maxTry = 20;
    let tryCount = 0;
    let order = epId;
    while (pages >= page && tryCount < maxTry) {
      let url = `comics/${comicId}/order/${order}/pages`;
      let response = await this.request({ url, method: "GET", params: { page } });
      let result = response.data;
      pages = result.data.pages.pages;
      page = result.data.pages.page + 1;
      result = result.concat(
        result.data.pages.docs.map(doc => {
          return {
            _id: doc._id,
            comicId,
            epId,
            url: this.getProxyImageUrl(`${doc.media.fileServer}/static/${doc.media.path}`)
          };
        })
      );
      tryCount++;
    }
    return result;
  }
}
