/**
 * For holding constants.
 *
 * @author Rajendra Kumar Majhi
 * @date 03-09-2022
 *
 */
export default class Constants {

    static REDIS = {
        SSO: 'acl:sso:console',
        ROLE: 'acl:role:console',
        USER: 'acl:user:console',
        FP_OTP: 'acl:fp:otp:console',
    };

    static DB_SSP_IDENTITY: string = 'Identity';
    static DB_SSP_USERS: string = 'tbl_Users';
    static DB_SSP_BRANDS: string = 'tbl_Brands';
    static DB_SSP_GROUPS: string = 'tbl_Groups';
    static DB_SSP_SUPPLIERS: string = 'tbl_Suppliers';
    static DB_SSP_CUSTOMERS: string = 'tbl_Customers';
    static DB_SSP_SESSIONS: string = 'tbl_Sessions';
    static DB_SSP_NOTIFICATIONS: string = 'tbl_Notifications';
    static DB_SSP_PROGRAMS: string = 'tbl_Programs';
    static DB_SSP_PROGRAM_ADMINS: string = 'tbl_ProgramAdmins';
    static DB_SSP_PROGRAM_GROUPS: string = 'tbl_ProgramGroups';
    static DB_SSP_PROGRAM_ATTRIBUTES: string = 'tbl_ProgramAttributes';

    static QUEUE = {
        CONSUMERS: {
            STORAGE: 'storage',
            NOTIFICATION: 'notification',

        },
        PUBLISHERS: {
            UPLOAD: 'upload',
            NOTIFY: 'notify'
        }
    }
}
