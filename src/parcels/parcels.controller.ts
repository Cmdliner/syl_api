import { Controller, Get, Post } from '@nestjs/common';

@Controller({ path: 'parcels', version: '1' })
export class ParcelsController {

    @Post()
    createParcel() {
        return { success: true, message: 'Parcel created' };
    }

    @Get()
    getParcel() {
        return { success: true, message: 'Parcels retrieved' };
    }

}
