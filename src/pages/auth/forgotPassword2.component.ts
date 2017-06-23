import {Component} from "@angular/core";
import {CognitoCallback} from "../../providers/cognito.service";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {UserLoginService} from "../../providers/userLogin.service";
import {LoginComponent} from "./login.component";
import {RegisterComponent} from "./register.component";
@Component({
    templateUrl: 'forgotPasswordStep2.html'
})
export class ForgotPasswordStep2Component implements CognitoCallback {

    verificationCode: string;
    email: string;
    password: string;

    constructor(public nav: NavController, public navParam: NavParams, public alertCtrl: AlertController, public userService: UserLoginService) {
        this.email = navParam.get("email");
    }

    onNext() {
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
    }

    cognitoCallback(message: string) {
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

    doAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }
}