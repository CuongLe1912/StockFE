import { ProjectType } from '../domains/enums/project.type';

export class AppConfig {
    public static ApiUrl: string;
    public static SecretKey: string;
    public static SignalrUrl: string;
    public static DefaultPassword: string;
    public static ProjectTypeName: string;
    public static ProjectType: ProjectType;
    public static MeeySeoConfig: AppAuthenConfig;
    public static MeeyLandConfig: AppAuthenConfig;
    public static MeeyShareConfig: AppAuthenConfig;
    public static MeeyGroupConfig: AppAuthenConfig;
    public static MeeyFinanceConfig: AppAuthenConfig;
    public static MeeyBankConfig: AppAuthenConfig;
    public static MeeyMediaConfig: AppAuthenConfig;
    public static MeeyReviewConfig: AppAuthenConfig;
    public static MeeyLandV3Config: AppAuthenConfig;
    public static MeeyProjectConfig: AppAuthenConfig;
    public static AccountTokenKey = 'meey.admin.account';

    public static getDomain() {
        let domain = '';
        if (document.location.ancestorOrigins && document.location.ancestorOrigins.length > 0) {
            domain = document.location.ancestorOrigins[0];
        }
        if (!domain) domain = document.location.href || document.referrer || document.location.origin;
        domain = domain.replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')
            .split('/')[0];
        return domain.toLowerCase();
    }
    public static getProtocol() {
        return window.location.protocol;
    }
    public static setEnvironment() {
        let domain = AppConfig.getDomain();
        switch (domain) {
            case 'adminv3.meeyland.com': {
                AppConfig.ProjectTypeName = 'Prod';
                AppConfig.DefaultPassword = 'A5a$a#a@a!';
                AppConfig.ProjectType = ProjectType.Production;
                AppConfig.ApiUrl = 'https://adminv3-api.meeyland.com/api';
                AppConfig.SignalrUrl = 'https://adminv3-api.meeyland.com/notifyhub';
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                AppConfig.MeeySeoConfig = {
                    UserName: 'meey-land@2022',
                    Password: 'QaQkgJz86AnMhKG7',
                    Api: 'https://mlv41-api.meeyland.com',
                };
                AppConfig.MeeyGroupConfig = {
                    Source: 'meeygroup',
                    Url: 'https://meeygroup.com',
                };
                AppConfig.MeeyFinanceConfig = {
                    Source: 'meeyfinance',
                    Url: 'https://meeyfinance.com',
                };
                AppConfig.MeeyBankConfig = {
                    Source: 'meeybank',
                    Url: 'https://meeybank.com',
                };
                AppConfig.MeeyLandConfig = {
                    Source: 'meeyland',
                    Url: 'https://meeyland.com',
                };
                AppConfig.MeeyLandV3Config = {
                    Source: 'meeyland',
                    Url: 'https://api-v3.meeyland.com',
                };
                AppConfig.MeeyMediaConfig = {
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-media@2022',
                    Api: 'https://api.meeymedia.com',
                };
                AppConfig.MeeyProjectConfig = {
                    Source: 'meeyproject',
                    Password: 'MPkt8NViB3BC',
                    UserName: 'meey-project@2022',
                    Url: 'https://meeyproject.com',
                    Api: 'https://api.meeyproject.com',
                };
                AppConfig.MeeyShareConfig = {
                    Source: 'meeyshare',
                    Api: 'https://meeyshare.com',
                };
                AppConfig.MeeyReviewConfig = {
                    Source: 'meeyreview',
                    Url: 'https://meeyreview.com',
                };
            }
                break;
            case 'adminv3-stag.meey.dev':
            case 'adminv3-stag-local.meey.dev': {
                AppConfig.ProjectTypeName = 'Stag';
                AppConfig.DefaultPassword = 'A1a@a#a$';
                AppConfig.ProjectType = ProjectType.Staging;
                AppConfig.ApiUrl = 'https://adminv3api-stag.meey.dev/api';
                AppConfig.SignalrUrl = 'https://adminv3api-stag.meey.dev/notifyhub';
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                AppConfig.MeeySeoConfig = {
                    UserName: 'meey-land@2022',
                    Password: 'aP9UQ6UvGwktjpUf',
                    Api: 'https://mlv41-api-stg.meey.dev',
                };
                AppConfig.MeeyGroupConfig = {
                    Source: 'meeygroup',
                    Url: 'https://stag.meeygroup.com',
                };
                AppConfig.MeeyFinanceConfig = {
                    Source: 'meeyfinance',
                    Url: 'https://staging.meeyfinance.com',
                };
                AppConfig.MeeyBankConfig = {
                    Source: 'meeybank',
                    Url: 'https://meeybank.com',
                };
                AppConfig.MeeyLandConfig = {
                    Source: 'meeyland',
                    Url: 'https://staging.meeyland.com',
                };
                AppConfig.MeeyLandV3Config = {
                    Source: 'meeyland',
                    Url: 'https://v3-api-stag.meey.dev',
                };
                AppConfig.MeeyMediaConfig = {
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-media@2022',
                    Api: 'https://staging-api.meeymedia.com',
                };
                AppConfig.MeeyProjectConfig = {
                    Source: 'meeyproject',
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-project@2022',
                    Url: 'https://staging.meeyproject.com',
                    Api: 'https://staging-api.meeyproject.com',
                };
                AppConfig.MeeyReviewConfig = {
                    Source: 'meeyreview',
                    Url: 'https://meeyreview.meey.dev',
                };
            }
                break;
            case 'adminv3-test.meey.dev':
            case 'adminv3-test-local.meey.dev': {
                AppConfig.ProjectTypeName = 'Dev';
                AppConfig.ProjectType = ProjectType.Dev;
                AppConfig.DefaultPassword = 'Abcde12345^';
                AppConfig.ApiUrl = 'https://adminv3api-test.meey.dev/api';
                AppConfig.SignalrUrl = 'https://adminv3api-test.meey.dev/notifyhub';
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                AppConfig.MeeySeoConfig = {
                    UserName: 'meey-land@2022',
                    Password: 'JaBq4NFQV9UST3DK',
                    Api: 'https://mlv41-api-test.meey.dev',
                };
                AppConfig.MeeyGroupConfig = {
                    Source: 'meeygroup',
                    Url: 'https://dev.meeygroup.com',
                };
                AppConfig.MeeyFinanceConfig = {
                    Source: 'meeyfinance',
                    Url: 'https://meeyfinance.meey.dev',
                };
                AppConfig.MeeyBankConfig = {
                    Source: 'meeybank',
                    Url: 'https://meeybank.com',
                };
                AppConfig.MeeyLandConfig = {
                    Source: 'meeyland',
                    Url: 'https://meeylandv4-test.meey.dev',
                };
                AppConfig.MeeyLandV3Config = {
                    Source: 'meeyland',
                    Url: 'https://v3-api.meey.dev',
                };
                AppConfig.MeeyMediaConfig = {
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-media@2022',
                    Api: 'https://test-api.meeymedia.com',
                };
                AppConfig.MeeyProjectConfig = {
                    Source: 'meeyproject',
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-project@2022',
                    Url: 'https://test.meeyproject.com',
                    Api: 'https://test-api.meeyproject.com',
                };
                AppConfig.MeeyShareConfig = {
                    Source: 'meeyshare',
                    Url: 'https://meeyshare.meey.dev',
                };
                AppConfig.MeeyReviewConfig = {
                    Source: 'meeyreview',
                    Url: 'https://meeyreview.meey.dev',
                };
            }
                break;
            default: {
                AppConfig.ProjectTypeName = 'Local';
                AppConfig.ProjectType = ProjectType.Dev;
                AppConfig.DefaultPassword = 'Abcde12345^';
                AppConfig.ApiUrl = 'https://localhost:44306/api';
                AppConfig.SignalrUrl = 'https://localhost:44306/notifyhub';
                AppConfig.SecretKey = 'MM3CRqxyYn1Fa501lDqovopBHl+bL8z0le2qjnbbwNlLz77QVLnoOW5yilst';
                AppConfig.MeeySeoConfig = {
                    UserName: 'meey-land@2022',
                    Password: 'JaBq4NFQV9UST3DK',
                    Api: 'https://mlv41-api-test.meey.dev',
                };
                AppConfig.MeeyGroupConfig = {
                    Source: 'meeygroup',
                    Url: 'https://dev.meeygroup.com',
                };
                AppConfig.MeeyFinanceConfig = {
                    Source: 'meeyfinance',
                    Url: 'https://meeyfinance.meey.dev',
                };
                AppConfig.MeeyBankConfig = {
                    Source: 'meeybank',
                    Url: 'https://meeybank.com',
                };
                AppConfig.MeeyLandConfig = {
                    Source: 'meeyland',
                    Url: 'https://meeylandv4-test.meey.dev',
                };
                AppConfig.MeeyLandV3Config = {
                    Source: 'meeyland',
                    Url: 'https://v3-api.meey.dev',
                };
                AppConfig.MeeyMediaConfig = {
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-media@2022',
                    Api: 'https://test-api.meeymedia.com',
                };
                AppConfig.MeeyProjectConfig = {
                    Source: 'meeyproject',
                    Password: 'MPpu7LTiB2KV',
                    UserName: 'meey-project@2022',
                    Url: 'https://test.meeyproject.com',
                    Api: 'https://test-api.meeyproject.com',
                };
                AppConfig.MeeyShareConfig = {
                    Source: 'meeyshare',
                    Url: 'https://meeyshare.meey.dev',
                };
                AppConfig.MeeyReviewConfig = {
                    Source: 'meeyreview',
                    Url: 'https://meeyreview.meey.dev',
                };
            }
                break;
        }
    }
}

export class AppAuthenConfig {
    Api?: string;
    Url?: string;
    Source?: string;
    UserName?: string;
    Password?: string;
}
