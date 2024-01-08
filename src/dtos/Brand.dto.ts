import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from "./";

export class AddBrandDto {

    @ApiProperty({ default: '', nullable: false, })
    Brand: string;

    @ApiProperty({ default: '', nullable: true, })
    SortCode: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Description: string;

    @ApiProperty({ default: true, nullable: false })
    IsActive: boolean;
}

export class UpdateBrandDto extends PartialType(AddBrandDto) { }

export class FilterBrands extends BaseFilteration { }
