import {Injectable} from "@angular/core";
import {CognitoUtil, UserLoginService, Callback} from "./cognito.service";
import {_REGION, _IDENTITY_POOL_ID, _USER_POOL_ID} from './properties.service';

declare var AWS;
declare var AWSCognito:any;

export class Stuff {
  public type:string;
  public date:string;
}

@Injectable()
export class AwsUtil {
  public static firstLogin:boolean = false;
  public static runningInit:boolean = false;

  /**
   * This is the method that needs to be called in order to init the aws global creds
   */
  static initAwsService(callback:Callback) {
    console.log("Running initAwsService()");
    AWSCognito.config.region = _REGION;
    AWS.config.region = _REGION;

    // First check if the user is authenticated already
    UserLoginService.isAuthenticated({
      isLoggedIn(message:string, loggedIn:boolean) {
        // Include the passed-in callback here as well so that it's executed downstream
        AwsUtil.setupAWS(loggedIn, callback);
      }
    });

    if (callback != null) {
      callback.callback();
      callback.callbackWithParam(null);
    }
  }


  /**
   * Sets up the AWS global params
   *
   * @param isLoggedIn
   * @param callback
   */
  static setupAWS(isLoggedIn:boolean, callback:Callback):void {
    console.log("in setupAWS()");
    if (isLoggedIn) {
      console.log("User is logged in");
      CognitoUtil.getIdToken({
        callback() {
        },
        callbackWithParam(idToken:any) {
          AwsUtil.addCognitoCredentials(idToken);
        }
      });
      console.log("Retrieving the id token");
    }
    else {
      console.log("User is not logged in");
      AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: _IDENTITY_POOL_ID
      });
    }
    AwsUtil.runningInit = false;


    if (callback != null) {
      callback.callback();
      callback.callbackWithParam(null);
    }
  }

  static addCognitoCredentials(idTokenJwt:string):void {
    let params = AwsUtil.getCognitoParametersForIdConsolidation(idTokenJwt);

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials(params);

    AWS.config.credentials.get(function (err) {
      if (!err) {
        // var id = AWS.config.credentials.identityId;
        if (AwsUtil.firstLogin) {
          // save the login info to DDB
          AwsUtil.firstLogin = false;
        }
      }
    });
  }

  public static getCognitoParametersForIdConsolidation(idTokenJwt:string):{} {
    console.log("enter getCognitoParametersForIdConsolidation()");
    let url = 'cognito-idp.' + _REGION.toLowerCase() + '.amazonaws.com/' + _USER_POOL_ID;
    let logins:Array<string> = [];
    logins[url] = idTokenJwt;
    let params = {
      IdentityPoolId: _IDENTITY_POOL_ID, /* required */
      Logins: logins
    };

    return params;
  }

}

