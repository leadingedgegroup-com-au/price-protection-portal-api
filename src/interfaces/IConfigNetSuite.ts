export interface IConfigNetSuite {
    IConfigNetSuiteKeys: IConfigNetSuiteKeys;
    SetupNetSuiteConfig(): void;
}
export interface IConfigNetSuiteKeys {
    Api: string;
    TokenId: string;
    ClientId: string;
    AccountId: string;
    TokenSecret: string;
    ClientSecret: string;
}

