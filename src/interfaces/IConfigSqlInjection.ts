export interface IConfigSqlInjection {
    SqlSignerOptions: IConfigSqlSignerOptions;
    SetUpConnectionPool(): void;
    GetConnectionPool(): void;
}
export interface IConfigSqlSignerOptions {
    server: string;
    user: string;
    database: string;
    password: string;
    options: { encrypt: boolean; }
}

