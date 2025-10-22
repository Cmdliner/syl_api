import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateRiderDto } from './dtos/create-rider.dto';
import { Customer } from 'src/users/schemas/discriminators/customer.schema';
import { Rider } from 'src/users/schemas/discriminators/rider.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Rider.name) private readonly riderModel: Model<Rider>,
        private readonly jwtService: JwtService
    ) { }

    async createCustomer(customerData: CreateCustomerDto) {
        const existingCustomers = await this.customerModel.find({
            role: customerData.role,
            $or: [
                { email: customerData.email },
                { phone_number: customerData.phone_number },
                
            ]
        });

        if (existingCustomers.length) throw new ConflictException({ message: 'Email or phone number in use' });

        const passwordHash = await hash(customerData.password!, 10);
        const customer = await this.customerModel.create({
            email: customerData.email,
            home_address: customerData.home_address,
            phone_number: customerData.phone_number,
            password_hash: passwordHash,
            auth_providers: [customerData.auth_provider],
            role: customerData.role
        });

        const access_token = await this.generateJWT({ sub: customer.id, role: customer.role });
        return access_token;

    }

    async createRider(riderData: CreateRiderDto) {
        const existingRiders = await this.riderModel.find({
            role: riderData.role,
            $or: [
                { email: riderData.email },
                { phone_number: riderData.phone_number }
            ]
        });

        if (existingRiders.length) throw new ConflictException({ message: 'Email or phone number in use' });

        const passwordHash = await hash(riderData.password!, 10);
        const rider = await this.riderModel.create({
            email: riderData.email,
            home_address: riderData.home_address,
            phone_number: riderData.phone_number,
            password_hash: passwordHash,
            auth_providers: [riderData.auth_provider],
            role: riderData.role
        });

        return this.generateJWT({ sub: rider.id, role: rider.role });
    }

    async createCustomerOrSignInWithGoogle() { }

    async loginRider(email: string, password: string) {
        const user = await this.riderModel.findOne({ email });
        if (!user) throw new UnauthorizedException({ message: 'Invalid credentials' });

        const passwordsMatch = await this.verifyPassword(password, user.password_hash!);
        if (!passwordsMatch) throw new UnauthorizedException({ message: 'Invalid credentials' });

        const access_token = await this.generateJWT({ sub: user.id, role: user.role });
        return access_token;
    }
    
    async loginCustomer(email: string, password: string) {
        const user = await this.customerModel.findOne({ email });
        if (!user) throw new UnauthorizedException({ message: 'Invalid credentials' });

        const passwordsMatch = await this.verifyPassword(password, user.password_hash!);
        if (!passwordsMatch) throw new UnauthorizedException({ message: 'Invalid credentials' });

        const access_token = await this.generateJWT({ sub: user.id, role: user.role });
        return access_token;
    }

    private async generateJWT(payload: JwtPayload, secret: string = process.env.JWT_SECRET!) {
        return this.jwtService.signAsync<JwtPayload>(payload, { secret })
    }

    private async verifyPassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
