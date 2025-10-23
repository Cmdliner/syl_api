import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Types } from "mongoose";
import { DELIVERY_TYPE, PARCEL_STATUS, PARCEL_TYPE } from "src/lib/constants";
import { DeliveryType, ParcelStatus, ParcelType } from "src/lib/parcel.enum";
import { createTrackingID } from "src/lib/utils";

@Schema({ timestamps: true })
export class Parcel {

    @Prop({ required: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, index: true, ref: "User" })
    sender: Types.ObjectId;

    @Prop({ type: Object, required: true })
    recipient_info: {
        fullname: string;
        phone_number: string;
    }

    @Prop({ type: String })
    dimensions: string;

    @Prop({ required: true, type: Number, min: 0 })
    weight: number;

    @Prop({ required: true, type: String, enum: PARCEL_STATUS, default: ParcelStatus.RECEIVED })
    status: ParcelStatus;

    @Prop({ required: true, unique: true, index: true, default: () => createTrackingID() })
    tracking_id: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, index: true, ref: "User" })
    assigned_rider: Types.ObjectId;

    @Prop({
        type: {
            address: { type: String, required: true },
            geo: {
                type: { type: String, enum: ['Point'], required: true },
                coordinates: {
                    type: [Number],
                    required: true,
                    validate: {
                        validator: (v: number[]) => v.length === 2,
                        message: 'Coordinates must be an array of [longitude, latitude]'
                    }
                }
            }
        },
        required: true
    })
    pickup_location: {
        address: string;
        geo: {
            type: 'Point';
            coordinates: [Longitude, Latitude];
        }
    };

    @Prop({
        type: {
            address: { type: String, required: true },
            geo: {
                type: String,
                enum: ['Point'],
                required: true,
                coordinates: {
                    type: [Number],
                    required: true,
                    validate: {
                        validator: (v: number[]) => v.length === 2,
                        message: 'Coordinates must be an array of [longitude, latitude]'
                    }
                }
            }
        },
        required: true
    })
    dropoff_location: {
        address: string;
        geo: {
            type: 'Point',
            coordinates: [Longitude, Latitude]
        }
    };

    @Prop({ type: String, enum: DELIVERY_TYPE, default: DeliveryType.STANDARD })
    delivery_type: DeliveryType;

    @Prop({ type: String, enum: PARCEL_TYPE, default: ParcelType.STANDARD })
    parcel_type: ParcelType;

    @Prop({ type: Number, min: 0 })
    delivery_cost: number;

    @Prop({ type: Object, unique: true, sparse: true })
    proof_of_pickup: {
        public_id: string;
        secure_url: string;
    }

    @Prop({ type: Object, unique: true, sparse: true })
    proof_of_delivery: {
        public_id: string;
        secure_url: string;
    }

}

export const ParcelSchema = SchemaFactory.createForClass(Parcel);