import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddGroupDto, FilterGroups, UpdateGroupDto } from 'src/dtos';
import { Groups } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {

    constructor(@InjectRepository(Groups) private GroupsRepository: Repository<Groups>,) { }

    public async LIST(filter: FilterGroups): Promise<Groups[]> {

        return await this.GroupsRepository
            .createQueryBuilder('group')
            .where('group.IsDelete = :IsDelete', { IsDelete: false, })
            .orderBy(`group.${filter.SortColumn || 'CreatedAt'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Groups> {

        return await this.GroupsRepository
            .createQueryBuilder('group')
            .where('group.IsDelete = :IsDelete AND group.ID = :ID', {
                ID: ID,
                IsDelete: false,
            })
            .orderBy('group.CreatedAt', 'DESC')
            .getOne();
    }


    public async INSERT(DTO: AddGroupDto): Promise<Groups> {

        let isExist: Groups = await this.GroupsRepository
            .createQueryBuilder('group')
            .where('LOWER(group.Group) = LOWER(:Group) AND LOWER(group.SortCode) = LOWER(:SortCode) AND group.IsDelete = :IsDelete', {
                Group: DTO.Group.trim(),
                SortCode: DTO.SortCode.trim(),
                IsDelete: false,
            })
            .orderBy('group.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the group ${DTO.Group} was already found.`) }

        return await this.GroupsRepository.save({
            Group: DTO.Group.trim(),
            SortCode: DTO.SortCode.trim(),
            Description: DTO.Description,
            IsActive: DTO.IsActive
        });
    }

    public async UPDATE(ID: number, DTO: UpdateGroupDto): Promise<Groups> {

        let isExist: Groups = await this.GroupsRepository
            .createQueryBuilder('group')
            .where('group.ID != :ID AND LOWER(group.Group) = LOWER(:Group) AND LOWER(group.SortCode) = LOWER(:SortCode) AND group.IsDelete = :IsDelete', {
                ID: ID,
                Group: DTO.Group.trim(),
                SortCode: DTO.SortCode.trim(),
                IsDelete: false,
            })
            .orderBy('group.CreatedAt', 'DESC')
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the group ${DTO.Group} was already found.`) }

        return await this.GroupsRepository
            .update(ID, {
                Group: DTO.Group.trim(), SortCode: DTO.SortCode.trim(),
                Description: DTO.Description, IsActive: DTO.IsActive
            }).then(async (res: any) => { return await this.GET(ID) });
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.GroupsRepository.update(ID, {
            IsActive: false,
            IsDelete: true,
        });
    }
}
