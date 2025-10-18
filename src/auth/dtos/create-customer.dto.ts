import { IsEmail, IsPhoneNumber, IsNotEmpty, IsStrongPassword, IsUrl, IsEnum, Equals } from "class-validator";
import { AuthProviders } from "src/lib/constants";

export class CreateCustomerDto {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsNotEmpty()
    home_address: string;

    @IsStrongPassword()
    password?: string;

    // @IsUrl()
    // profile_img_url?: string;

    @IsEnum(AuthProviders)
    auth_provider: AuthProvider;

    @Equals('customer')
    readonly role: UserRole = 'customer';
}