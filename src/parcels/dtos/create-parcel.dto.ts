import { DeliveryType } from "cloudinary";
import { ParcelType } from "src/lib/parcel.enum";

export class CreateParcelDto {

    description: string;

    recipient_info: {
        fullname: string;
        phone_number: string;
    };

    delivery_type: DeliveryType;

    parcel_type: ParcelType;

    weight: number;

    dimensions: string;

    pickup_location: {
        human_readable: string;
        coordinates: [Longitude, Latitude];
    };

    dropoff_location: {
        human_readable: string;
        coordinates: [Longitude, Latitude];
    }

    delivery_cost: number;
}