import { OriModel } from "@origamicore/core"; 
@OriModel()
export default class GoogleProfileModel  
{ 
    id:string;
    email:string;
    verified_email:boolean;
    name:string;
    given_name:string; 
    family_name:string; 
    nick_name:string; 
    picture:string; 
    locale:string;  
    hash:string;
    changed:boolean;
    constructor(
        fields?: { 
            id?:string;
            email?:string;
            verified_email?:boolean;
            name?:string;
            given_name?:string; 
            family_name?:string; 
            nick_name?:string; 
            picture?:string; 
            locale?:string; 
            changed:boolean;
        })
    { 
        if (fields) 
        {
            Object.assign(this, fields);  
        }
    }
}