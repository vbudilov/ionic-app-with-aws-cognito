import {Component} from "@angular/core";
import {UserRegistrationService} from "../../providers/userRegistration.service";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {LoginComponent} from "./login.component";
import {ResendCodeComponent} from "./resendCode.component";
import {RegisterComponent} from "./register.component";
@Component({
    templateUrl: 'confirmRegistration.html',
    providers: [UserRegistrationService]
})
export class ConfirmRegistrationComponent {
    confirmationCode: string;

    constructor(public nav: NavController, public userRegistration: UserRegistrationService, public navParam: NavParams, public alertCtrl: AlertController) {
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
    cognitoCallback(message: string, result: any) {
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

    doAlert(title: string, message: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

}
