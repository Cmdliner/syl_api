import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Parcel {

    @Prop({ required: true })
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
    owner: Types.ObjectId;

    @Prop()
    dimensions: string;

    @Prop()
    weight: string;

    @Prop({ required: true })
    status: ParcelStatus; // !todo => finish creating all the status

    @Prop({ required: true, unique: true })
    tracking_id: string; // !todo => use a uuid or naoid or short code generator for this

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
    assigned_rider: Types.ObjectId;
}

export const ParcelSchema = SchemaFactory.createForClass(Parcel);