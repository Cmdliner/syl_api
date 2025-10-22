import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AuthProviders, UserRole } from "../../lib/constants";
import { Role } from "src/lib/roles.enum";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({})
    fullname: string;

    @Prop({ enum: UserRole, index: true, immutable: true, required: true })
    role: Role;

    @Prop({ unique: true, sparse: true })
    phone_number: string;

    @Prop({ type: { public_id: String, secure_url: String }, unique: true, sparse: true, _id: false })
    profile_img: {
        public_id: string;
        secure_url: string;
    }

    @Prop({ sparse: true })
    password_hash: string;

    @Prop({ type: String, required: true })
    home_address: string;

    @Prop({ type: [{ type: String, enum: AuthProviders }], default: ['default'] })
    auth_providers: AuthProvider[];

}

export const UserSchema = SchemaFactory.createForClass(User);