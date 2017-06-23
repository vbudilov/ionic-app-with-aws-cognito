import {Component} from "@angular/core";
import {LoggedInCallback} from "../../providers/cognito.service";
import {UserLoginService} from "../../providers/userLogin.service";
import {NavController} from "ionic-angular";
import {LoginComponent} from "./login.component";
@Component({
    template: ''
})
export class LogoutComponent implements LoggedInCallback {

    constructor(public navCtrl: NavController, public userService: UserLoginService) {
        this.userService.isAuthenticated(this)
    }

    isLoggedInCallback(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.userService.logout();
        }
        this.navCtrl.setRoot(LoginComponent)
    }
}







