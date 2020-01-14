import { Controller, Query, Get } from "@nestjs/common";
import { CronService } from "./cron.service";
import { CloudinarySerivice } from "../cloudinary/cloudinary.service";

@Controller("/crons")
export class CronController {
  constructor(
    //
    private readonly cronService: CronService
  ) {}

  @Get("/syncComics")
  async syncComics() {
    let result = await this.cronService.syncComics();
    return result;
  }

  @Get("/syncComic")
  async syncComic(@Query("comicId") comicId: string) {
    if (!comicId) {
      throw "ComicId Required";
    }
    let result = await this.cronService.syncComic(comicId);
    return result;
  }

  @Get("/syncEp")
  async syncEp(@Query("comicId") comicId: string, @Query("order") order: number) {
    if (!comicId) {
      throw "ComicId Required";
    }
    if (!order) {
      throw "Order Required";
    }
    let result = await this.cronService.syncEp(comicId, order);
    return result;
  }
}
