import { Controller, Get } from "@nestjs/common";
import { CloudinarySerivice } from "../cloudinary/cloudinary.service";
import { PicaService } from "../pica/pica.service";
import { PromisePool } from "promise-pool-tool";

@Controller("/test")
export class TestController {
  constructor(
    //
    private readonly cloudinaryService: CloudinarySerivice,
    private readonly picaService: PicaService
  ) {}
  @Get("/syncMedia")
  async syncMedia() {
    let ep = await this.picaService.ep("58218d685f6b9a4f93e1cf21", 1);
    let media = ep.data.pages.docs[0].media;

    let result = await this.cloudinaryService.syncMedia("测试", "第一集", media);
    return result;
  }

  @Get("/upload")
  async upload() {
    let result = await this.cloudinaryService.uploadTest();
    return result;
  }

  @Get("/promise-pool")
  async promisePool() {
    let promisePool = new PromisePool([async function() {}], { throwError: false, concurrency: 1 });
    let result = await promisePool.start();
    return result;
  }
}
