import {Component} from "@angular/core";
import {UserRegistrationService} from "../../providers/userRegistration.service";
import {CognitoCallback, RegistrationUser} from "../../providers/cognito.service";
import {AlertController, NavController} from "ionic-angular";
import {ConfirmRegistrationComponent} from "./confirmRegistration.component";
import {ResendCodeComponent} from "./resendCode.component";
import {LoginComponent} from "./login.component";

/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({

    templateUrl: 'register.html',
    providers: [UserRegistrationService]
})
export class RegisterComponent implements CognitoCallback {
    registrationUser: RegistrationUser;

    constructor(public nav: NavController,
                public userRegistration: UserRegistrationService,
                public alertCtrl: AlertController) {
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
    cognitoCallback(message: string, result: any) {
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

    doAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}