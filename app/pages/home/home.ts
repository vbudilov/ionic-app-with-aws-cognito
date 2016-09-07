import {Component} from "@angular/core";
import {LoginComponent} from "../auth/auth";
import {NavController} from "ionic-angular/index";
import {AwsUtil} from "../../services/aws.service";

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  constructor(public nav:NavController) {

  }

  ionViewLoaded() {
    AwsUtil.initAwsService({
      callback() {
      }, callbackWithParam() {
      }
    });
  }

  ionViewDidEnter() {
    console.log("navigating to LoginComponent");
    this.nav.setRoot(LoginComponent);
  }

  ionViewWillLeave() {
    // console.log("Looks like I'm about to leave :(");
  }

}
