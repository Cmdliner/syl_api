import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Parcel } from './schemas/parcel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParcelDto } from './dtos/create-parcel.dto';
import { Customer } from 'src/users/schemas/discriminators/customer.schema';
import { Rider } from 'src/users/schemas/discriminators/rider.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/users/schemas/user.schema';
import { compareObjectIds } from 'src/lib/utils';

@Injectable()
export class ParcelsService {

    constructor(
        @InjectModel(Parcel.name) private readonly parcelModel: Model<Parcel>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Rider.name) private readonly riderModel: Model<Rider>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createParcel(customerId: string, parcel_images: Array<Express.Multer.File>, parcelData: CreateParcelDto) {

        const customer = await this.customerModel.findById(customerId);
        if (!customer) throw new NotFoundException({ message: 'Customer not found' });

        const imageUploadOpts = { folder: 'parcels/', transformation: { format: 'webp', fetch_format: 'webp' } };
        const processImage = (file: Express.Multer.File) => this.cloudinaryService.uploadFile(file, imageUploadOpts);

        const uploadResult = await Promise.all(parcel_images.map(processImage));

        const uploadErrors = uploadResult.filter(r => r.http_code >= 400);
        if (uploadErrors) throw new UnprocessableEntityException({ message: 'Error processing images', details: uploadErrors });

        const parcelImagesData = uploadResult.map(r => { return { public_id: r.public_id, secure_url: r.secure_url } });

        const parcel = await this.parcelModel.create({
            sender: customer._id,
            description: parcelData.description,
            images: parcelImagesData,
            recipient_info: parcelData.recipient_info,
            delivery_type: parcelData.delivery_type,
            parcel_type: parcelData.parcel_type,
            weight: parcelData.weight,
            dimensions: parcelData.dimensions,
            delivery_cost: parcelData.delivery_cost,
            pickup_location: {
                address: parcelData.pickup_location.address,
                geo: parcelData.pickup_location.coordinates
            },
            dropoff_location: {
                address: parcelData.dropoff_location.address,
                geo: parcelData.dropoff_location.coordinates
            },


        });

        return { tracking_id: parcel.tracking_id }

    }

    async getParcel(parcel_id: MongoId, user_id: MongoId) {
        const user = await this.userModel.findById(user_id);
        if (!user) throw new NotFoundException({ message: 'User not found' });

        const parcel = await this.parcelModel.findById(parcel_id).lean().exec();
        if (!parcel) throw new NotFoundException({ message: 'Parcel not found' });

        const isAuthorized = compareObjectIds(parcel.assigned_rider, user_id) || compareObjectIds(parcel.sender, user_id);
        if (!isAuthorized) throw new NotFoundException({ message: 'Parcel not found' });

        return parcel;
    }
}
