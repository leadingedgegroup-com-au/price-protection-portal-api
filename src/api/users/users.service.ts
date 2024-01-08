import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { NotificationTypes, SystemRoles } from 'src/enums';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddUserDto, FilterUsers, QueuePayload, UpdateProfileDto } from 'src/dtos';
import { InjectQueue } from '@nestjs/bull';
import Constants from 'src/app.constants';
import { Queue } from 'bull';
import { NotificationTemplates } from 'src/helpers/notification.templates';

@Injectable()
export class UsersService {

    private readonly logger: Logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(Users) private UsersRepository: Repository<Users>,
        @InjectQueue(Constants.QUEUE.CONSUMERS.NOTIFICATION) private NotificationQueue: Queue
    ) { }

    public async LIST(filter: FilterUsers): Promise<Users[]> {

        return await this.UsersRepository
            .createQueryBuilder('users')
            .where('users.ID != :SkipId AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete AND users.Role = :Role', {
                Role: (filter?.Role || 'ADMIN')?.toUpperCase(),
                SkipId: Number(filter?.Skip || 0),
                IsActive: true,
                IsDelete: false,
            })
            .orderBy(`users.${filter.SortColumn || 'ID'}`, filter.SortOrder || 'DESC')
            .getMany();
    }

    public async GET(ID: number): Promise<Users> {

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

    public async INSERT(DTO: AddUserDto): Promise<any> {

        this.logger.log("Cross checking user existance.");

        let isExist: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('LOWER(users.Email) = LOWER(:Email) AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete', {
                IsActive: true,
                IsDelete: false,
                Email: DTO.Email?.trim()
            })
            .getOne();

        if (!isExist) {

            this.logger.log(`Creating new user.`);

            let $password: string = await this.GeneratePassword();

            return await this.UsersRepository.save({
                FirstName: DTO.FirstName?.trim(),
                LastName: DTO.LastName?.trim(),
                Email: DTO.Email?.toLowerCase()?.trim(),
                ContactNo: DTO.ContactNo?.trim(),
                Suburb: DTO.Suburb?.trim(),
                State: DTO.State?.trim(),
                PostCode: DTO.PostCode?.trim(),
                Role: DTO.Role?.toUpperCase(),
                NetSuiteEntityId: DTO.NetSuiteEntityId,
                NetSuiteRole: DTO.NetSuiteRole,
                IsActive: DTO.IsActive,
                Password: await bcrypt.hash($password, 12),
            }).then(async (res: any) => {

                delete res?.Password;
                await this.NotifyWelcomeNotification($password, res);
                return res;
            });
        } else {
            throw new ConflictException(`An existing record with the same email ${DTO.Email} was already exist.`)
        }
    }

    private async NotifyWelcomeNotification(Password: string, User: Users) {
        await this.PublishNotifications({
            Channel: 'email',
            UID: User.Email?.toLowerCase()?.trim(),
            Template: NotificationTemplates.WelcomeInvitation.email,
            Variables: [
                {
                    Key: 'Email',
                    Value: User.Email?.toLowerCase()?.trim(),
                },
                {
                    Key: 'Password',
                    Value: Password
                },
                {
                    Key: 'FirstName',
                    Value: User.FirstName?.trim()
                },
                {
                    Key: 'Context',
                    Value: (User.Role === 'ADMIN') ?
                        `Your have been invited to manage Scans, Sales and Price Protection portal as an Admin. To visit the portal, Please click on the below button` :
                        `Your Leading Edge category manager has assigned you a login to the Scans, Sales and Price Protection portal.\r\nThis portal has a variety of benefits to your business and will ensure you are receiving all of the funds available to you from our trusted supplier partners.\r\nThe portal is multi-use and includes allowing members to input sales to claim scans, forecast sell-out and apply for price protection.`
                }
            ],
            Email: {
                type: NotificationTypes.NOTICE,
                to: User.Email?.toLowerCase()?.trim(),
                subject: 'Welcome to Leading Edge - Scan, Sales & Protection Portal'
            },
            Cause: 'ACCOUNT_CREATION'
        });
        await this.PublishNotifications({
            Channel: 'socket',
            UID: User.ID?.toString(),
            Template: NotificationTemplates.WelcomeInvitation.socket,
            Variables: [
                {
                    Key: 'Email',
                    Value: User.Email?.toLowerCase()?.trim(),
                },
                {
                    Key: 'Password',
                    Value: Password
                },
                {
                    Key: 'FirstName',
                    Value: User.FirstName?.trim()
                },
                {
                    Key: 'Context',
                    Value:
                        (User.Role === 'ADMIN') ?
                            `Your have been invited to manage Scans, Sales and Price Protection portal as an Admin. To visit the portal, Please click on the below button` :
                            `Your Leading Edge category manager has assigned you a login to the Scans, Sales and Price Protection portal.\r\nThis portal has a variety of benefits to your business and will ensure you are receiving all of the funds available to you from our trusted supplier partners.\r\nThe portal is multi-use and includes allowing members to input sales to claim scans, forecast sell-out and apply for price protection.`
                }
            ],
            Socket: {
                type: NotificationTypes.NOTICE,
                subject: `Hi ${User.FirstName?.trim()}`,
                body: (User.Role === 'ADMIN') ?
                    `Your have been invited to manage Scans, Sales and Price Protection portal as an Admin.` :
                    `Your Leading Edge category manager has assigned you a login to the Scans, Sales and Price Protection portal.\r\nThis portal has a variety of benefits to your business and will ensure you are receiving all of the funds available to you from our trusted supplier partners.\r\nThe portal is multi-use and includes allowing members to input sales to claim scans, forecast sell-out and apply for price protection.`
            },
            Cause: 'ACCOUNT_CREATION'
        });
    }

    public async UPDATE(ID: number, DTO: AddUserDto): Promise<any> {

        this.logger.log("Cross checking user existance.");

        let isExist: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('users.ID != :ID AND LOWER(users.Email) = LOWER(:Email) AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete', {
                ID: ID,
                IsActive: true,
                IsDelete: false,
                Email: DTO.Email?.trim()
            })
            .getOne();

        if (!isExist) {

            this.logger.log(`Creating new user.`);

            return await this.UsersRepository.update({ ID: ID }, {
                FirstName: DTO.FirstName?.trim(),
                LastName: DTO.LastName?.trim(),
                Email: DTO.Email?.toLowerCase()?.trim(),
                ContactNo: DTO.ContactNo?.trim(),
                Suburb: DTO.Suburb?.trim(),
                State: DTO.State?.trim(),
                PostCode: DTO.PostCode?.trim(),
                Role: DTO.Role?.toUpperCase(),
                NetSuiteEntityId: DTO.NetSuiteEntityId,
                NetSuiteRole: DTO.NetSuiteRole,
                IsActive: DTO.IsActive,
                UpdatedAt: new Date(),
            });
        } else {
            throw new ConflictException(`An existing record with the same email ${DTO.Email} was already exist.`)
        }
    }

    public async PROFILE(ID: number, DTO: UpdateProfileDto): Promise<any> {

        this.logger.log("Cross checking user existance.");

        let isExist: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('users.ID = :ID AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete', {
                ID: ID,
                IsActive: true,
                IsDelete: false,
            })
            .getOne();

        if (isExist) {

            return await this.UsersRepository.update({ ID: ID }, {
                FirstName: DTO.FirstName?.trim(),
                LastName: DTO.LastName?.trim(),
                ContactNo: DTO.ContactNo?.trim(),
                Suburb: DTO.Suburb?.trim(),
                State: DTO.State?.trim(),
                PostCode: DTO.PostCode?.trim(),
                UpdatedAt: new Date(),
            });
        } else {
            throw new ConflictException(`Invalid ID parsed.`)
        }
    }

    public async DELETE(ID: number): Promise<any> {

        return await this.UsersRepository.update(ID, {
            IsActive: false,
            IsDelete: true,
            UpdatedAt: new Date()
        });
    }

    public async PublishNotifications(data: QueuePayload) {
        await this.NotificationQueue.add(Constants.QUEUE.PUBLISHERS.NOTIFY, data);
        this.logger.log(`A new lob published inside the ${this.NotificationQueue.name}`);
        return true;
    }

    public async GeneratePassword(): Promise<string> {

        var length = 12,
            charset = "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
            password = "";

        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        return password;
    }

    public async onBoardAdministrator(): Promise<any> {

        this.logger.log("Cross Checking Administrator/Root user existance.");

        let isExist: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('users.IsActive = :IsActive AND users.IsDelete = :IsDelete AND users.Role = :Role', {
                IsActive: true,
                IsDelete: false,
                Role: SystemRoles.ROOT
            })
            .getOne();

        if (!isExist) {

            this.logger.log(`Creating administrator/root user.`);
            return await this.UsersRepository.save({
                FirstName: "Administrator",
                LastName: '',
                Email: 'rajendra.kumar@leadingedgegroup.com.au',
                ContactNo: "+91 9777497783",
                Suburb: 'India',
                State: 'Chandigarh',
                PostCode: '',
                Role: SystemRoles.ROOT,
                Password: await bcrypt.hash('root@ssp#leg', 12),
            });
        } else {
            this.logger.log(`Root User Already Exists, Inside the system, Skipping the creation of on boarding root user.`);
            return isExist;
        }
    }
}
