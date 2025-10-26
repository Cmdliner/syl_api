import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateRiderDto } from './dtos/create-rider.dto';
import { Customer } from 'src/users/schemas/discriminators/customer.schema';
import { Rider } from 'src/users/schemas/discriminators/rider.schema';
import { Otp } from '../users/schemas/otp.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Rider.name) private readonly riderModel: Model<Rider>,
        @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
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

    async forgotPassword(email: string) {
        const user = await this.customerModel.findOne({ email });
        if (!user) return;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpRecord = await this.otpModel.create({
            userId: user._id,
            token: otp,
            kind: 'password_reset',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });
        // !todo => Send OTP to user's email
        return;
    }

    async verifyOtp(otpId: MongoId) {
        const otpRecord = await this.otpModel.findById(otpId);
        if (!otpRecord) throw new NotFoundException({ message: 'OTP not found' });

        if (otpRecord.expiresAt < new Date()) throw new BadRequestException({ message: 'OTP has expired' });

        const passwordResetToken = await this.generateJWT({ sub: otpRecord.userId } as any, process.env.RESET_PASSWORD_SECRET!, '5m');

        return { success: true, message: 'OTP is valid', token: passwordResetToken };
    }

    async resetPassword(token: string, newPassword: string) {
        const payload = this.jwtService.verify<JwtPayload>(token, { secret: process.env.RESET_PASSWORD_SECRET! });

        const user = await this.userModel.findById(payload.sub);
        if (!user) throw new NotFoundException({ message: 'User not found' });

        const passwordHash = await hash(newPassword, 10);
        user.password_hash = passwordHash;
        await user.save();
    }

    private async generateJWT(payload: JwtPayload, secret: string = process.env.JWT_SECRET!, expiresIn: any = '30d') {
        return this.jwtService.signAsync<JwtPayload>(payload, { secret, expiresIn });
    }

    private async verifyPassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
