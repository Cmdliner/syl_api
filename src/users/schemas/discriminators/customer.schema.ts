import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user.schema";

@Schema()
export class Customer extends User {

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);