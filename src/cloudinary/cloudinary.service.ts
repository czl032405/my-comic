import { Injectable } from "@nestjs/common";
import { Media } from "../pica/pica.interface";
import * as cloudinary from "cloudinary";
import Axios from "axios";
import * as contentDisposition from "content-disposition";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

@Injectable()
export class CloudinarySerivice {
  private tempDir = path.resolve(os.tmpdir(), "my-comic");

  constructor() {
    !fs.existsSync(this.tempDir) && fs.mkdirSync(this.tempDir);
    // fix for must supply api_key error
    cloudinary.v2.config(true);
  }
  private async downloadTmpFile(url: string, ext?: string, folder?: string) {
    let response = await Axios({
      method: "get",
      url,
      responseType: "stream"
    });

    let contentDispositionStr = response.headers["content-disposition"];
    let fileName = "";
    if (contentDispositionStr) {
      let result = contentDisposition.parse(contentDispositionStr);
      fileName = result.parameters && result.parameters.filename;
    } else {
      fileName = path.basename(url);
    }

    fileName = fileName.trim().replace(/\?.*/, "");
    if (!path.extname(fileName)) {
      ext = "." + ext.replace(/\./, "");
      fileName = fileName + ext;
    }

    let targetDir = path.resolve(this.tempDir, folder || undefined);

    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir);

    let filePath = path.resolve(targetDir, fileName);

    if (!fileName) {
      throw "[downloadTmpFile] File Name Not Found";
    }

    return new Promise<string>(function(resolve, reject) {
      response.data.pipe(fs.createWriteStream(filePath));
      response.data.on("end", () => {
        resolve(filePath);
      });
      response.data.on("error", err => {
        reject(err);
      });
    });
  }
  async listComics(): Promise<string[]> {
    let result = await cloudinary.v2.api.root_folders();
    let names = result.folders.map(r => r.name);
    return names;
  }

  async listEps(comicName: string): Promise<string[]> {
    try {
      let result = await cloudinary.v2.api.sub_folders(encodeURIComponent(comicName));
      let names = result.folders.map(r => r.name);
      return names;
    } catch (error) {
      if (/"Can't find folder/.test(error.message)) {
        return [];
      }
      throw error;
    }
  }

  async syncMedia(comicName: string, epName: string, media: Media) {
    let url = `${media.fileServer}/static/${media.path}`;
    let targetPath = `${comicName}/${epName}/${media.originalName}`;
    let localPath = await this.downloadTmpFile(url, null, "pica");
    console.info(`Download ${localPath}`);
    let ext = path.extname(localPath);
    let public_id = targetPath.replace(ext, "");
    let result = await cloudinary.v2.uploader.upload(localPath, {
      public_id
    });
    console.info(`Upload ${public_id}`);
    return result.url;
  }
}
