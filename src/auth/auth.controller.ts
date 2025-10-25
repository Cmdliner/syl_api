import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreateRiderDto } from './dtos/create-rider.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/password.dto';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { Request, Response } from 'express';

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

    @Post('rider/register')
    async registerRider(@Body() riderData: CreateRiderDto) {
        const access_token = await this.authService.createRider(riderData);
        return { success: true, access_token };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login/rider')
    async loginRider(@Body() loginDto: UserLoginDto) {
        const access_token = await this.authService.loginRider(loginDto.email, loginDto.password);
        return { success: true, access_token };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login/customer')
    async loginCustomer(@Body() loginDto: UserLoginDto) {
        const access_token = await this.authService.loginCustomer(loginDto.email, loginDto.password);
        return { success: true, access_token };
    }

    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return { success: true, message: 'Password reset link sent to email' };
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-otp/link/:otpId')
    async verifyOtp(@Param('otpId', IsObjectIdPipe) otpId: MongoId, @Res() res: Response) {
        const token = await this.authService.verifyOtp(otpId);

        const frontendUrl = process.env.FRONTEND_URL;
        const redirectUrl = `${frontendUrl}/reset-password/${token}`;

        return res.redirect(redirectUrl);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('reset-password/')
    async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(token, resetPasswordDto.new_password);
        return { success: true, message: 'Password reset successfully' };
    }
}