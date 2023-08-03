 
import { ModuleConfig, PackageIndex } from '@origamicore/core';
import TsOriGoogleOauth from '..'; 
export default class GoogleOauthConfig extends ModuleConfig
{
    async createInstance(): Promise<PackageIndex> {
        var instance =new TsOriGoogleOauth();
        await instance.jsonConfig(this);
        return instance;
    }
    clientId:string;
    clientSecret:string;
    redirectUrl:string;
    frontRedirectUrl:string;
    redisContext:string;
    public constructor(
        
        fields?: {
            id?: string 
            clientId:string;
            clientSecret:string;
            redirectUrl:string;
            frontRedirectUrl:string;
            redisContext:string;
        }) {
        super(fields);
        if (fields) Object.assign(this, fields); 
    }
}