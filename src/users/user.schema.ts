import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({})
    name: string;

    @Prop({ enum: ['customer', 'courier', 'admin'], index: true, immutable: true, required: true })
    role: 'customer' | 'courier' | 'admin';

    @Prop({})
    phone_number: string;
    
    @Prop({ required: true })
    password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);