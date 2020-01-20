import { BaseComicApi } from "./api.base";
import { ComicDoc, EpDoc, PageDoc } from "./api.interface";

export class PingccComicApi extends BaseComicApi {
  comics(params: { c?: string; s?: string; t?: string; k?: string; pages?: number }): Promise<ComicDoc[]> {
    throw new Error("Method not implemented.");
  }
  eps(comicId: string): Promise<EpDoc[]> {
    throw new Error("Method not implemented.");
  }
  pages(comicId: string, epId: string): Promise<PageDoc[]> {
    throw new Error("Method not implemented.");
  }
}
