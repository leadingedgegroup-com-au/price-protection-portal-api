import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { SignInDto } from 'src/dtos';
import { Request, Response } from 'express';
import { Sessions, Users } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as useragent from 'express-useragent';
import appConstants from 'src/app.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SignInService {

    private readonly logger: Logger = new Logger(SignInService.name);

    constructor(
        private readonly JwtService: JwtService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @InjectRepository(Users) private UsersRepository: Repository<Users>,
        @InjectRepository(Sessions) private SessionsRepository: Repository<Sessions>,
    ) { }

    public async signin(DTO: SignInDto, request: Request): Promise<any> {

        let user: Users = await this.UsersRepository
            .createQueryBuilder('users')
            .addSelect('users.Password')
            .where('LOWER(users.Email) = LOWER(:Email) AND users.IsActive = :IsActive AND users.IsDelete = :IsDelete', {
                IsActive: true,
                IsDelete: false,
                Email: DTO.Email?.trim()
            })
            .getOne();

        if (user) {

            let match = await bcrypt.compare(DTO.Password, user.Password);

            if (match) {

                let session = await this.$session();

                let access_token = await this.JwtService.signAsync({
                    payload: {
                        i_nameid: user.ID,
                        i_role: user.Role,
                        i_email: user.Email,
                        i_unique_name: (user.FirstName + ' ' + user.LastName)?.trim(),
                        timestamp: new Date(),
                        i_session: session,
                    }
                });

                await this.SessionsRepository.save({
                    UID: user.ID,
                    Useragent: JSON.stringify(useragent.parse(request.headers['user-agent'])),
                    IP: String(request.headers['x-forwarded-for'] || request.connection.remoteAddress),
                    Token: access_token,
                    Session: session,
                    Sso: 'USER-NAME-PASSWORD-AUTHENTICATION'
                });

                let key = `${appConstants.REDIS.SSO}::${user.ID}::${session}`;

                await this.cache.set(key, { session, at: access_token }, 86400000);

                return { access_token };

            } else {
                throw new HttpException(`Invalid user name and password!.`, HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new HttpException(`Your account is blocked. Please contact to your category head.`, HttpStatus.CONFLICT);
        }

        return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJyYWplbmRyYS5rdW1hckBzaWduaXR5c29sdXRpb25zLmNvbSIsInJvbGUiOiJBRE1JTiIsInVuaXF1ZV9uYW1lIjoiUmFqZW5kcmEgS3VtYXIiLCJuYmYiOjE3MDE5MzQyNzAsImV4cCI6MTcwMjAyMDY3MCwiaWF0IjoxNzAxOTM0MjcwfQ.2JH1_QP8eSMeSleqM-lI3EriL53ROHRBw_deQ2xijMYKa8ACKKQKTbWTpfStg2FlacoHMmGwux6OnTA3Ir0DSA'
        // let identity: Identity = await this.IdentityRepository
        //     .createQueryBuilder('identity').where('identity.code = :code', {
        //         code: dto.user_name
        //     }).getOne();
    }

    private async $session(): Promise<string> {
        // Get the current timestamp in milliseconds
        const timestamp = new Date().getTime();

        // Generate a random number (between 0 and 999999) to add uniqueness
        const random = Math.floor(Math.random() * 1000000);

        // Combine the timestamp and random number to create the session ID
        const sessionId = `${random}`;

        return sessionId as string;
    }
}
