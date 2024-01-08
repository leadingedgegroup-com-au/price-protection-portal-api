import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddSupplierDto, FilterSuppliers, UpdateSupplierDto } from 'src/dtos';
import { Suppliers } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SupplierService {

    constructor(@InjectRepository(Suppliers) private SuppliersRepository: Repository<Suppliers>,) { }


    public async LIST(filter: FilterSuppliers): Promise<Suppliers[]> {

        return await this.SuppliersRepository
            .createQueryBuilder('supplier')
            .where('supplier.IsActive = :IsActive AND supplier.IsDelete = :IsDelete', {
                IsActive: true,
                IsDelete: false,
            })
            .orderBy(`supplier.${filter.SortColumn || 'CreatedAt'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Suppliers> {

        return await this.SuppliersRepository
            .createQueryBuilder('supplier')
            .where('supplier.IsActive = :IsActive AND supplier.IsDelete = :IsDelete AND supplier.ID = :ID', {
                ID: ID,
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('supplier.CreatedAt', 'DESC')
            .getOne();
    }


    public async INSERT(DTO: AddSupplierDto): Promise<Suppliers> {

        let isExist: Suppliers = await this.SuppliersRepository
            .createQueryBuilder('supplier')
            .where('LOWER(supplier.SupplierName) = LOWER(:SupplierName) AND LOWER(supplier.SupplierCode) = LOWER(:SupplierCode) AND supplier.IsActive = :IsActive AND supplier.IsDelete = :IsDelete', {
                SupplierName: DTO.SupplierName.trim(),
                SupplierCode: DTO.SupplierCode.trim(),
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('supplier.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the supplier ${DTO.SupplierName} was already found.`) }

        return await this.SuppliersRepository.save({
            SupplierName: DTO.SupplierName.trim(),
            SupplierCode: DTO.SupplierCode.trim(),
            Email: DTO.Email?.toLowerCase().trim(),
            State: DTO.State,
            Suburb: DTO.Suburb,
            PostCode: DTO.PostCode,
            IsActive: DTO.IsActive
        });
    }

    public async UPDATE(ID: number, DTO: UpdateSupplierDto): Promise<Suppliers> {

        let isExist: Suppliers = await this.SuppliersRepository
            .createQueryBuilder('supplier')
            .where('supplier.ID != :ID AND LOWER(supplier.SupplierName) = LOWER(:SupplierName) AND LOWER(supplier.SupplierCode) = LOWER(:SupplierCode) AND supplier.IsActive = :IsActive AND supplier.IsDelete = :IsDelete', {
                ID: ID,
                SupplierName: DTO.SupplierName.trim(),
                SupplierCode: DTO.SupplierCode.trim(),
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('supplier.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the supplier ${DTO.SupplierName} was already found.`) }

        return await this.SuppliersRepository
            .update(ID, {
                SupplierName: DTO.SupplierName.trim(),
                SupplierCode: DTO.SupplierCode.trim(),
                Email: DTO.Email?.toLowerCase().trim(),
                State: DTO.State,
                Suburb: DTO.Suburb,
                PostCode: DTO.PostCode,
                IsActive: DTO.IsActive
            }).then(async (res: any) => { return await this.GET(ID) });
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.SuppliersRepository.update(ID, {
            IsActive: false,
            IsDelete: true,
        });
    }
}
