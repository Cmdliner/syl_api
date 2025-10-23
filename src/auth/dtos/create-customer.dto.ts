import { IsEmail, IsPhoneNumber, IsNotEmpty, IsStrongPassword, IsUrl, IsEnum, Equals } from "class-validator";
import { AuthProviders } from "src/lib/constants";
import { Role } from "../../common/enums/roles.enum";

export class CreateCustomerDto {
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

    @Equals('customer')
    readonly role: Role = Role.CUSTOMER;
}