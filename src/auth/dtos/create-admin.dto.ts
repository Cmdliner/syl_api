import { IsEmail, IsPhoneNumber, IsString, IsIn, IsNotEmpty, IsStrongPassword, IsUrl, IsEnum } from "class-validator";
import { AuthProviders } from "src/lib/constants";

export class CreateAdminDto {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsNotEmpty()
    home_address: string;

    @IsStrongPassword()
    password_hash?: string;

    @IsUrl()
    profile_img_url?: string;

    @IsEnum(AuthProviders)
    auth_provider: AuthProvider;

    role = 'admin';
}