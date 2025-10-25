export class ForgotPasswordDto {
    email: string;
}

export class ResetPasswordDto {
    token: string;
    new_password: string;
}