import {Component} from "@angular/core";
import {NavController, NavParams, AlertController} from "ionic-angular";
import {
  UserRegistrationService,
  CognitoCallback,
  UserLoginService,
  LoggedInCallback,
  RegistrationUser
} from "../../providers/cognito.service";
import {ControlPanelComponent} from "../controlpanel/controlpanel";
import {EventsService} from "../../providers/events.service";

@Component({
  templateUrl: 'login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback {
  email:string;
  password:string;

  constructor(public nav:NavController,
              public navParam:NavParams,
              public alertCtrl:AlertController,
              public userService:UserLoginService,
              public eventService:EventsService) {
    console.log("LoginComponent constructor");
    if (navParam != null && navParam.get("email") != null)
      this.email = navParam.get("email");

  }

  ionViewLoaded() {
    console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
    this.userService.isAuthenticated(this);
  }

  signMeIn() {
    console.log("in onLogin");
    if (this.email == null || this.password == null) {
      this.doAlert("Error", "All fields are required");
      return;
    }
    this.userService.authenticate(this.email, this.password, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { //error
      this.doAlert("Error", message);
      console.log("result: " + message);
    } else { //success
      console.log("Redirect to ControlPanelComponent");
      this.nav.setRoot(ControlPanelComponent);
    }
  }

  isLoggedInCallback(message:string, isLoggedIn:boolean) {
    console.log("The user is logged in: " + isLoggedIn);
    if (isLoggedIn) {
      this.eventService.sendLoggedInEvent();
      this.nav.setRoot(ControlPanelComponent);
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToForgotPassword() {
    this.nav.push(ForgotPasswordStep1Component);
  }

  doAlert(title:string, message:string) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}

@Component({
  template: ''
})
export class LogoutComponent implements LoggedInCallback {

  constructor(public navCtrl:NavController, public userService:UserLoginService) {
    this.userService.isAuthenticated(this)
  }

  isLoggedInCallback(message:string, isLoggedIn:boolean) {
    if (isLoggedIn) {
      this.userService.logout();
    }
    this.navCtrl.setRoot(LoginComponent)
  }
}

/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({

  templateUrl: 'registration.html',
  providers: [UserRegistrationService]
})
export class RegisterComponent implements CognitoCallback {
  registrationUser:RegistrationUser;

  constructor(public nav:NavController,
              public userRegistration:UserRegistrationService,
              public alertCtrl:AlertController) {
    this.registrationUser = new RegistrationUser();
  }

  ionViewLoaded() {

  }

  onRegister() {
    this.userRegistration.register(this.registrationUser, this);
  }

  /**
   * CAllback on the user clicking 'register'
   *
   * The user is taken to a confirmation page where he can enter the confirmation code to finish
   * registration
   *
   */
  cognitoCallback(message:string, result:any) {
    if (message != null) { //error
      this.doAlert("Registration", message);
    } else { //success
      console.log("in callback...result: " + result);
      this.nav.push(ConfirmRegistrationComponent, {
        'username': result.user.username,
        'email': this.registrationUser.email
      });
    }
  }

  navToResendCode() {
    this.nav.push(ResendCodeComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}

@Component({
  templateUrl: 'confirmRegistration.html',
  providers: [UserRegistrationService]
})
export class ConfirmRegistrationComponent {
  confirmationCode:string;

  constructor(public nav:NavController, public userRegistration:UserRegistrationService, public navParam:NavParams, public alertCtrl:AlertController) {
    console.log("Entered ConfirmRegistrationComponent");
    console.log("nav param email: " + this.navParam.get("email"))
  }

  ionViewLoaded() {
    console.log("Entered ionViewDidEnter");
    console.log("email: " + this.navParam.get("email"));
  }

  onConfirmRegistration() {
    console.log("Confirming registration");
    this.userRegistration.confirmRegistration(this.navParam.get("email"), this.confirmationCode, this);
  }

  /**
   * callback
   * @param message
   * @param result
   */
  cognitoCallback(message:string, result:any) {
    if (message != null) { //error
      this.doAlert("Confirmation", message);
    } else { //success
      console.log("Entered ConfirmRegistrationComponent");
      let email = this.navParam.get("email");

      if (email != null)
        this.nav.push(LoginComponent, {
          'email': email
        });
      else
        this.nav.push(LoginComponent);
    }
  }

  navToResendCode() {
    this.nav.push(ResendCodeComponent);
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}

@Component({
  templateUrl: 'resendCode.html',
  providers: [UserRegistrationService]
})
export class ResendCodeComponent implements CognitoCallback {
  email:string;

  constructor(public nav:NavController,
              public registrationService:UserRegistrationService,
              public alertCtrl:AlertController) {
  }

  resendCode() {
    this.registrationService.resendCode(this.email, this);
  }

  cognitoCallback(error:any, result:any) {
    if (error != null) {
      this.doAlert("Resend", "Something went wrong...please try again");
    } else {
      this.nav.push(ConfirmRegistrationComponent, {
        'email': this.email
      });
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}

@Component({
  templateUrl: 'forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {
  email:string;

  constructor(public nav:NavController, public alertCtrl:AlertController, public userService:UserLoginService) {
  }

  onNext() {
    this.userService.forgotPassword(this.email, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message == null && result == null) { //error
      this.nav.push(ForgotPasswordStep2Component, {'email': this.email})
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}

@Component({
  templateUrl: 'forgotPasswordStep2.html'
})
export class ForgotPasswordStep2Component implements CognitoCallback {

  verificationCode:string;
  email:string;
  password:string;

  constructor(public nav:NavController, public navParam:NavParams, public alertCtrl:AlertController, public userService:UserLoginService) {
    this.email = navParam.get("email");
  }

  onNext() {
    this.userService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
  }

  cognitoCallback(message:string) {
    if (message != null) { //error
      this.doAlert("Verification Code", message);
    } else { //success
      this.nav.push(LoginComponent);
    }
  }

  navToRegister() {
    this.nav.push(RegisterComponent);
  }

  navToLogin() {
    this.nav.push(LoginComponent);
  }

  doAlert(title:string, message:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
