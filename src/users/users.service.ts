import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async uploadProfileImage(userId: string, file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadFile(file, {
            folder: 'profile-images/',
            transformation: { format: 'webp', fetch_format: 'webp' }
        });

        await this.userModel.findByIdAndUpdate(userId, {
            profile_img: {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
        });

        return { profile_image: result.secure_url };
    }







}
