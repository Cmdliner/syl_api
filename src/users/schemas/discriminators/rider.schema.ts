import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user.schema";
import { RiderAvailability } from "src/common/enums/rider.enum";
import { RIDER_AVAILABILITY } from "src/lib/constants";

@Schema()
export class Rider extends User {
    
    @Prop({ type: String, enum: RIDER_AVAILABILITY, required: true, default: 'offline' })
    availability: RiderAvailability;

}

export const RiderSchema = SchemaFactory.createForClass(Rider);