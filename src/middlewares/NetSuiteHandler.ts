import axios from 'axios';
import { Injectable } from '@nestjs/common';
import appConfiguration from 'src/app.configuration';
import { SignatureMethods } from 'src/enums';
import { IConfigNetSuite, IConfigNetSuiteKeys } from 'src/interfaces';

@Injectable()
export class NetSuiteHandler implements IConfigNetSuite {

    public IConfigNetSuiteKeys: IConfigNetSuiteKeys;

    constructor() { this.SetupNetSuiteConfig(); }

    public SetupNetSuiteConfig(): void {
        const {
            API,
            ACCOUNT_ID,
            TOKEN_ID,
            TOKEN_SECRET,
            CLIENT_ID,
            CLIENT_SECRET
        } = appConfiguration().NETSUITE;
        this.IConfigNetSuiteKeys = {
            Api: API,
            AccountId: ACCOUNT_ID,
            TokenId: TOKEN_ID,
            TokenSecret: TOKEN_SECRET,
            ClientId: CLIENT_ID,
            ClientSecret: CLIENT_SECRET
        };
    }

    public async GenerateOAuth1Header(request: { url: string, method: string }) {

        var $API = this.IConfigNetSuiteKeys.Api;

        var $token = {
            public: this.IConfigNetSuiteKeys.TokenId,
            secret: this.IConfigNetSuiteKeys.TokenSecret,
        };

        var $consumer = {
            public: this.IConfigNetSuiteKeys.ClientId,
            secret: this.IConfigNetSuiteKeys.ClientSecret,
        };

        var $account = this.IConfigNetSuiteKeys.AccountId;

        //version 1.0.1, don't do version 1.1.0
        const OAuth = require('oauth-1.0a');

        //SET UP THE OAUTH OBJECT
        //you can also use HMAC-SHA1 but HMAC-SHA256 is more secure (supposedly)
        var oauth = OAuth({
            consumer: $consumer,
            signature_method: SignatureMethods.HMAC_SHA256
        });

        //GET THE AUTHORIZATION AND STICK IT IN THE HEADER, ALONG WITH THE REALM AND CONTENT-TYPE
        var authorization = oauth.authorize(request, $token);
        var header = oauth.toHeader(authorization);
        header.Authorization += ', realm="' + $account + '"';
        header['content-type'] = 'application/json';

        return header;
    }

    public async FindAllCustomerIds(EntityId: string = null) {

        let req = {
            method: "GET",
            url: `${this.IConfigNetSuiteKeys.Api}/customer${(EntityId !== null) ? `?q=entityId START_WITH "${EntityId}"` : ''}`,
        };

        req['headers'] = await this.GenerateOAuth1Header({ url: req.url, method: "GET" })

        console.log(req)

        return await axios(req).then(async (res: any) => {
            return res?.data;
        }).catch(error => {
            console.error(`Exception NetSuiteHandler/FindAllCustomerIds() ==>\n${error}`);
            return false;
        })
    }

    public async FindParticularCustomerById(Id: number) {

        let req = {
            method: "GET",
            url: `${this.IConfigNetSuiteKeys.Api}/customer/${Id}`
        };

        req['headers'] = await this.GenerateOAuth1Header({ url: req.url, method: "GET" });

        console.log(req);

        return await axios(req).then(async (res: any) => {
            return res?.data
        }).catch(error => {
            console.error(`Exception NetSuiteHandler/FindParticularCustomerById() ==>\n${error}`);
            return false;
        })
    }


    public async FindAllContacts(Email: string = null) {

        let req = {
            method: "GET",
            url: `${this.IConfigNetSuiteKeys.Api}/contact${(Email !== null) ? `?q=email START_WITH "${Email}"` : ''}`,
        };

        req['headers'] = await this.GenerateOAuth1Header({ url: req.url, method: "GET" })

        console.log(req)

        return await axios(req).then(async (res: any) => {
            return res?.data;
        }).catch(error => {
            console.error(`Exception NetSuiteHandler/FindAllContacts() ==>\n${error}`);
            return false;
        })
    }

    public async FindParticularContactById(Id: string = null) {

        let req = {
            method: "GET",
            url: `${this.IConfigNetSuiteKeys.Api}/contact/${Id}`,
        };

        req['headers'] = await this.GenerateOAuth1Header({ url: req.url, method: "GET" })

        console.log(req)

        return await axios(req).then(async (res: any) => {
            return res?.data;
        }).catch(error => {
            console.error(`Exception NetSuiteHandler/FindParticularContactById() ==>\n${error}`);
            return false;
        })
    }
}