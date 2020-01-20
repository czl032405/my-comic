import { Injectable } from "@nestjs/common";
import * as Jimp from "jimp";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import Axios, { AxiosRequestConfig } from "axios";

@Injectable()
export class ProxyService {
  async request(options: AxiosRequestConfig) {
    try {
      let res = await Axios(options);
      return res.data;
    } catch (error) {
      let data = error.response && error.response.data;
      throw data;
    }
  }
  async getImage(url: string, reload: boolean = false) {
    const tempDir = path.resolve(os.tmpdir(), "my-comic");
    const fileName = path.basename(url);
    const filepath = path.resolve(tempDir, fileName);
    url = url.replace(/static\/static/, "static");

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 10 && !reload) {
      console.info(`cached ${url}`);
      return { filepath, cached: true };
    }
    let image = await Jimp.read(url);
    let width = await image.getWidth();
    if (width > 480) {
      image = await image.scaleToFit(480, 1500);
    }
    image = await image.quality(70);
    await image.writeAsync(filepath);
    return { filepath, cached: false };
  }
}
