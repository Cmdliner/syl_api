import { Controller, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileImageFilePipe } from '../common/pipes/profile-image-file.pipe';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../lib/roles.enum';
import { User } from '../common/decorators/user.decorator';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Roles(Role.CUSTOMER, Role.COURIER)
@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }


    @Get() 
    @Put('profile-image')
    @UseInterceptors(FileInterceptor('profile_img'))
    async uploadProfileImage(@User('id') id: string, @UploadedFile(ProfileImageFilePipe) file: Express.Multer.File) {
        const { profile_image } = await this.userService.uploadProfileImage(id, file)
        return { success: true, message: 'Profile image uploaded successfully', data: { profile_image } };
    }

}