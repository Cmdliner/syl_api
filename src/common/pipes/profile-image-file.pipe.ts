import { HttpStatus, ParseFilePipeBuilder } from "@nestjs/common";

export const ProfileImageFilePipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: new RegExp('^(image/(jpeg|png|gif|webp|bmp|svg\\+xml|tiff))$', 'i') })
    .addMaxSizeValidator({ maxSize: 5_000 })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY });