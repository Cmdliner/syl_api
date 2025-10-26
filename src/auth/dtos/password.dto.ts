import { IsEmail, IsJWT, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {

    @IsEmail()
    email: string;

}

export class ResetPasswordDto {
    @IsJWT()
    token: string;

    @IsString()
    @IsNotEmpty()
    new_password: string;
}