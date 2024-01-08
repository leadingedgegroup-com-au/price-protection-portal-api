import { Module, OnModuleInit } from '@nestjs/common';

@Module({
    providers: [],
    exports: [],
})
export class DbModule implements OnModuleInit {

    async onModuleInit() { }
}
