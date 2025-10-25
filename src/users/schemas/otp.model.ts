import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MongooseSchema } from "mongoose";

@Schema()
export class Otp {

    @Prop({ type: String, required: true })
    token: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    userId: string;

    @Prop({ required: true, type: Date, expires: 0 })
    expiresAt: Date;

    @Prop({ type: String, required: true })
    kind: 'password_reset' | 'email_verification';
}

export const OtpSchema = SchemaFactory.createForClass(Otp);