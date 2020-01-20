import { Controller, All, Query, Body, Post, Get, Res } from "@nestjs/common";
import { Response } from "express";

import { ProxyService } from "./proxy.service";
import { url } from "inspector";
import { AxiosRequestConfig } from "axios";

@Controller("/proxy")
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post("/")
  async request(@Body() options: any) {
    console.info(options);
    let result = await this.proxyService.request(options);

    return result;
  }

  @Get("/image")
  async getImage(@Query("url") url: string, @Query("reload") reload: string, @Res() res: Response) {
    if (url) {
      res.header("Cache-Control", "max-age=2333333333");
      let result = await this.proxyService.getImage(url, !!reload);
      res.header("Cached", result.cached + "");
      res.sendFile(result.filepath);
    } else {
      res.end();
    }
  }
}
