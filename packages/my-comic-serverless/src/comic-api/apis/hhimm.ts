// http://www.hhimm.com/

import { BaseComicApi } from "./api.base";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";
import Axios from "axios";
import { PromisePool } from "promise-pool-tool";
import * as cheerio from "cheerio";

export class HHIMMComic extends BaseComicApi {
  async comics(params: { c?: string; s?: string; t?: string; k?: string; page?: number }): Promise<ComicDoc[]> {
    let { c, s, t, k, page } = params;

    if (k) {
      let url = `http://www.hhimm.com/comic/`;
      let res = await Axios({
        url,
        method: "GET",
        params: {
          act: "search",
          st: k,
        },
      });
      let $ = cheerio.load(res.data);
      let result = $(".cComicList li a")
        .map((index, ele) => {
          let href = $(ele).attr("href");
          let title = $(ele).attr("title");
          let thumb = $("img", ele).attr("src");
          let comicIdMatch = href.match(/\/([^/]*?)\.html/);
          let comicId = comicIdMatch && comicIdMatch[1];

          return {
            comicId,
            api: "hhimm",
            title,
            author: undefined,
            thumb,
            finished: undefined,
            updatedAt: undefined,
          };
        })
        .get();
      return result;
    } else if (c) {
      let url = `http://www.hhimm.com/top/${c}.aspx`;
      let res = await Axios({
        url,
        method: "GET",
        params: {
          title: k,
          page: 1,
        },
      });
      let $ = cheerio.load(res.data);
      let result = $(".cComicItem")
        .map((index, ele) => {
          let href = $("a", ele).eq(0).attr("href");
          let title = $(".cComicTitle", ele).text().trim();
          let thumb = $("img", ele).eq(0).attr("src");
          let comicIdMatch = href.match(/\/([^/]*?)\.html/);
          let comicId = comicIdMatch && comicIdMatch[1];

          return {
            comicId,
            api: "hhimm",
            title,
            author: undefined,
            thumb,
            finished: undefined,
            updatedAt: undefined,
          };
        })
        .get();
      return result;
    } else {
      return [];
    }
  }

  async eps(comicId: string): Promise<EpDoc[]> {
    let url = `http://www.hhimm.com/manhua/${comicId}.html`;
    console.info(url);
    let res = await Axios({
      url,
      method: "GET",
    });
    let html = res.data;
    let $ = cheerio.load(html);

    let result = $(".cVolUl li")
      .map((index, ele) => {
        let title = $("a", ele).attr("title").trim();
        let url = $("a", ele).attr("href");
        let epIdMatch = url.match(/\/(.*?)\//);
        let sMatch = url.match(/s=([^&?]*)/);
        let epId = epIdMatch && epIdMatch[1];
        let s = (sMatch && sMatch[1]) || 7;
        epId = `${epId}-${s}`;
        return {
          comicId,
          title,
          epId,
          updatedAt: undefined,
        };
      })
      .get();

    return result;
  }

  async pages(comicId: string, epId: string): Promise<PageDoc[]> {
    let s = /-/.test(epId) ? epId.split("-")[1] : 7;
    epId = epId.split("-")[0];
    let geturl = (pageNo) => `http://www.hhimm.com/${epId}/${pageNo}.html?s=${s}&d=0`;
    let res = await Axios({
      url: geturl(1),
      method: "GET",
    });
    let thtml = res.data;
    let $ = cheerio.load(thtml);
    let totalPage = +$("#hdPageCount").val() || 1;
    let domainArr = $("#hdDomain").val().split("|");
    let domainIndex = 0; // 南极号 北极号
    let domain = domainArr[domainIndex].replace(/(.*)\//, "$1");
    let tasks = Array.from({ length: Math.ceil(totalPage / 2) }).map((unknow, ix) => async () => {
      let pageNo = ix * 2 + 1;
      let html = "";
      if (pageNo == 1) {
        html = thtml;
      } else {
        let res = await Axios({
          url: geturl(pageNo),
          method: "GET",
        });
        html = res.data;
      }

      let $ = cheerio.load(html);
      let curr = $("#img1021").attr("name") || $("#img2391").attr("name") || $("#img7652").attr("name") || $("#imgCurr").attr("name") || "";
      let next = $("#hdNextImg").val() || "";
      return [curr && domain + this.unsuan(curr), next && domain + this.unsuan(next)].filter(Boolean);
    });
    let pool = new PromisePool(tasks, { concurrency: 20 });
    let imagePairs = await pool.start();
    let result: string[] = [].concat(...imagePairs);

    return result.map((r) => ({
      pageId: r,
      comicId,
      epId,
      url: r,
    }));
  }

  private unsuan(s: string) {
    let sw = "44123.com|hhcool.com|hhimm.com";
    //  su = location.hostname.toLowerCase();
    let su = "www.hhimm.com";
    let b = false;
    for (let i = 0; i < sw.split("|").length; i++) {
      if (su.indexOf(sw.split("|")[i]) > -1) {
        b = true;
        break;
      }
    }
    if (!b) return "";

    let x = s.substring(s.length - 1);
    let w = "abcdefghijklmnopqrstuvwxyz";
    let xi = w.indexOf(x) + 1;
    let sk = s.substring(s.length - xi - 12, s.length - xi - 1);
    s = s.substring(0, s.length - xi - 12);
    let k = sk.substring(0, sk.length - 1);
    let f = sk.substring(sk.length - 1);
    for (let i = 0; i < k.length; i++) {
      let sub = k.substring(i, i + 1);
      // eval("s=s.replace(/"+ k.substring(i,i+1) +"/g,'"+ i +"')");
      s = s.replace(new RegExp(sub, "g"), i + "");
    }
    let ss = s.split(f);
    s = "";
    for (let i = 0; i < ss.length; i++) {
      s += String.fromCharCode(+ss[i]);
    }
    return s;
  }
}
