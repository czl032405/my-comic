import { Injectable, Param } from "@nestjs/common";
import * as crypto from "crypto";
import Axios, { Method, AxiosPromise } from "axios";
import * as uuidv4 from "uuid/v4";
import * as qs from "querystring";
import { ComicsResult, ComicResult, EpResult, EpsResult, Media, Ep, EpDoc, ComicDoc } from "./pica.interface";
import * as path from "path";
import * as os from "os";
import * as Jimp from "jimp";
import * as fs from "fs";

@Injectable()
export class PicaService {
  // private imagePath = "https://storage1.picacomic.com/static/";
  private domain = "https://picaapi.picacomic.com";
  private secretKey = "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn";
  // public secretKey = `~n}$S9$lGts=U)8zfL/R.PM9;4[3|@/CEsl~Kk!7?BYZ:BAa5zkkRBL7r|1/*Cr`;
  private token = "";
  private apiKey = "C69BAF41DA5ABD1FFEDC6D2FEA56B";
  private version = "2.2.1.2.3.3";
  private buildVersion = "44";
  private uuid = uuidv4();
  private getSign(url: string, method: string, time: string, nonce: string) {
    let raw = `${url.replace(this.domain + "/", "")}${time}${nonce}${method}${this.apiKey}`.toLowerCase();
    // console.info(`raw `, raw);
    // console.info(`secret `, this.secretKey);
    let hash = crypto
      .createHmac("sha256", this.secretKey)
      .update(raw)
      .digest("hex");
    // console.info(`sig `, hash);
    return hash;
  }

  private getHeader(url: string, method: string) {
    let nonce = uuidv4().replace(/-/i, "");
    let time = Math.floor(new Date().getTime() / 1000 + 10);
    // console.info(`nonce `, nonce);
    // console.info(`time `, time);
    // console.info(`uuid `, this.uuid);
    // this.getSign(url, method, time + "");
    // this.getSign2(url, method, time + "");
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

    // var str = "";
    // for (var i in headers) {
    //   str += `${i}:${headers[i]}\n`;
    // }
    // console.info(str);

    return headers;
  }

  async request(url: string, method: Method, options: { data?: any; params?: any } = {}) {
    let loginTry = false;
    try {
      if (url.indexOf(this.domain) == -1) {
        url = `${this.domain}/${url}`;
      }
      let query = qs.stringify(JSON.parse(JSON.stringify(options.params || {})));
      if (query) {
        url = `${url.replace(/\?.*/, "")}?${query}`;
      }
      console.info(`${method} ${url}`);
      let response = await Axios({
        url,
        method,
        data: options.data,
        // params: options.params,
        headers: this.getHeader(url, method)
      });
      console.info(`${method} ${url} ${response.data && response.data.message}`);
      // console.info(response);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message == "unauthorized" && !/auth\/login/.test(url) && !loginTry) {
          await this.login();
          loginTry = true;
          return await this.request(url, method, options);
        }
        throw error.response.data;
        // return error.response;
      }
      throw error;
    }
  }

  async login(data: { email?: string; password?: string } = {}) {
    let { email = process.env.PICA_EMAIL, password = process.env.PICA_PASSWORD } = data;
    this.token = "";
    let url = `auth/sign-in`;
    let response = await this.request(url, "POST", { data: { email, password } });
    let result = response.data;
    if (result.data && result.data.token) {
      this.token = result.data.token;
    }

    return response.data;
  }

  async categories() {
    let url = `categories`;
    let response = await this.request(url, "GET");
    return response.data;
  }

  /**
   *
   * @param params
   * @param {number} page 页码
   * @param {string} c 分区名字 categories里面的title，如"嗶咔漢化"
   * @param {string} t 标签的名字，由info返回数据里面的"tags"获得
   * @param {string} s 排序
   * @param {string} k 搜索词
   *  ua: 默认
   *  dd: 新到旧
   *  da: 旧到新
   *  ld: 最多爱心
   *  vd: 最多指名
   */
  async comics(params: { page?: number; c?: string; s?: string; t?: string; k?: string } = {}): Promise<ComicsResult> {
    let { page, c, s, t, k } = params;
    if (k) {
      let url = `comics/advanced-search`;
      let response = await this.request(url, "POST", { params: { page }, data: { keyword: k, sort: s } });
      return response.data;
    } else {
      let url = "comics";
      let response = await this.request(url, "GET", { params });
      return response.data;
    }
  }

  async comic(id: string): Promise<ComicResult> {
    let url = `comics/${id}`;
    let response = await this.request(url, "GET");
    return response.data;
  }

  async eps(id: string, params: { page?: number } = {}): Promise<EpsResult> {
    let url = `comics/${id}/eps`;
    let response = await this.request(url, "GET", { params });
    return response.data;
  }

  async ep(id: string, order: number, params: { page?: number } = {}): Promise<EpResult> {
    let url = `comics/${id}/order/${order}/pages`;
    let response = await this.request(url, "GET", { params });
    return response.data;
  }

  async allComics(params: { c?: string; s?: string; t?: string; k?: string } = {}, maxPage = 5): Promise<ComicDoc[]> {
    let { c, s, t, k } = params;
    let pages = 20;
    let page = 1;
    let comics: ComicDoc[] = [];
    let maxTry = maxPage;
    let tryCount = 0;
    while (pages >= page && tryCount < maxTry) {
      let comicsResult = await this.comics({ c, s, t, k, page });
      pages = comicsResult.data.comics.pages;
      page = comicsResult.data.comics.page + 1;
      comics = comics.concat(comicsResult.data.comics.docs);
      tryCount++;
    }
    return comics;
  }

  async allEps(id: string): Promise<EpDoc[]> {
    let pages = 20;
    let page = 1;
    let eps: EpDoc[] = [];
    let maxTry = 20;
    let tryCount = 0;
    while (pages >= page && tryCount < maxTry) {
      let epResult = await this.eps(id, { page });
      pages = epResult.data.eps.pages;
      page = epResult.data.eps.page + 1;
      eps = eps.concat(epResult.data.eps.docs);
      tryCount++;
    }
    return eps;
  }

  async allEpPages(id: string, order: number): Promise<Media[]> {
    let pages = 20;
    let page = 1;
    let medias: Media[] = [];
    let maxTry = 20;
    let tryCount = 0;
    while (pages >= page && tryCount < maxTry) {
      let epResult = await this.ep(id, order, { page });
      pages = epResult.data.pages.pages;
      page = epResult.data.pages.page + 1;
      medias = medias.concat(epResult.data.pages.docs.map(doc => doc.media));
      tryCount++;
    }
    return medias;
  }

  async getImage(url: string, reload: boolean = false) {
    url = url.replace(/static\/static/, "static");
    const tempDir = path.resolve(os.tmpdir(), "my-comic");
    let fileName = path.basename(url);
    let filepath = path.resolve(tempDir, fileName);

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 10 && !reload) {
      console.info(`cached ${url}`);
      return { filepath, cached: true };
    }
    let image = await Jimp.read(url);
    let width = await image.getWidth();
    if (width > 480) {
      image = await image.scaleToFit(480, 1500);
    }
    image = await image.quality(70);
    await image.writeAsync(filepath);
    return { filepath, cached: false };
  }
}
