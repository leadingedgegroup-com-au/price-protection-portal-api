import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class ForgotPassword {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    Email: string;
}

export class ResetPassword {

    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 10000, default: '' })
    token: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    environment: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 10000, default: '' })
    tag: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    identity: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    password: string;
}

export class ChangePassword {

    @IsNotEmpty()
    @ApiProperty({ default: '' })
    ID: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 8, maxLength: 100, default: '' })
    CurrentPassword: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 8, maxLength: 100, default: '' })
    NewPassword: string;
}



