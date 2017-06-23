import {Injectable} from "@angular/core";
import {Callback, CognitoUtil} from "./cognito.service";
@Injectable()
export class UserParametersService {

    constructor(public cUtil: CognitoUtil) {

    }

    getParameters(callback: Callback) {
        let cognitoUser = this.cUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err)
                    console.log("Couldn't retrieve the user");
                else {
                    cognitoUser.getUserAttributes(function (err, result) {
                        if (err) {
                            console.log("in getParameters: " + err);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }


    }

    getParameter(name: string, callback: Callback) {

    }

}