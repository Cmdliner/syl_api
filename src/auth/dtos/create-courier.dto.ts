import { Equals, IsEmail, IsEnum, IsIn, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, IsUrl } from "class-validator";
import { AuthProviders } from "src/lib/constants";

export class CreateCourierDto {
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

    @Equals('courier')
    readonly role: UserRole = 'courier';

}