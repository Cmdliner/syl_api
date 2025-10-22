import { Controller, Get, NotFoundException, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileImageFilePipe } from '../common/pipes/profile-image-file.pipe';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../lib/roles.enum';
import { User } from '../common/decorators/user.decorator';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Roles(Role.CUSTOMER, Role.RIDER)
@Controller({ path: 'users', version: '1' })
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    @Get()
    async getProfileInfo(@User() user: RequestUser) {
        const profile_info = this.userService.profileInformation(user.id);
        if (!profile_info) throw new NotFoundException({ message: 'User not found' });

        return { success: true, message: 'Fetched profile information successfully', data: { profile_info } }
    }

    @Put('profile-picture')
    @UseInterceptors(FileInterceptor('profile_img'))
    async uploadProfileImage(@User() user: RequestUser, @UploadedFile(ProfileImageFilePipe) file: Express.Multer.File) {
        const data = await this.userService.uploadProfileImage(user.id, file)
        return { success: true, message: 'Profile image uploaded successfully', data };
    }

}