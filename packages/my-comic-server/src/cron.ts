import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CronService } from "./cron/cron.service";

// todo use  process.argv to determin what cron to run
async function run() {
  const app = await NestFactory.create(AppModule);
  let cronService = app.get<CronService>(CronService);
  cronService.syncComics();
}

run();
