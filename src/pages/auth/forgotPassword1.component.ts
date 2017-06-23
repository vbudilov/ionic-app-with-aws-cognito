import {Component} from "@angular/core";
import {CognitoCallback} from "../../providers/cognito.service";
import {AlertController, NavController} from "ionic-angular";
import {ForgotPasswordStep2Component} from "./forgotPassword2.component";
import {UserLoginService} from "../../providers/userLogin.service";
import {RegisterComponent} from "./register.component";
import {LoginComponent} from "./login.component";

@Component({
    templateUrl: 'forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {
    email: string;

    constructor(public nav: NavController, public alertCtrl: AlertController, public userService: UserLoginService) {
    }

    onNext() {
        this.userService.forgotPassword(this.email, this);
    }

    cognitoCallback(message: string, result: any) {
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

    doAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }
}