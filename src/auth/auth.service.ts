import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async createCustomer(customerData: CreateCustomerDto) {
        const userExists = await this.userModel.find({
            $or: [
                { email: customerData.email },
                { phone_number: customerData.phone_number }
            ]
        });

        if (userExists) throw new BadRequestException({ success: false, error: { message: 'Email or phone number in use' } });

        const passwordHash = await hash(customerData.password!, 10);
        const user = await this.userModel.create({
            email: customerData.email,
            home_address: customerData.home_address,
            phone_number: customerData.phone_number,
            password_hash: passwordHash,
            auth_providers: [customerData.auth_provider],
            role: customerData.role
        });

        const accessToken = await this.generateJWT({ sub: user.id }, 'my_secret');
        return accessToken;

    }

    async createCourier() { }

    async createAdmin() { }

    async createCustomerOrSignInWithGoogle() { }

    async login() {

    }

    private async generateJWT(payload: Record<string, any>, secret: string) {
        return this.jwtService.signAsync(payload, { secret })
    }

    // private async verifyJWT()
}
