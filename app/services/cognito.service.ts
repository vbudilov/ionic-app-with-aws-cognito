import {Injectable} from "@angular/core";
import {_POOL_DATA} from './properties.service';

declare let AWS:any;
declare let AWSCognito:any;

export class RegistrationUser {
  name:string;
  email:string;
  password:string;
}

export interface CognitoCallback {
  cognitoCallback(message:string, result:any):void;
}

export interface LoggedInCallback {
  isLoggedIn(message:string, loggedIn:boolean):void;
}

export interface Callback {
  callback():void;
  callbackWithParam(result:any):void;
}

@Injectable()
export class CognitoUtil {

  public static getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_POOL_DATA);

  }

  public static getCurrentUser() {
    return CognitoUtil.getUserPool().getCurrentUser();
  }


  public static getCognitoIdentity():string {
    return AWS.config.credentials.identityId;
  }

  public static getAccessToken(callback:Callback):void {
    if (callback == null) {
      throw("callback in getAccessToken is null...returning");
    }
    CognitoUtil.getCurrentUser().getSession(function (err, session) {
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

  public static getIdToken(callback:Callback):void {
    if (callback == null) {
      throw("callback in getIdToken is null...returning");
    }
    CognitoUtil.getCurrentUser().getSession(function (err, session) {
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

  public static getRefreshToken(callback:Callback):void {
    if (callback == null) {
      throw("callback in getRefreshToken is null...returning");
    }
    CognitoUtil.getCurrentUser().getSession(function (err, session) {
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

@Injectable()
export class UserRegistrationService {
  constructor() {
  }
  
  register(user:RegistrationUser, callback:CognitoCallback):void {
    console.log("user: " + user);

    let attributeList = [];

    let dataEmail = {
      Name: 'email',
      Value: user.email
    };
    let dataNickname = {
      Name: 'nickname',
      Value: user.name
    };
    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail));
    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataNickname));

    CognitoUtil.getUserPool().signUp(user.email, user.password, attributeList, null, function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        console.log("registered user: " + result);
        callback.cognitoCallback(null, result);
      }
    });

  }

  confirmRegistration(username:string, confirmationCode:string, callback:CognitoCallback):void {

    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }

  resendCode(username:string, callback:CognitoCallback):void {
    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
    };

    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }

}

@Injectable()
export class UserLoginService {

  constructor() {
  }

  static authenticate(username:string, password:string, callback:CognitoCallback) {

    // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})

    let authenticationData = {
      Username: username,
      Password: password,
    };
    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
    };

    console.log("Authenticating the user");
    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    console.log(AWS.config);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
        callback.cognitoCallback(err.message, null);
      },
    });
  }

  static forgotPassword(username:string, callback:CognitoCallback) {
    let userData = {
      Username: username,
      Pool: CognitoUtil.getUserPool()
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

  static confirmNewPassword(email:string, verificationCode:string, password:string, callback:CognitoCallback) {
    let userData = {
      Username: email,
      Pool: CognitoUtil.getUserPool()
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

  static logout() {
    console.log("Logging out");
    CognitoUtil.getCurrentUser().signOut();
    // AwsUtil.initAwsService(null);
  }

  static isAuthenticated(callback:LoggedInCallback) {
    if (callback == null)
      throw("Callback in isAuthenticated() cannot be null");

    let cognitoUser = CognitoUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          console.log("Couldn't get the session: " + err, err.stack);
          callback.isLoggedIn(err, false);
        }
        else {
          console.log("Session is " + session.isValid());
          callback.isLoggedIn(err, session.isValid());
        }
      });
    } else {
      callback.isLoggedIn("Can't retrieve the CurrentUser", false);
    }
  }

}

@Injectable()
export class UserParametersService {

  static getParameters(callback:Callback) {
    let cognitoUser = CognitoUtil.getCurrentUser();

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

  getParameter(name:string, callback:Callback) {

  }

}
