import { ConsoleLogger, Provider } from "@nestjs/common";
import { v2 as cloudinary} from "cloudinary";
import { CLOUDINARY } from "../lib/constants";
import { ConfigService } from "@nestjs/config";

export const CloudinaryProvider: Provider = {

    provide: CLOUDINARY,
    inject: [ConfigService],
    useFactory(configService: ConfigService) {
        cloudinary.config({
            cloud_name: configService.get<string>('CLOUDINARY_NAME'),
            api_key: configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
            secure: configService.get<string>('NODE_ENV') === 'production'
        });
        return cloudinary;
    }
    

}   