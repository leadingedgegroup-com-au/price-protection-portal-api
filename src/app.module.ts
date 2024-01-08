import { Module, OnApplicationBootstrap } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { NetSuiteHandler } from './middlewares';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './api/group/group.module';
import { SupplierModule } from './api/supplier/supplier.module';
import appConfiguration from './app.configuration';
import { APP_GUARD } from '@nestjs/core';
import { SignInModule } from './api/sign-in/sign-in.module';
import { AuthGuard } from './guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DefaultNamingStrategy } from 'typeorm';
import { BrandModule } from './api/brand/brand.module';
import { UsersModule } from './api/users/users.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { PasswordModule } from './api/password/password.module';
import { CustomerModule } from './api/customer/customer.module';
import { NetsuiteModule } from './api/netsuite/netsuite.module';
import { ContactsModule } from './api/contacts/contacts.module';
import { ProgramsModule } from './api/programs/programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration]
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mssql',
      host: '52.63.137.110',
      port: 1433,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      options: {
        trustServerCertificate: true,
        enableArithAbort: false,
      },
      //logging: true,
      dropSchema: false,
      migrationsRun: false,
      autoLoadEntities: true,
      //synchronize: true,
      // ssl: true,
      // extra: {  ssl: { rejectUnauthorized: false },},
      namingStrategy: new DefaultNamingStrategy(),
      entities: [join(__dirname, 'entities/*.entity{.ts,.js}')],
      migrations: [join(__dirname, './migrations/public/*{.ts,.js}')],
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      url: appConfiguration().REDIS.URL,
    }),
    BullModule.forRoot({
      redis: appConfiguration().REDIS.URL.includes('localhost') ? {
        host: 'localhost',
        port: 6379
      } : {
        host: appConfiguration().REDIS.HOST,
        port: Number(appConfiguration().REDIS.PORT),
        password: appConfiguration().REDIS.PASSWORD
      }
    }),
    GroupModule,
    SupplierModule,
    SignInModule,
    BrandModule,
    UsersModule,
    QueueModule,
    PasswordModule,
    CustomerModule,
    NetsuiteModule,
    ContactsModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    NetSuiteHandler
  ],
})

export class AppModule implements OnApplicationBootstrap {

  constructor() { }

  async onApplicationBootstrap() {
    console.log(`\n|======================== [ Price Protection Portal - Microservice ] ========================|\n`)
  }
}
