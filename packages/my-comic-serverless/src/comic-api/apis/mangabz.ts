import { BaseComicApi } from "./api.base";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";
import Axios, { Method, AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import * as moment from "moment";

export class MangabzComicApi extends BaseComicApi {
  async comics(params: { c?: string; s?: string; t?: string; k?: string; page?: number }): Promise<ComicDoc[]> {
    let { c, s, t, k, page } = params;
    if (k) {
      let url = `http://www.mangabz.com/search?title=${k}&page=1`;
      let res = await Axios({
        url,
        method: "GET"
      });
      let $ = cheerio.load(res.data);
      let result = $(".mh-item")
        .map((index, ele) => {
          let comicId = $("a", ele).attr("href");
          let title = $(".title", ele)
            .text()
            .trim();
          let thumb = $(".mh-cover", ele).attr("src");

          return {
            comicId,
            api: "mangabz",
            title,
            author: undefined,
            thumb,
            finished: undefined,
            updatedAt: undefined
          };
        })
        .get();
      return result;
    } else {
      let url = `http://www.mangabz.com/`;
      let res = await Axios({
        url,
        method: "GET"
      });
      let $ = cheerio.load(res.data);
      if (c == "人氣推薦") {
        let result = $(".list-con-1 .index-manga-item")
          .map((index, ele) => {
            let title = $(".index-manga-item-title", ele)
              .text()
              .trim();
            let thumb = $(".index-manga-item-cover", ele).attr("src");
            let comicId = $("a", ele)
              .attr("href")
              .replace(/\//g, "");
            return {
              comicId,
              api: "mangabz",
              title,
              author: undefined,
              thumb,
              finished: undefined,
              updatedAt: undefined
            };
          })
          .get();
        return result;
      } else if (c == "熱度排行") {
        let result = $(".rank-list .list")
          .map((index, ele) => {
            let title = $(".rank-item-title", ele)
              .text()
              .trim();
            let thumb = $(".rank-item-cover", ele).attr("src");
            let comicId = $("a", ele)
              .attr("href")
              .replace(/\//g, "");
            return {
              comicId,
              api: "mangabz",
              title,
              author: undefined,
              thumb,
              finished: undefined,
              updatedAt: undefined
            };
          })
          .get();
        return result;
      } else if (c == "編輯推薦") {
        let con = $(".list-con-2").eq(0);
        let result = $(".index-manga-item", con)
          .map((index, ele) => {
            let title = $(".index-manga-item-title", ele)
              .text()
              .trim();
            let thumb = $(".index-manga-item-cover", ele).attr("src");
            let comicId = $("a", ele)
              .attr("href")
              .replace(/\//g, "");
            return {
              comicId,
              api: "mangabz",
              title,
              author: undefined,
              thumb,
              finished: undefined,
              updatedAt: undefined
            };
          })
          .get();
        return result;
      } else if (c == "上升最快") {
        let con = $(".list-con-2").eq(1);
        let result = $(".carousel-right-item", con)
          .map((index, ele) => {
            let title = $(".carousel-right-item-title", ele)
              .text()
              .trim();
            let thumb = $(".carousel-right-item-cover", ele).attr("src");
            let comicId = $("a", ele)
              .attr("href")
              .replace(/\//g, "");
            return {
              comicId,
              api: "mangabz",
              title,
              author: undefined,
              thumb,
              finished: undefined,
              updatedAt: undefined
            };
          })
          .get();
        return result;
      }
    }

    throw new Error("Method not implemented.");
  }
  async eps(comicId: string): Promise<EpDoc[]> {
    // http://www.mangabz.com/207bz/
    let url = `http://www.mangabz.com/${comicId}/`;
    let res = await Axios({
      url,
      method: "GET"
    });
    let html = res.data;
    let $ = cheerio.load(html);
    let updateAtMatch = $(".detail-list-form-title")
      .text()
      .match(/\d*-\d*-\d*/);
    let updatedAt = updateAtMatch ? moment(updateAtMatch[0]).toDate() : undefined;
    let eps = $(".detail-list-form-item")
      .map((index, ele) => {
        let title = $(ele)
          .text()
          .trim()
          .replace(/ +/g, " ");
        let epId = $(ele)
          .attr("href")
          .replace(/\//g, "")
          .trim();

        return {
          comicId,
          title,
          epId,
          updatedAt
        };
      })
      .get();
    return eps;
  }
  async pages(comicId: string, epId: string): Promise<PageDoc[]> {
    let url = `http://www.mangabz.com/${epId}/`;
    let res = await Axios({
      url,
      method: "GET"
    });
    let html = res.data;

    let COMIC_MID = this.getVarInPage(html, "COMIC_MID");
    let MANGABZ_CID = this.getVarInPage(html, "MANGABZ_CID");
    let MANGABZ_VIEWSIGN = this.getVarInPage(html, "MANGABZ_VIEWSIGN");
    let MANGABZ_VIEWSIGN_DT = this.getVarInPage(html, "MANGABZ_VIEWSIGN_DT");
    let MANGABZ_IMAGE_COUNT = this.getVarInPage(html, "MANGABZ_IMAGE_COUNT");

    let currentPage = 1;
    let totalPage = +MANGABZ_IMAGE_COUNT;
    let tryCount = 1;
    let maxTry = 20;
    let result = [];
    while (currentPage <= totalPage && tryCount < maxTry) {
      let images = await this.loadChapterImage({
        page: currentPage,
        epId,
        MANGABZ_CID,
        COMIC_MID,
        MANGABZ_VIEWSIGN_DT,
        MANGABZ_VIEWSIGN
      });
      result = result.concat(images);
      currentPage += images.length;
      tryCount++;
    }

    return result.map(r => ({
      pageId: r,
      comicId,
      epId,
      url: r
    }));
  }

  private getVarInPage(html: string, name: string) {
    let match = html.match(new RegExp(`var ${name} *= *"?([^;"]*)"?;`));
    let result = match && match[1];
    return result;
  }

  private async loadChapterImage(params: { page: number; epId: string; MANGABZ_CID: string; COMIC_MID: string; MANGABZ_VIEWSIGN_DT: string; MANGABZ_VIEWSIGN: string }): Promise<string[]> {
    let { page, epId, MANGABZ_CID, COMIC_MID, MANGABZ_VIEWSIGN_DT, MANGABZ_VIEWSIGN } = params;
    let chapterimageUrl = `http://www.mangabz.com/${epId}/chapterimage.ashx?cid=${MANGABZ_CID}&page=${page}&key=&_cid=${MANGABZ_CID}&_mid=${COMIC_MID}&_dt=${MANGABZ_VIEWSIGN_DT}&_sign=${MANGABZ_VIEWSIGN}`;
    console.info(chapterimageUrl);
    let res = await Axios({
      url: chapterimageUrl,
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Referer: `http://www.mangabz.com/m${MANGABZ_CID}`,
        Cookie: `image_time_cookie=${MANGABZ_CID}|1|1`
      }
    });
    let text = res.data;
    let evalContent = text;
    let result = eval(evalContent);
    console.info(result.length);
    return result;
  }
}
