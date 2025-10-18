import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateCourierDto } from './dtos/create-courier.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async createCustomer(customerData: CreateCustomerDto) {
        const matchedUsers = await this.userModel.find({
            $or: [
                { email: customerData.email },
                { phone_number: customerData.phone_number }
            ]
        });

        if (matchedUsers.length) throw new BadRequestException({ success: false, error: { message: 'Email or phone number in use' } });

        const passwordHash = await hash(customerData.password!, 10);
        const user = await this.userModel.create({
            email: customerData.email,
            home_address: customerData.home_address,
            phone_number: customerData.phone_number,
            password_hash: passwordHash,
            auth_providers: [customerData.auth_provider],
            role: customerData.role
        });

        const access_token = await this.generateJWT({ sub: user.id, role: user.role }, 'my_secret');
        return access_token;

    }

    async createCourier(courierData: CreateCourierDto) { 
        const matchedUsers = await this.userModel.find({
            $or: [
                { email: courierData.email },
                { phone_number: courierData.phone_number }
            ]
        });

        if (matchedUsers.length) throw new BadRequestException({ success: false, error: { message: 'Email or phone number in use' } });

        const passwordHash = await hash(courierData.password_hash!, 10);
        const user = await this.userModel.create({
            email: courierData.email,
            home_address: courierData.home_address,
            phone_number: courierData.phone_number,
            password_hash: passwordHash,
            auth_providers: [courierData.auth_provider],
            role: courierData.role
        });
    }

    async createAdmin(@Body() adminData: CreateAdminDto) {

        const matchedUsers = await this.userModel.find({
            $or: [
                { email: adminData.email },
                { phone_number: adminData.phone_number }
            ]
        });
        
        if (matchedUsers.length) throw new BadRequestException({ success: false, error: { message: 'Email or phone number in use' } });

        const admin = await this.userModel.create({
            email: adminData.email,
            home_address: adminData.home_address,
            phone_number: adminData.phone_number,
            password_hash: await hash(adminData.password_hash!, 10),
            auth_providers: [adminData.auth_provider],
            role: adminData.role
        });

        const access_token = await this.generateJWT({ sub: admin.id, role: admin.role }, 'my_secret');
        return {success: true, access_token: access_token};
    }

    async createCustomerOrSignInWithGoogle() { }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new BadRequestException({ success: false, error: { message: 'Invalid credentials' } });

        const passwordsMatch = await this.verifyPassword(password, user.password_hash!);
        if (!passwordsMatch) throw new BadRequestException({ success: false, error: { message: 'Invalid credentials' } });

        const access_token = await this.generateJWT({ sub: user.id, role: user.role }, 'my_secret');
        return access_token;
    }


    private async generateJWT(payload: Record<string, any>, secret: string) {
        return this.jwtService.signAsync(payload, { secret })
    }

    private async verifyPassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
