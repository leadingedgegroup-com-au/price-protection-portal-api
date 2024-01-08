import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { jwtDecode } from "jwt-decode";
import * as _ from 'lodash';
import appConstants from 'src/app.constants';

/**
 * EndUsersAuth Guard
 *
 * @author Ranjendra Kumar Majhi
 * @since 26th Oct 2022
 */
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        // @Inject(CACHE_MANAGER) private Cache: Cache
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        //By pass if api demarked as @Public annotations.
        const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();

        if (!request.headers['authorization']) throw new ForbiddenException(`Bearer token missing`);

        let token = request.headers['authorization'];
        token = (token && token.startsWith("Bearer")) ? token.substr(7).trim() : token;

        try {
            //Extracting access token payload with the help of jwtDecode package.
            let { payload }: any = jwtDecode(token);
            //const { identity, session } = payload;

            //if (!(Object.keys(payload).length > 0)) throw new ForbiddenException(`UnAuthorized`);

            //let redis = await this.Cache.get(`${appConstants.REDIS.SSO}::${identity}::${session}`);

            //if (!redis) throw new ForbiddenException(`UnAuthorized`);
            //if (!(redis['at'] === token)) throw new ForbiddenException(`UnAuthorized`);

            request['user'] = payload || {};

        } catch (err) { throw new ForbiddenException(`UnAuthorized`); }

        return true;
    }
}


