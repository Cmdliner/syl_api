import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async signup(@Body() createCustomerDto: CreateCustomerDto) {
        await this.authService.createCustomer(createCustomerDto);
    }

    @Post('google/activate')
    async googleAuthenticate() {}

    @Post('courier/register')
    async registerCourier() {}

    @Post('admin/register')
    async registerAdmin() {}

    @Post('login')
    async login() {}

}
