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

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PicaController, CronController],
  providers: [AppService, CloudinarySerivice, PicaService, CronService, { provide: APP_FILTER, useClass: CustomExceptionFilter }]
})
export class AppModule {}
