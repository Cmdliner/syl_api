import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UserLoginDto } from './dtos/user-login.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async signup(@Body() createCustomerDto: CreateCustomerDto) {
        const access_token = await this.authService.createCustomer(createCustomerDto);
        return { success: true, access_token };
    }

    @Post('google/activate')
    async googleAuthenticate() { }

    @Post('courier/register')
    async registerCourier() { }

    @Post('admin/register')
    async registerAdmin() { }

    @Post('login')
    async login(@Body() loginDto: UserLoginDto) {
        const access_token = await this.authService.login(loginDto.email, loginDto.password);
        return { success: true, access_token };
    }

}
