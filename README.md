# Google-Oauth
Origamicore google oauth

## Installation
OrigamiRedis requires [OrigamiCore](https://www.npmjs.com/package/@origamicore/core)  to run.
```sh
occli -n project-name
cd project-name
npm install @origamicore/redis
npm install @origamicore/google-auth
```
## Samples

Config File
```
// 
packageConfig:[
    new RedisConfig({
        connections:new Map<string, RedisConnection>([
            [
                'redisContext',new RedisConnection({db:1}),
            ] 
        ])
    }),
    new GoogleOauthConfig({
        redisContext:'redisContext',
        clientId:EnvModel.googleClientId,
        clientSecret:EnvModel.googleClientSecret,
        frontRedirectUrl:EnvModel.frontRedirect,
        redirectUrl:EnvModel.GoogleRedirect
    }),
]
```
[Sample Project](https://github.com/origamiicore/task-manager-server.gi)
