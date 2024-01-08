import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from "./";

export class AddSupplierDto {

    @ApiProperty({ default: '', nullable: false, })
    SupplierName: string;

    @ApiProperty({ default: '', nullable: false, })
    SupplierCode: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Email: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Suburb: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    State: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    PostCode: string;

    @ApiProperty({ default: true, nullable: false })
    IsActive: boolean;
}

export class UpdateSupplierDto extends PartialType(AddSupplierDto) { }

export class FilterSuppliers extends BaseFilteration { }

