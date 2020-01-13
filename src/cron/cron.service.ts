import { Injectable } from "@nestjs/common";
import { PicaService } from "../pica/pica.service";
import { CloudinarySerivice } from "../cloudinary/cloudinary.service";
import { PromisePool } from "promise-pool-tool";
import { Media, Ep } from "../pica/pica.interface";
@Injectable()
export class CronService {
  private ignore: string[] = [
    //
    "平行天堂"
  ];

  constructor(private readonly picaService: PicaService, private readonly cloudindaryService: CloudinarySerivice) {}

  async syncComics() {
    console.info(`Cron Begin Sync Comics`);
    let comicsResult = await this.picaService.comics({ page: 1, s: "dd", c: "禁書目錄" });
    let comics = comicsResult.data.comics.docs.filter(doc => !this.ignore.find(i => new RegExp(i, "i").test(doc.title)));
    let tasks = await comics.map(doc => async () => {
      let result = await this.syncComic(doc._id);
      return result;
    });
    let promisePool = new PromisePool(tasks, { throwError: false, concurrency: 1 });
    let result = await promisePool.start();
    console.info(`Cron Finish Sync Comics`);
    return result;
  }

  async syncComic(comicId: string) {
    let comicResult = await this.picaService.comic(comicId);
    let comic = comicResult.data.comic;
    console.info(`Cron Begin Sync Comic ${comic.title}`);
    let cloudEps = await this.cloudindaryService.listEps(comic.title);
    let taskNumber = comic.epsCount - cloudEps.length;
    let tasks = await Array.from({ length: taskNumber }).map((num, index) => async () => {
      let result = await this.syncEp(comicId, cloudEps.length + index + 1);
      return result;
    });
    let promisePool = new PromisePool(tasks, { throwError: false, concurrency: 1 });
    let result = await promisePool.start();
    console.info(`Cron Finish Sync Comic ${comic.title}`);
    return result;
  }

  async syncEp(comicId: string, order: number): Promise<string[]> {
    let comicResult = await this.picaService.comic(comicId);
    let comic = comicResult.data.comic;
    console.info(`Cron Begin Sync Comic ${comic.title} Ep ${order}`);
    let pages = 20;
    let page = 1;
    let medias: Media[] = [];
    let maxTry = 20;
    let tryCount = 1;
    let ep: Ep = null;
    while (pages >= page && tryCount < maxTry) {
      let epResult = await this.picaService.ep(comicId, order, { page });
      ep = epResult.data.ep;
      pages = epResult.data.pages.pages;
      page = epResult.data.pages.page + 1;
      medias = medias.concat(epResult.data.pages.docs.map(doc => doc.media));
      tryCount++;
    }
    let tasks = medias.map(meida => async () => {
      let url = await this.cloudindaryService.syncMedia(comic.title, ep.title, meida);
      return url;
    });

    let promisePool = new PromisePool(tasks, { throwError: false, concurrency: 20 });
    let result = await promisePool.start();
    console.info(`Cron Finish Sync Comic ${comic.title} Ep ${order}`);
    return result;
  }
}
