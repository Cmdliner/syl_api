import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user.schema";

@Schema()
export class Rider extends User {

}

export const RiderSchema = SchemaFactory.createForClass(Rider);