import { Controller, Get, Param, Query, All, Body } from "@nestjs/common";
import { PicaService } from "./pica.service";

@Controller("/pica")
export class PicaController {
  constructor(private readonly picaService: PicaService) {}

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
}
