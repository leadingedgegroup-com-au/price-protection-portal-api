import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from "./";
import { SystemRoles } from "src/enums";

export class AddUserDto {

    @ApiProperty({ default: '', nullable: false, })
    FirstName: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    LastName?: string;

    @ApiProperty({ default: '', nullable: false, })
    Email: string;

    @ApiProperty({ default: '', enum: [SystemRoles.ADMIN, SystemRoles.MEMBER], nullable: false })
    Role: SystemRoles.ADMIN | SystemRoles.MEMBER;

    @ApiPropertyOptional({ default: '', nullable: true, })
    NetSuiteEntityId: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    NetSuiteRole: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    ContactNo: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Suburb: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    State: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    PostCode: string;

    @ApiProperty({ default: true, nullable: false })
    IsActive: boolean;
}

export class UpdateProfileDto {

    @ApiProperty({ default: '', nullable: false, })
    FirstName: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    LastName?: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    ContactNo: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Suburb: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    State: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    PostCode: string;
}


export class FilterUsers extends BaseFilteration {

    @ApiPropertyOptional({ default: 0, nullable: true, })
    Skip?: number;

    @ApiPropertyOptional({ default: 'ADMIN', nullable: true, })
    Role?: string;
}
