import * as cloud from "wx-server-sdk";
import Axios from "axios";
import { BaseComicApi } from "./apis/api.base";
import { PicaComicApi } from "./apis/pica";
import { PingccComicApi } from "./apis/pingcc";
import { MangabzComicApi } from "./apis/mangabz";
import { HHIMMComic } from "./apis/hhimm";

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

export async function main(event, context) {
  console.info(event);
  try {
    const { api = "", method = "", params = {} } = event;
    let Api: BaseComicApi = undefined;
    switch (api) {
      case "pica":
        Api = new PicaComicApi();
        break;
      case "pingcc":
        Api = new PingccComicApi();
        break;
      case "mangabz":
        Api = new MangabzComicApi();
        break;
      case "hhimm":
        Api = new HHIMMComic();
        break;
      default:
        throw new Error("api name required");
    }

    let result = undefined;
    switch (method) {
      case "comics":
        result = await Api.comics(params);
        break;
      case "eps":
        result = await Api.eps(params.comicId);
        break;
      case "pages":
        result = await Api.pages(params.comicId, params.epId);
        break;
      default:
        throw new Error("method name required");
    }
    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}
