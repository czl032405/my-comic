import { Injectable } from "@nestjs/common";
import { Media } from "../pica/pica.interface";

@Injectable()
export class CloudinarySerivice {
  listComics(): string[] {
    return [];
  }

  listEps(comicName: string): string[] {
    return [];
  }

  downloadMeida(comicName: string, epName: string, meida: Media) {
    return "";
  }
}
