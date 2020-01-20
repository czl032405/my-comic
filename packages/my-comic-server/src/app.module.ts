import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CloudinarySerivice } from "./cloudinary/cloudinary.service";
import { PicaService } from "./pica/pica.service";
import { APP_FILTER } from "@nestjs/core";
import { CustomExceptionFilter } from "./lib/custom-exception.filter";
import { ConfigModule } from "@nestjs/config";
import { PicaController } from "./pica/pica.controller";
import { CronController } from "./cron/cron.controller";
import { CronService } from "./cron/cron.service";
import { TestController } from "./test/test.controller";
import { CloudinaryController } from "./cloudinary/cloudinary.controller";
import "./lib/axios-proxy-fix";
import { ProxyController } from "./proxy/proxy.controller";
import { ProxyService } from "./proxy/proxy.service";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PicaController, CronController, CloudinaryController, ProxyController, TestController],
  providers: [AppService, CloudinarySerivice, PicaService, CronService, ProxyService, { provide: APP_FILTER, useClass: CustomExceptionFilter }]
})
export class AppModule {}
