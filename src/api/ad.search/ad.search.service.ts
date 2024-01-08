import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IAdSearch } from './ad.search.interface';
import appConstants from 'src/app.constants';
import appConfiguration from 'src/app.configuration';

enum EmailTypes {
    BE = 'business-email',
    SSO = 'sso-sign-up'
}
@Injectable()
export class ADSearch implements IAdSearch {

    private readonly logger: Logger = new Logger(ADSearch.name);

    private RedisStoreUsersCollection: Array<any> = []

    constructor(@Inject(CACHE_MANAGER) private cache: Cache,) {
        this.SyncUserCollectionFromCache();
    }

    public async SyncUserCollectionFromCache(): Promise<void> {
        let data: any = await this.cache.get(`${appConstants.REDIS.USER}::${appConfiguration().ENVIRONMENT}`);
        this.RedisStoreUsersCollection = JSON.parse(data) || [];
    }

    public async retrieveByUserId(user_id: string) {
        return await this.SyncUserCollectionFromCache().then(() => {
            return this.RedisStoreUsersCollection.find((obj: any) => obj.id == user_id) as any || null;
        })
    }

    public async retrieveByCode(code: string) {
        return await this.SyncUserCollectionFromCache().then(() => {
            return this.RedisStoreUsersCollection.find((obj: any) => obj.code == code) as any || null;
        })
    }
}