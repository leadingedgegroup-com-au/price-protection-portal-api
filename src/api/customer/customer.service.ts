import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddCustomerDto, FilterCustomers, UpdateCustomerDto } from 'src/dtos';
import { Customers } from 'src/entities';
import { Repository } from 'typeorm';
import { GroupService } from '../group/group.service';

@Injectable()
export class CustomerService {

    constructor(
        private readonly GroupService: GroupService,
        @InjectRepository(Customers) private CustomersRepository: Repository<Customers>
    ) { }

    public async LIST(filter: FilterCustomers): Promise<Customers[]> {

        return await this.CustomersRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.Group', 'Group')
            .where('customer.IsActive = :IsActive AND customer.IsDelete = :IsDelete', {
                IsActive: true,
                IsDelete: false,
            })
            .orderBy(`customer.${filter.SortColumn || 'CreatedAt'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Customers> {

        return await this.CustomersRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.Group', 'Group')
            .where('customer.IsActive = :IsActive AND customer.IsDelete = :IsDelete AND customer.ID = :ID', {
                ID: ID,
                IsActive: true,
                IsDelete: false,
            })
            .orderBy(`customer.CreatedAt`, 'DESC')
            .getOne();
    }

    public async INSERT(DTO: AddCustomerDto): Promise<Customers> {

        let isExist: Customers = await this.CustomersRepository
            .createQueryBuilder('customer')
            .where('LOWER(customer.EntityId) = LOWER(:EntityId) AND customer.IsActive = :IsActive AND customer.IsDelete = :IsDelete', {
                EntityId: DTO.EntityId.trim(),
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('customer.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the customer ${DTO.EntityId} was already found.`) }

        return await this.CustomersRepository.save({
            State: DTO.State,
            Suburb: DTO.Suburb,
            Company: DTO.Company,
            Address: DTO.Address,
            EntityId: DTO.EntityId.trim(),
            CategoryType: DTO.CategoryType,
            CategoryGroup: DTO.CategoryGroup,
            CompanyLegalName: DTO.CompanyLegalName,
            Group: await this.GroupService.GET(DTO.GroupId)
        });
    }

    public async UPDATE(ID: number, DTO: UpdateCustomerDto): Promise<Customers> {

        let isExist: Customers = await this.CustomersRepository
            .createQueryBuilder('customer')
            .where('customer.ID != :ID AND LOWER(customer.EntityId) = LOWER(:EntityId) AND customer.IsActive = :IsActive AND customer.IsDelete = :IsDelete', {
                ID: ID,
                EntityId: DTO.EntityId.trim(),
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('customer.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the customer ${DTO.EntityId} was already found.`) }

        return await this.CustomersRepository
            .update(ID, {
                State: DTO.State,
                Suburb: DTO.Suburb,
                Company: DTO.Company,
                Address: DTO.Address,
                EntityId: DTO.EntityId.trim(),
                CategoryType: DTO.CategoryType,
                CategoryGroup: DTO.CategoryGroup,
                CompanyLegalName: DTO.CompanyLegalName,
                Group: await this.GroupService.GET(DTO.GroupId)
            }).then(async (res: any) => { return await this.GET(ID) });
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.CustomersRepository.update(ID, {
            IsActive: false,
            IsDelete: true,
        });
    }
}
