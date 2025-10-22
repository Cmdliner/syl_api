import { Equals, IsEmail, IsEnum, IsIn, IsNotEmpty, IsPhoneNumber, IsStrongPassword } from "class-validator";
import { AuthProviders } from "src/lib/constants";
import { Role } from "src/lib/roles.enum";

export class CreateRiderDto {
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phone_number: string;

    @IsNotEmpty()
    home_address: string;

    @IsStrongPassword()
    password?: string;

    @IsEnum(AuthProviders)
    auth_provider: AuthProvider;

    @Equals('rider')
    readonly role: Role = Role.RIDER;

}