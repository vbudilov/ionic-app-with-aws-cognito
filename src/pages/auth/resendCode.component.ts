import {Component} from "@angular/core";
import {UserRegistrationService} from "../../providers/userRegistration.service";
import {CognitoCallback} from "../../providers/cognito.service";
import {AlertController, NavController} from "ionic-angular";
import {ConfirmRegistrationComponent} from "./confirmRegistration.component";
import {RegisterComponent} from "./register.component";
import {LoginComponent} from "./login.component";
@Component({
    templateUrl: 'resendCode.html',
    providers: [UserRegistrationService]
})
export class ResendCodeComponent implements CognitoCallback {
    email: string;

    constructor(public nav: NavController,
                public registrationService: UserRegistrationService,
                public alertCtrl: AlertController) {
    }

    resendCode() {
        this.registrationService.resendCode(this.email, this);
    }

    cognitoCallback(error: any, result: any) {
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

    doAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}
