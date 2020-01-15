import { Controller, Get, Param, Query, All, Body, Res } from "@nestjs/common";
import { PicaService } from "./pica.service";
import { Response } from "express";
import { CloudinarySerivice } from "../cloudinary/cloudinary.service";

@Controller("/pica")
export class PicaController {
  constructor(
    //
    private readonly picaService: PicaService,
    private readonly cloudinary: CloudinarySerivice
  ) {}

  @All("/login")
  login(@Query() query, @Body() body) {
    return this.picaService.login(Object.assign(query, body));
  }

  @Get("/categories")
  categories() {
    return this.picaService.categories();
  }

  @Get("/comics")
  comics(@Query() query) {
    return this.picaService.comics(query);
  }

  @Get("/comics/:id")
  comic(@Param("id") id: string) {
    return this.picaService.comic(id);
  }

  @Get("/comics/:id/eps")
  eps(@Param("id") id: string, @Query() query) {
    return this.picaService.eps(id, query);
  }

  @Get("/comics/:id/eps/:order")
  pages(@Param("id") id: string, @Param("order") order: string, @Query() query) {
    return this.picaService.ep(id, +order, query);
  }

  @Get("/image")
  async getImage(@Query("url") url: string, @Res() res: Response) {
    url = url.replace(/static\/static/, "static");
    let filePath = await this.cloudinary.downloadTmpFile(url);
    console.info(filePath);
    res.sendFile(filePath);
  }
}
