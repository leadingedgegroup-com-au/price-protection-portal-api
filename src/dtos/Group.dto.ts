import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from "./";

export class AddGroupDto {

    @ApiProperty({ default: '', nullable: false, })
    Group: string;

    @ApiProperty({ default: '', nullable: false, })
    SortCode: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Description: string;

    @ApiProperty({ default: true, nullable: false })
    IsActive: boolean;

}

export class UpdateGroupDto extends PartialType(AddGroupDto) { }

export class FilterGroups extends BaseFilteration { }
