import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user.schema";

@Schema()
export class Rider extends User {

    @Prop({ type: "Point", index: "2dsphere" })
    current_location: string;

}

export const RiderSchema = SchemaFactory.createForClass(Rider);