import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SignInDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ minLength: 0, maxLength: 100, default: '' })
    Email: string;

    @IsNotEmpty()
    @ApiProperty({ minLength: 8, maxLength: 12, default: '' })
    Password: string;
}