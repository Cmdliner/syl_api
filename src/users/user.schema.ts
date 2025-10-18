import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AuthProviders, UserRole } from "../lib/constants";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({})
    fullname: string;

    @Prop({ enum: UserRole, index: true, immutable: true, required: true })
    role: UserRole;

    @Prop({ unique: true, sparse: true })
    phone_number: string;

    @Prop({ required: true, unique: true })
    profile_img_url: string;

    @Prop({ sparse: true })
    password_hash: string;

    @Prop({ type: String, required: true })
    home_address: string;

    @Prop({ type: [{ type: String, enum: AuthProviders }], default: ['default'] })
    auth_providers: AuthProvider[];

}

export const UserSchema = SchemaFactory.createForClass(User);