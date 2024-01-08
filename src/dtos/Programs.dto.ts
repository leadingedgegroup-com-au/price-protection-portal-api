import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from "./";

export class AddProgramsDto {

    @ApiProperty({ default: '', nullable: false, })
    Title: string;

    @ApiProperty({ default: '', nullable: false, })
    BrandId: number;

    @ApiProperty({ default: '', nullable: false, })
    SupplierId: number;

    @ApiProperty({ default: '', nullable: false, })
    Frequency: string;

    @ApiProperty({ default: '', nullable: false, })
    Weekday: string;

    @ApiProperty({ default: '', nullable: false, })
    StartDate: string;

    @ApiProperty({ default: '', nullable: false, })
    EndDate: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    ClaimDate: string;

    @ApiProperty({ default: [], nullable: false, })
    GroupIds: string[];

    @ApiPropertyOptional({ default: [], nullable: true, })
    AdminIds: string[];
}

class Item {
    Column: string;
    DataType: string;
    Reference: string
}

export class AddProgramAttributesDto {
    @ApiProperty({ default: [], nullable: false, })
    Rows: Item[];
}

export class FilterPrograms extends BaseFilteration { }