import {Injectable} from "@angular/core";
import {_POOL_DATA} from "./properties.service";

declare let AWS: any;
declare let AWSCognito: any;

export class RegistrationUser {
    name: string;
    email: string;
    password: string;
}

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
    isLoggedInCallback(message: string, loggedIn: boolean): void;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

    constructor() {
        console.log("CognitoUtil constructor");
    }

    getUserPool() {
        return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_POOL_DATA);
    }

    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }


    getCognitoIdentity(): string {
        return AWS.config.credentials.identityId;
    }

    getAccessToken(callback: Callback): void {
        if (callback == null) {
            throw("callback in getAccessToken is null...returning");
        }
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log("Can't set the credentials:" + err);
                callback.callbackWithParam(null);
            }

            else {
                if (session.isValid()) {
                    callback.callbackWithParam(session.getAccessToken().getJwtToken());
                }
            }
        });
    }

    getIdToken(callback: Callback): void {
        if (callback == null) {
            throw("callback in getIdToken is null...returning");
        }
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log("Can't set the credentials:" + err);
                callback.callbackWithParam(null);
            }
            else {
                if (session.isValid()) {
                    callback.callbackWithParam(session.getIdToken().getJwtToken());
                } else {
                    console.log("Got the id token, but the session isn't valid");
                }
            }
        });
    }

    getRefreshToken(callback: Callback): void {
        if (callback == null) {
            throw("callback in getRefreshToken is null...returning");
        }
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log("Can't set the credentials:" + err);
                callback.callbackWithParam(null);
            }

            else {
                if (session.isValid()) {
                    callback.callbackWithParam(session.getRefreshToken());
                }
            }
        });
    }
}






