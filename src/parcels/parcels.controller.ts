import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query, UnprocessableEntityException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateParcelDto } from './dtos/create-parcel.dto';
import { ParcelsService } from './parcels.service';
import { User } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@UseGuards(AuthGuard)
@Controller({ path: 'parcels', version: '1' })
export class ParcelsController {

    constructor(private readonly parcelsService: ParcelsService) { }

    @Roles(Role.CUSTOMER)
    @UseInterceptors(FilesInterceptor('parcel_image', 5))
    @Post()
    async createParcel(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @User() user: RequestUser,
        @Body() parcelData: CreateParcelDto) {
        const { tracking_id } = await this.parcelsService.createParcel(user.id, files, parcelData);
        return { success: true, message: 'Parcel created successfully', data: { tracking_id } };
    }

    @Roles(Role.RIDER, Role.CUSTOMER)
    @Get(':id')
    async getParcel(
        @Param('id', IsObjectIdPipe) parcelId: MongoId,
        @User() user: RequestUser
    ) {
        const userId = new Types.ObjectId(user.id);
        const parcel = await this.parcelsService.getParcel(parcelId, userId);

        return { success: true, message: 'Parcels retrieved', data: { parcel } };
    }

    @Roles(Role.RIDER, Role.CUSTOMER)
    @Get('')
    async getParcelsForCustomerOrRider(
        @User() user: RequestUser,
        @Query('customerId', IsObjectIdPipe) customerId: MongoId,
    ) {
        const parcels = await this.parcelsService.getCustomerParcels(customerId);
        return { success: true, message: 'Parcels retrieved', data: { parcels } };
    }

}
