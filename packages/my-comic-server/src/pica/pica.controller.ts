import { Controller, Get, Param, Query, All, Body, Res } from "@nestjs/common";
import { PicaService } from "./pica.service";
import { Response } from "express";
import { CloudinarySerivice } from "../cloudinary/cloudinary.service";
import * as path from "path";
import * as fs from "fs";
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

  @Get("/allcomics")
  allcomics(@Query() query, @Query("maxPage") maxPage: number) {
    let { t, c, k, s } = query;
    return this.picaService.allComics({ t, c, k, s }, maxPage);
  }

  @Get("/comics/:id")
  comic(@Param("id") id: string) {
    return this.picaService.comic(id);
  }

  @Get("/comics/:id/eps")
  eps(@Param("id") id: string, @Query() query) {
    return this.picaService.eps(id, query);
  }

  @Get("/comics/:id/alleps")
  alleps(@Param("id") id: string, @Query() query) {
    return this.picaService.allEps(id);
  }

  @Get("/comics/:id/eps/:order")
  pages(@Param("id") id: string, @Param("order") order: string, @Query() query) {
    return this.picaService.ep(id, +order, query);
  }

  @Get("/comics/:id/eps/:order/allpages")
  allEpPages(@Param("id") id: string, @Param("order") order: string) {
    return this.picaService.allEpPages(id, +order);
  }

  @Get("/image")
  async getImage(@Query("url") url: string, @Query("reload") reload: string, @Res() res: Response) {
    if (url) {
      res.header("Cache-Control", "max-age=2333333333");
      let result = await this.picaService.getImage(url, !!reload);
      if (result.cached) {
        res.header("Cached", "1");
      }
      res.sendFile(result.filepath);
    } else {
      res.end();
    }
  }
}
