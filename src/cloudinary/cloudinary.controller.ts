import { Controller, Get } from "@nestjs/common";
import { CloudinarySerivice } from "./cloudinary.service";

@Controller("/cloudinary")
export class CloudstorageController {
  constructor(private readonly cloudstorageController: CloudinarySerivice) {}
}
