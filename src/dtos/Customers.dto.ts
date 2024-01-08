import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { BaseFilteration } from ".";

export class AddCustomerDto {

    @ApiProperty({ default: '', nullable: false, })
    EntityId: string;

    @ApiPropertyOptional({ default: '', nullable: false, })
    Company: string;

    @ApiProperty({ default: '', nullable: false, })
    CompanyLegalName: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    CategoryType: string;

    @ApiProperty({ default: '', nullable: false, })
    CategoryGroup: string;

    @ApiPropertyOptional({ default: 'Australia', nullable: true, })
    Suburb: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    State: string;

    @ApiPropertyOptional({ default: '', nullable: true, })
    Address: string;

    @ApiProperty({ default: '', nullable: false, })
    GroupId: number;
}

export class UpdateCustomerDto extends PartialType(AddCustomerDto) { }

export class FilterCustomers extends BaseFilteration { }

export class QPCustomers {

    @ApiProperty({ default: '', nullable: false })
    EntityId: string;
}

export class QPContacts {

    @ApiProperty({ default: '', nullable: false })
    Email: string;
}
