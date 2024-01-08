import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChangePassword, ForgotPassword, QueuePayload, ResetPassword } from 'src/dtos';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import appConfiguration from 'src/app.configuration';
import appConstants from 'src/app.constants';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entities';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bull';
import Constants from 'src/app.constants';
import { Queue } from 'bull';
import { NotificationTemplates } from 'src/helpers/notification.templates';
import { NotificationTypes } from 'src/enums';
import { Request, Response } from 'express';

@Injectable()
export class PasswordService {

    private readonly logger: Logger = new Logger(PasswordService.name);

    constructor(
        private readonly JwtService: JwtService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @InjectRepository(Users) private UsersRepository: Repository<Users>,
        @InjectQueue(Constants.QUEUE.CONSUMERS.NOTIFICATION) private NotificationQueue: Queue
    ) { }

    public async forgot(request: Request, query: ForgotPassword) {
        // First Verify the identity exists inside the sso db of not,
        const User = await this.verifyIdentityByEmail(query.Email);

        // Check how many attempts are occurs by this particular user. 
        // Maximum 3 attempts are allowed within 5 minutes.

        let attempts: number = (await this.cache.store.keys(`${appConstants.REDIS.FP_OTP}::${appConfiguration().ENVIRONMENT}::${User.ID}::*`))?.length

        console.log('Total Number Of Attempts Till Time ==>', attempts);

        if (attempts <= 3) {

            let x_tenant_referer_fp_tag: string = Math.random().toString(36);

            let next_attempt_key = `${appConstants.REDIS.FP_OTP}::${appConfiguration().ENVIRONMENT}::${User.ID}::${query.Email}::#${x_tenant_referer_fp_tag}`;

            let x_tenant_referer = request.headers['x-tenant-referer'];

            let x_tenant_referer_fp_token: string = await this.JwtService.signAsync({
                payload: {
                    email: query.Email,
                    timestamp: new Date(),
                    identity: User.ID,
                    tag: x_tenant_referer_fp_tag,
                    environment: `${appConfiguration().ENVIRONMENT}`,
                }
            });

            let x_tenant_referer_fp_url =
                (x_tenant_referer || appConfiguration().PORTAL.HOST) + `/authentication/reset-password?token=${x_tenant_referer_fp_token}`
            // console.log('Generated Token:', x_tenant_referer_fp_token);

            return await Promise.all([
                await this.cache.set(next_attempt_key, { token: x_tenant_referer_fp_token }, 1800),
                await this.sendResetPasswordInvitation(User, x_tenant_referer_fp_url)
            ]).then(() => { return { tag: x_tenant_referer_fp_tag, status: true } }).catch(() => { return { tag: null, status: false } });

        } else {
            throw new ForbiddenException(`Sorry, You have reached your limits. You can try after next 5 mintues.`);
        }
    }

    private async verifyIdentityByEmail(email: string): Promise<Users> {
        let User: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .where('LOWER(users.Email) = LOWER(:Email)', {
                Email: email,
            }).getOne();

        console.log(User)

        if (!User) {
            throw new ConflictException(`Sorry, It's seems that your email address is not registered.`)
        }

        return User;
    }

    private async sendResetPasswordInvitation(User: Users, link: string) {
        await this.PublishNotifications({
            Channel: 'email',
            UID: User.Email?.toLowerCase()?.trim(),
            Template: NotificationTemplates.ForgotPasswordLink.email,
            Variables: [
                {
                    Key: 'FP_LINK',
                    Value: link
                },
                {
                    Key: 'FirstName',
                    Value: User.FirstName?.trim()
                },
            ],
            Email: {
                type: NotificationTypes.NOTICE,
                to: User.Email?.toLowerCase()?.trim(),
                subject: 'Reset your password'
            },
            Cause: 'FORGOT_PASSWORD'
        });
    }

    public async reset(query: ResetPassword) {

        let key = `${appConstants.REDIS.FP_OTP}::${query.environment}::${query.identity}::${query.email}::#${query.tag}`;

        let RedisCache = await this.cache.get(key);

        if (RedisCache) {

            if (query.token === RedisCache['token']) {

                return await this.UsersRepository
                    .update({ ID: Number(query.identity) }, { Password: await bcrypt.hash(query.password, 12) })
                    .then((async res => {

                        let User: Users = await this.UsersRepository
                            .createQueryBuilder('users')
                            .where('LOWER(users.Email) = LOWER(:Email)', {
                                Email: query.email?.toLowerCase()?.trim(),
                            }).getOne();

                        return await Promise.all([
                            await this.cache.del(key),
                            await this.sendResetPasswordOnSuccessInvitation(User)
                        ]).then(res => {
                            return { status: true }
                        }).catch(e => {
                            return { status: false }
                        });
                    }));
            }
            throw new ForbiddenException(`[Invalid] : Verify that you have the correct token and that it hasn't expired.`)

        } else {
            throw new ForbiddenException(`Sorry, Invalid request processed.`);
        }
    }

    public async PublishNotifications(data: QueuePayload) {
        await this.NotificationQueue.add(Constants.QUEUE.PUBLISHERS.NOTIFY, data);
        this.logger.log(`A new lob published inside the ${this.NotificationQueue.name}`);
        return true;
    }

    private async sendResetPasswordOnSuccessInvitation(User: Users) {
        console.log('Sending reset password invitation email...');
        await this.PublishNotifications({
            Channel: 'email',
            UID: User.Email?.toLowerCase()?.trim(),
            Template: NotificationTemplates.ResetPassword.email,
            Variables: [
                {
                    Key: 'FirstName',
                    Value: User.FirstName?.trim()
                },
            ],
            Email: {
                type: NotificationTypes.NOTICE,
                to: User.Email?.toLowerCase()?.trim(),
                subject: 'Reset your password'
            },
            Cause: 'RESET_PASSWORD'
        });
    }

    public async ChangePassword(ChangePasswordDto: ChangePassword) {
        const { CurrentPassword, NewPassword, ID } = ChangePasswordDto;

        // EXTRACT THE USER PASSWORD.
        let User: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .addSelect(['users.Password'])
            .where('users.ID = :ID', {
                ID: ID,
            })
            .getOne();

        //Check if the user exists or not
        if (!User) {
            throw new NotFoundException('User not found');
        }

        if (!CurrentPassword || !User.Password) {
            throw new BadRequestException('Current password or user password is undefined or null');
        }
        // Validate the current password
        const IsValidPassword = await bcrypt.compare(CurrentPassword, User.Password);

        if (!IsValidPassword) {
            throw new ForbiddenException('Current password does not match with the actual password stored in the database.');
        }

        const HashedNewPassword = await bcrypt.hash(NewPassword, 12);

        await this.UsersRepository.update({ ID: User.ID }, { Password: HashedNewPassword });

        return { message: 'Password changed successfully' };
    }
}
