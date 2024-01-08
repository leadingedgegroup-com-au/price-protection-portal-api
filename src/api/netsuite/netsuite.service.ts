import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NetSuiteHandler } from 'src/middlewares';
import { Customers, Users } from 'src/entities';
import { QPContacts, QPCustomers } from 'src/dtos';
import { Repository } from 'typeorm';
import { SystemRoles } from 'src/enums';

@Injectable()
export class NetsuiteService extends NetSuiteHandler {

    constructor(
        @InjectRepository(Users) private UsersRepository: Repository<Users>,
        @InjectRepository(Customers) private CustomersRepository: Repository<Customers>) {
        super();
    }

    public async VerifyCustomer(query: QPCustomers): Promise<any> {

        let isExist: Customers = await this.CustomersRepository
            .createQueryBuilder('customer')
            .where('customer.IsActive = :IsActive AND customer.IsDelete = :IsDelete AND customer.EntityId = :EntityId', {
                IsActive: true,
                IsDelete: false,
                EntityId: query.EntityId.trim(),
            })
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the customer ${query.EntityId} was already found.`) }

        let NetSuiteEntity: any = await this.FindAllCustomerIds(query.EntityId) || {};

        if ((NetSuiteEntity != false) && (NetSuiteEntity.count != 0 && NetSuiteEntity.count > 0)) {

            let NetSuiteCustomer: any = await this.FindParticularCustomerById(NetSuiteEntity?.items[0]?.id) || {};

            if ((NetSuiteCustomer != false) && (NetSuiteCustomer != null)) {

                let NetSuiteContact: any = await this.FindParticularContactById(NetSuiteCustomer?.contact?.id) || {};

                if ((NetSuiteContact != false) && (NetSuiteContact != null)) {
                    NetSuiteCustomer['PrimaryContactRelation'] = NetSuiteContact;
                }

                return NetSuiteCustomer;
            } else {
                throw new ConflictException(`Invalid Parameter.`);
            }
        }
        else {
            throw new ConflictException(`Invalid customer entityId processed.`);
        }
    }

    public async VerifyContact(query: QPContacts): Promise<any> {

        let isExist: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('LOWER(users.Email) = LOWER(:Email) AND users.Role = :Role AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete', {
                IsActive: true,
                IsDelete: false,
                Role: SystemRoles.MEMBER,
                Email: query.Email?.trim()
            })
            .getOne();

        if (isExist) { throw new ConflictException(`An existing record with the email ${query.Email} was already found.`) }

        let NetSuiteContact: any = await this.FindAllContacts(query.Email) || {};

        if ((NetSuiteContact != false) && (NetSuiteContact.count != 0 && NetSuiteContact.count > 0)) {

            return await this.FindParticularContactById(NetSuiteContact?.items[0].id) || {};
        }
        else {
            throw new ConflictException(`Invalid customer contact email processed.`);
        }
    }
}
