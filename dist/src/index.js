"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@origamicore/core");
const googleProfile_1 = __importDefault(require("./models/googleProfile"));
var uuid = require('uuid');
var googleapis = require('googleapis');
const { google } = require('googleapis');
var OAuth2 = googleapis.Auth.OAuth2Client;
let TsOriGoogleOauth = class TsOriGoogleOauth {
    constructor() {
        this.name = 'goauth';
    }
    jsonConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = config;
            this.oauth2Client = new OAuth2(config.clientId, config.clientSecret, config.redirectUrl);
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    oauth(code, scope, authuser, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokens } = yield this.oauth2Client.getToken(code);
            this.oauth2Client.credentials = tokens;
            const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const userinfo = yield oauth2.userinfo.get();
            var profile = new googleProfile_1.default(userinfo.data);
            var id = uuid.v4();
            this.redis.setValue(id, JSON.stringify(profile));
            this.redis.expire(id, 120);
            return new core_1.RouteResponse({
                addedResponse: new core_1.AddedResponse({
                    redirect: this.config.frontRedirectUrl.replace("{{id}}", id)
                }),
            });
        });
    }
    getOauthUrl() {
        var url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'profile email'
        });
        return url;
    }
    loginOauth(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield this.redis.getValue(id);
            yield this.redis.expire(id, 1);
            if (data) {
                let profile = new googleProfile_1.default(JSON.parse(data));
                return profile;
            }
            return core_1.RouteResponse.failed(null, 'Token Not Found', '001');
        });
    }
};
__decorate([
    (0, core_1.OriService)({ isPublic: true })
], TsOriGoogleOauth.prototype, "oauth", null);
__decorate([
    (0, core_1.OriService)({ isPublic: true })
], TsOriGoogleOauth.prototype, "getOauthUrl", null);
__decorate([
    (0, core_1.OriService)({ isInternal: true })
], TsOriGoogleOauth.prototype, "loginOauth", null);
TsOriGoogleOauth = __decorate([
    (0, core_1.OriInjectable)({ domain: 'goauth' })
], TsOriGoogleOauth);
exports.default = TsOriGoogleOauth;
//# sourceMappingURL=index.js.map