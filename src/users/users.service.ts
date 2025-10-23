import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async profileInformation(userId: string) {
        const user = await this.userModel.findById(userId)
            .select('-password_hash -__v')
            .lean()
            .exec();

        if (!user) throw new NotFoundException({ message: 'User not found' });
        return user;
    }

    async uploadProfileImage(userId: string, file: Express.Multer.File) {
        const result = await this.cloudinaryService.uploadFile(file, {
            folder: 'profile-images/',
            transformation: { format: 'webp', fetch_format: 'webp' }
        });

        if (result.http_code >= 400) throw new BadRequestException({ name: result.name, message: result.message })

        await this.userModel.findByIdAndUpdate(userId, {
            profile_img: {
                public_id: result.public_id,
                secure_url: result.secure_url
            }
        });

        return { profile_image: result.secure_url };
    }







}
