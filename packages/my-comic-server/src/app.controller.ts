import { Controller, Get, Query, Body, Header, Req } from "@nestjs/common";
import { AppService } from "./app.service";
import { CloudinarySerivice } from "./cloudinary/cloudinary.service";
import { PicaService } from "./pica/pica.service";
import Axios from "axios";
import * as crypto from "crypto";

@Controller()
export class AppController {
  constructor(
    //
    private readonly appService: AppService
  ) {}
}
