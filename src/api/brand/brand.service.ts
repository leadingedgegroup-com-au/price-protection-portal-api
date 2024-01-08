import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddBrandDto, UpdateBrandDto, FilterBrands } from 'src/dtos';
import { Brands } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {

    constructor(@InjectRepository(Brands) private BrandsRepository: Repository<Brands>,) { }

    public async LIST(filter: FilterBrands): Promise<Brands[]> {

        return await this.BrandsRepository
            .createQueryBuilder('brand')
            .where('brand.IsDelete = :IsDelete', { IsDelete: false })
            .orderBy(`brand.${filter.SortColumn || 'CreatedAt'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Brands> {

        return await this.BrandsRepository
            .createQueryBuilder('brand')
            .where('brand.IsDelete = :IsDelete AND brand.ID = :ID', {
                ID: ID,
                IsDelete: false,
            })
            .orderBy('brand.CreatedAt', 'DESC')
            .getOne();
    }


    public async INSERT(DTO: AddBrandDto): Promise<Brands> {

        let isExist: Brands = await this.BrandsRepository
            .createQueryBuilder('brand')
            .where('LOWER(brand.Brand) = LOWER(:Brand) AND brand.IsDelete = :IsDelete', {
                Brand: DTO.Brand.trim(),
                IsDelete: false,
            })
            .orderBy('brand.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the brand ${DTO.Brand} was already found.`) }

        return await this.BrandsRepository.save({
            Brand: DTO.Brand.trim(),
            SortCode: DTO.SortCode.trim(),
            Description: DTO.Description,
            IsActive: DTO.IsActive
        });
    }

    public async UPDATE(ID: number, DTO: UpdateBrandDto): Promise<Brands> {

        let isExist: Brands = await this.BrandsRepository
            .createQueryBuilder('brand')
            .where('brand.ID != :ID AND LOWER(brand.Brand) = LOWER(:Brand) AND brand.IsDelete = :IsDelete', {
                ID: ID,
                Brand: DTO.Brand.trim(),
                SortCode: DTO.SortCode.trim(),
                IsDelete: false,
            })
            .orderBy('brand.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the brand ${DTO.Brand} was already found.`) }

        return await this.BrandsRepository
            .update(ID, {
                Brand: DTO.Brand.trim(), SortCode: DTO.SortCode.trim(),
                Description: DTO.Description, IsActive: DTO.IsActive
            }).then(async (res: any) => { return await this.GET(ID) });
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.BrandsRepository.update(ID, {
            IsActive: false,
            IsDelete: true,
        });
    }
}

