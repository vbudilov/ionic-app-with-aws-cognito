import {Component, OnInit} from "@angular/core";
import {NavController, NavParams, AlertController} from "ionic-angular";
import {
  UserRegistrationService,
  CognitoCallback,
  UserLoginService,
  LoggedInCallback,
  RegistrationUser
} from "../../services/cognito.service";
import {ControlPanelComponent} from "../controlpanel/controlpanel";
import {HomePage} from "../home/home";

@Component({
  templateUrl: 'build/pages/auth/login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
  email:string;
  password:string;

  constructor(private nav:NavController,  private navParam:NavParams, private alertCtrl:AlertController) {
    console.log("LoginComponent constructor");
    if (navParam != null && navParam.get("email") != null)
      this.email = navParam.get("email");
  }

  ngOnInit() {
    console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
    UserLoginService.isAuthenticated(this);
  }

  onLogin() {
    console.log("in onLogin");
    if (this.email == null || this.password == null) {
      this.doAlert("Error", "All fields are required");
      return;
    }
    UserLoginService.authenticate(this.email, this.password, this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { //error
      this.doAlert("Error", message);
      console.log("result: " + message);
    } else { //success
      this.nav.setRoot(ControlPanelComponent);
    }
  }

  isLoggedIn(message:string, isLoggedIn:boolean) {
    console.log("The user is logged in: " + isLoggedIn);
    if (isLoggedIn)
      this.nav.setRoot(ControlPanelComponent);
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

  constructor(private navCtrl:NavController) {
    UserLoginService.isAuthenticated(this)
  }

  isLoggedIn(message:string, isLoggedIn:boolean) {
    if (isLoggedIn) {
      UserLoginService.logout();
    }
    this.navCtrl.setRoot(HomePage)
  }
}

/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({

  templateUrl: 'build/pages/auth/registration.html',
  providers: [UserRegistrationService]
})
export class RegisterComponent implements CognitoCallback, OnInit {
  registrationUser:RegistrationUser;

  constructor(private nav:NavController,
              public userRegistration:UserRegistrationService,
              private alertCtrl:AlertController) {
  }

  ngOnInit() {
    this.registrationUser = new RegistrationUser();
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
  templateUrl: 'build/pages/auth/confirmRegistration.html',
  providers: [UserRegistrationService]
})
export class ConfirmRegistrationComponent {
  confirmationCode:string;

  constructor(private nav:NavController, public userRegistration:UserRegistrationService, private navParam:NavParams, private alertCtrl:AlertController) {
    console.log("Entered ConfirmRegistrationComponent");
    console.log("nav param email: " + this.navParam.get("email"))
  }

  ionViewDidEnter() {
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
  templateUrl: 'build/pages/auth/resendCode.html',
  providers: [UserRegistrationService]
})
export class ResendCodeComponent implements CognitoCallback {
  email:string;

  constructor(private nav:NavController,
              public registrationService:UserRegistrationService,
              private alertCtrl:AlertController) {
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
  templateUrl: 'build/pages/auth/forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {
  email:string;

  constructor(private nav:NavController, private alertCtrl:AlertController) {
  }

  onNext() {
    UserLoginService.forgotPassword(this.email, this);
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
  templateUrl: 'build/pages/auth/forgotPasswordStep2.html'
})
export class ForgotPasswordStep2Component implements CognitoCallback, OnInit {

  verificationCode:string;
  email:string;
  password:string;

  constructor(private nav:NavController, private navParam:NavParams, private alertCtrl:AlertController) {
    this.email = navParam.get("email");
  }

  ngOnInit() {

  }

  onNext() {
    UserLoginService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
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
