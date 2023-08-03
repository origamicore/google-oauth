import { AddedResponse, OriInjectable, OriService, PackageIndex, ResponseDataModel, RouteResponse } from "@origamicore/core";
import GoogleOauthConfig from "./models/googleOauthConfig";
import { RedisRouter } from "@origamicore/redis";
import GoogleProfileModel from "./models/googleProfile";

var uuid=require('uuid')
var googleapis  = require('googleapis');
const {google} = require('googleapis');
var OAuth2 = googleapis.Auth.OAuth2Client;  

@OriInjectable({domain:'goauth'})
export default class TsOriGoogleOauth implements PackageIndex
{
    oauth2Client:any;
    name: string='goauth';
    config:GoogleOauthConfig; 
    redis:RedisRouter
    async jsonConfig(config: GoogleOauthConfig): Promise<void> {
        this.config=config; 
        this.oauth2Client = new OAuth2(config.clientId, config.clientSecret, config.redirectUrl);
        this.redis =new RedisRouter(config.redisContext);
    }
    async start(): Promise<void> {
    }
    async restart(): Promise<void> { 
    }
    async stop(): Promise<void> { 
    }
    @OriService({isPublic:true})
    async oauth(code:string,scope:string,authuser:string,prompt:string)
    {
        const {tokens} = await this.oauth2Client.getToken(code) 
        this.oauth2Client.credentials =tokens;
        const oauth2 = google.oauth2({ version: 'v2', auth:this.oauth2Client })
        const userinfo = await oauth2.userinfo.get();
        var profile=new GoogleProfileModel(userinfo.data) 
        var id=uuid.v4();
        this.redis.setValue(id,JSON.stringify(profile));
        this.redis.expire(id,120);
        return new RouteResponse({
            addedResponse:new AddedResponse({
                redirect:this.config.frontRedirectUrl.replace("{{id}}",id) 
            }), }) 
    }
    @OriService({isPublic:true})
    getOauthUrl()
    {
        var url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'profile email'
          });
          return url;
    }
    @OriService({isInternal:true})
    async loginOauth(id:string)
    { 
        var data= await this.redis.getValue(id);
        await this.redis.expire(id,1);
        if(data)
        { 
            let profile=new GoogleProfileModel(JSON.parse(data))
            return profile

        }
        return RouteResponse.failed(null,'Token Not Found','001')    
    }
}