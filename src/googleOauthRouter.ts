import { MessageModel, Router } from "@origamicore/core"
import GoogleProfileModel from "./models/googleProfile"

export default class GoogleOauthRouter
{
    
    static async verifyById( id:string):Promise<GoogleProfileModel>
    { 
        let resp= await Router.runInternal('goauth','loginOauth',new MessageModel({data:{id}}))
        if(resp?.response?.data)
        {
            return resp?.response?.data
        }
        throw resp.error 
    }
}