import { Controller, Get, Req, Query } from "@nestjs/common";
import { CloudinarySerivice } from "./cloudinary.service";

@Controller("/cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinarySerivice: CloudinarySerivice) {}

  @Get("/listComics")
  async listComics() {
    return await this.cloudinarySerivice.listComics();
  }

  @Get("/listEps")
  async listEps(@Query("comic") comic: string) {
    return await this.cloudinarySerivice.listEps(comic);
  }
}
