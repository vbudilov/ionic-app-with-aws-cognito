import {Component, ViewChild} from "@angular/core";
import {Events, NavController, Platform, MenuController} from "ionic-angular";
import {Splashscreen} from "ionic-native";
import {LoginComponent, LogoutComponent} from "../pages/auth/auth";
import {AwsUtil} from "../providers/aws.service";
import {ControlPanelComponent} from "../pages/controlpanel/controlpanel";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(NavController) navCtrl;
  public loginPage = LoginComponent;
  public homePage = ControlPanelComponent;
  public logoutPage = LogoutComponent;
  public settingsPage = ControlPanelComponent;

  public rootPage:any;


  constructor(public platform:Platform,
              public menu:MenuController,
              public events:Events,
              public awsUtil:AwsUtil) {
    console.log("In MyApp constructor");

    this.platform.ready().then(() => {
      this.awsUtil.initAwsService();

      this.rootPage = this.loginPage;

      console.log("Hiding splash screen");
      Splashscreen.hide();
      this.listenToLoginEvents();
    });

  }

  openPage(page) {
    // Reset the nav controller to have just this page
    // we wouldn't want the back button to show in this scenario
    this.rootPage = page;

    // close the menu when clicking a link from the menu
    this.menu.close();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });


    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

}
