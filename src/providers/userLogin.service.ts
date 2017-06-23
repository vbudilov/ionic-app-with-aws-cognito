import {Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil, LoggedInCallback} from "./cognito.service";
import {EventsService} from "./events.service";
declare let AWS: any;
declare let AWSCognito: any;

@Injectable()
export class UserLoginService {

    constructor(public cUtil: CognitoUtil, public eventService: EventsService) {
        console.log("eventservice1: " + eventService);
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        let mythis = this;

        // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
        AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})

        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: this.cUtil.getUserPool()
        };

        console.log("Authenticating the user");
        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
                mythis.eventService.sendLoggedInEvent();
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        let userData = {
            Username: username,
            Pool: this.cUtil.getUserPool()
        };

        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function (result) {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cUtil.getUserPool()
        };

        let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    logout() {
        console.log("Logging out");
        this.cUtil.getCurrentUser().signOut();
        this.eventService.sendLogoutEvent();
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw("Callback in isAuthenticated() cannot be null");

        console.log("Getting the current user");
        let cognitoUser = this.cUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log("Couldn't get the session: " + err, err.stack);
                    callback.isLoggedInCallback(err, false);
                }
                else {
                    console.log("Session is valid: " + session.isValid());
                    callback.isLoggedInCallback(err, session.isValid());
                }
            });
        } else {
            callback.isLoggedInCallback("Can't retrieve the CurrentUser", false);
        }
    }
}