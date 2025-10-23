import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Parcel } from './schemas/parcel.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ParcelsService {

    constructor(
        @InjectModel(Parcel.name) private parcelModel: Model<Parcel>
    ) {}

    createParcel() {}
}
