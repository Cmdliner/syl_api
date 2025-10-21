import { Controller, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileImageFilePipe } from '../pipes/profile-image-file.pipe';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../lib/roles.enum';
import { User } from '../decorators/user.decorator';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Roles(Role.CUSTOMER, Role.COURIER)
@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }
    @Put('profile-image')
    @UseInterceptors(FileInterceptor('profile_img'))
    async uploadProfileImage(@User('id') id: string, @UploadedFile(ProfileImageFilePipe) file: Express.Multer.File) {
        const { profile_image } = await this.userService.uploadProfileImage(id, file)
        return { success: true, message: 'Profile image uploaded successfully', data: { profile_image } };
    }

}