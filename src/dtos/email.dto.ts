import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";



export class attachmentReferences {
    @ApiProperty({ default: '' })
    filename: string;
    @ApiProperty({ default: '' })
    path: string;
}

export class MailDto {

    @IsNotEmpty()
    @ApiProperty({ default: '' })
    to: string;

    @ApiPropertyOptional({ default: '' })
    cc?: string;

    @ApiPropertyOptional({ default: '' })
    bcc?: string;

    @ApiPropertyOptional({ default: '' })
    subject: string;

    @ApiPropertyOptional({ default: '' })
    html?: string;

    @ApiPropertyOptional({ default: '' })
    text?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => attachmentReferences)
    @ApiPropertyOptional({ nullable: false, type: [attachmentReferences] })
    attachments?: attachmentReferences[];
}

export class EmailQueueJob {
    @IsNotEmpty()
    @ApiProperty()
    mail: MailDto
}


