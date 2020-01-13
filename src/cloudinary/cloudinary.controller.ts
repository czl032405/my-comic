import { Controller, Get } from "@nestjs/common";
import { CloudinarySerivice } from "./cloudinary.service";

@Controller("/cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinarySerivice: CloudinarySerivice) {}
}
