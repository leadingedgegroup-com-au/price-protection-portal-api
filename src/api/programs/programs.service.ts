import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProgramAttributesDto, AddProgramsDto, FilterPrograms } from 'src/dtos';
import { ProgramAdmins, ProgramAttributes, ProgramGroups, Programs, Users } from 'src/entities';
import { Repository } from 'typeorm';
import { BrandService } from '../brand/brand.service';
import { SupplierService } from '../supplier/supplier.service';
import { GroupService } from '../group/group.service';
import { ICurrentUser } from 'src/helpers/current-user.decorator';
import { S3Service } from 'src/helpers/s3.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ProgramsService {

    constructor(
        @InjectRepository(Users) private UsersRepository: Repository<Users>,
        @InjectRepository(Programs) private ProgramsRepository: Repository<Programs>,
        @InjectRepository(ProgramGroups) private ProgramGroupsRepository: Repository<ProgramGroups>,
        @InjectRepository(ProgramAdmins) private ProgramAdminsRepository: Repository<ProgramAdmins>,
        @InjectRepository(ProgramAttributes) private ProgramAttributesRepository: Repository<ProgramAttributes>,
        private readonly S3Service: S3Service,
        private readonly BrandService: BrandService,
        private readonly GroupService: GroupService,
        private readonly SupplierService: SupplierService
    ) { }

    public async LIST(filter: FilterPrograms): Promise<Programs[]> {

        return await this.ProgramsRepository
            .createQueryBuilder('programs')
            .leftJoinAndSelect('programs.Brands', 'Brands')
            .leftJoinAndSelect('programs.Suppliers', 'Suppliers')
            .leftJoinAndSelect('programs.CreatedBy', 'CreatedBy')
            .leftJoinAndSelect('programs.Admins', 'Admins')
            .leftJoinAndSelect('Admins.User', 'User')
            .where('programs.IsDelete = :IsDelete', { IsDelete: false, })
            .orderBy(`programs.${filter.SortColumn || 'CreatedAt'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Programs> {

        return await this.ProgramsRepository
            .createQueryBuilder('programs')
            .leftJoinAndSelect('programs.Brands', 'Brands')
            .leftJoinAndSelect('programs.Suppliers', 'Suppliers')
            .leftJoinAndSelect('programs.Groups', 'Groups')
            .leftJoinAndSelect('Groups.Group', 'Group')
            .leftJoinAndSelect('programs.Admins', 'Admins')
            .leftJoinAndSelect('programs.Attributes', 'Attributes')
            .leftJoinAndSelect('Admins.User', 'User')
            .leftJoinAndSelect('programs.CreatedBy', 'CreatedBy')
            .where('programs.IsDelete = :IsDelete AND programs.ID = :ID', { IsDelete: false, ID: ID })
            .getOne();
    }

    public async INSERT(CurrentUser: ICurrentUser, DTO: AddProgramsDto): Promise<any> {
        return await this.ProgramsRepository.save({
            Title: DTO.Title?.trim(),
            Frequency: DTO.Frequency,
            StartDate: new Date(DTO.StartDate),
            EndDate: new Date(DTO.EndDate),
            ClaimDate: DTO.ClaimDate ? new Date(DTO.ClaimDate) : null,
            Weekday: DTO.Weekday,
            Brands: await this.BrandService.GET(DTO.BrandId),
            Suppliers: await this.SupplierService.GET(DTO.SupplierId),
            Code: `#${await this.ProgramsRepository.count() + 1}`,
            CreatedBy: await this.ProgramCreator(CurrentUser.i_nameid)
        }).then(async res => {
            for (let item of DTO.GroupIds) {
                await this.ProgramGroupsRepository.save({
                    Programs: res,
                    Group: await this.GroupService.GET(parseInt(item))
                });
            }
            for (let item of DTO.AdminIds) {
                await this.ProgramAdminsRepository.save({
                    Programs: res,
                    User: await this.ProgramCreator(parseInt(item))
                });
            }
        });
    }


    public async UPDATE(ID: number, DTO: AddProgramsDto): Promise<any> {

        return await this.ProgramsRepository
            .update(ID, {
                Title: DTO.Title?.trim(),
                Frequency: DTO.Frequency,
                StartDate: new Date(DTO.StartDate),
                EndDate: new Date(DTO.EndDate),
                ClaimDate: DTO.ClaimDate ? new Date(DTO.ClaimDate) : null,
                Weekday: DTO.Weekday,
                Brands: await this.BrandService.GET(DTO.BrandId),
                Suppliers: await this.SupplierService.GET(DTO.SupplierId),
            }).then(async (res: any) => {

                let $program = await this.GET(ID);

                await this.ProgramGroupsRepository.delete({
                    Programs: { ID: ID },
                }).then(async RES => {
                    for (let item of DTO.GroupIds) {
                        await this.ProgramGroupsRepository.save({
                            Programs: $program,
                            Group: await this.GroupService.GET(parseInt(item))
                        });
                    }
                });

                await this.ProgramAdminsRepository.delete({
                    Programs: { ID: ID },
                }).then(async RES => {
                    for (let item of DTO.AdminIds) {
                        await this.ProgramAdminsRepository.save({
                            Programs: $program,
                            User: await this.ProgramCreator(parseInt(item))
                        });
                    }
                });

                return await this.GET(ID);
            });
    }

    public async UPDATE_ATTRIBUTES(ID: number, DTO: AddProgramAttributesDto): Promise<any> {

        let isExist = await this.GET(ID);

        if (!isExist) { throw new ConflictException(`Invalid Parameter.`) }

        if (['Published', 'Closed'].includes(isExist?.Status)) { throw new ConflictException(`Program is already ${isExist?.Status?.toLowerCase()}.`) }

        return await this.ProgramAttributesRepository.delete({
            Programs: { ID: ID },
        }).then(async RES => {
            for (let item of DTO.Rows) {
                await this.ProgramAttributesRepository.save({
                    Programs: isExist,
                    ...item
                });
            }
            return isExist;
        });
    }

    public async GET_ATTRIBUTES(ID: number): Promise<ProgramAttributes[]> {
        return await this.ProgramAttributesRepository
            .createQueryBuilder('attributes')
            .leftJoin('attributes.Programs', 'Programs')
            .where('attributes.IsDelete = :IsDelete AND Programs.ID = :ID', { IsDelete: false, ID: ID })
            .getMany();
    }

    private async ProgramCreator(ID: number): Promise<Users> {

        return await this.UsersRepository
            .createQueryBuilder('users')
            .where('users.IsActive = :IsActive AND users.IsDelete = :IsDelete AND users.ID = :ID', {
                ID: ID,
                IsActive: true,
                IsDelete: false,
            })
            .orderBy('users.CreatedAt', 'DESC')
            .getOne();
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.ProgramsRepository.update(ID, {
            Status: 'Archived',
            IsActive: false,
            IsDelete: true,
        });
    }

    public async UPDATE_STATUS(ID: number): Promise<any> {
        let program = await this.GET(ID);
        return await this.ProgramsRepository.update(ID, {
            Status: '',
            IsActive: !program.IsActive,
        });
    }

    public async UPLOAD_SKU(ID: number, file: Express.Multer.File) {
        let [attachment] = await Promise.all([await this.S3Service.upload('Programs/' + ID, file.buffer)]);
        return await this.ProgramsRepository.update({ ID: ID }, { Attachment: attachment?.Key }).then(async (res: any) => { return attachment; });
    }

    public async GET_RAW_SKU(ID: number): Promise<{ sku: Array<any[]>, default: boolean }> {

        let program: Programs = await this.ProgramsRepository
            .createQueryBuilder('programs')
            .where('programs.IsDelete = :IsDelete AND programs.ID = :ID', { IsDelete: false, ID: ID })
            .getOne();

        if (program && program?.Attachment?.length > 0) {

            let excelBuffer = await this.S3Service.extract(program?.Attachment);
            const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            return { default: false, sku: xlsx.utils.sheet_to_json(worksheet, { defval: '', raw: false, dateNF: 'dd/mm/yyyy' }) };
            //?.map((item: any, index: number) => {
            //     return { uid: index + 1, ...item, 'Sales Units': '', 'Stock On Order Units': '', 'Stock On Hand Units': '' }
            //});
        } else {
            return { default: true, sku: [] };
        }
    }
}
