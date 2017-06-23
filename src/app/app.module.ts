import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {CognitoUtil} from "../providers/cognito.service";
import {AwsUtil} from "../providers/aws.service";
import {ControlPanelComponent} from "../pages/controlpanel/controlpanel";
import {EventsService} from "../providers/events.service";
import {LoginComponent} from "../pages/auth/login.component";
import {RegisterComponent} from "../pages/auth/register.component";
import {ConfirmRegistrationComponent} from "../pages/auth/confirmRegistration.component";
import {ResendCodeComponent} from "../pages/auth/resendCode.component";
import {ForgotPasswordStep1Component} from "../pages/auth/forgotPassword1.component";
import {ForgotPasswordStep2Component} from "../pages/auth/forgotPassword2.component";
import {UserLoginService} from "../providers/userLogin.service";
import {UserParametersService} from "../providers/userParameters.service";
import {UserRegistrationService} from "../providers/userRegistration.service";
import {LogoutComponent} from "../pages/auth/logout.component";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
    declarations: [
        MyApp,
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        ConfirmRegistrationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPasswordStep2Component,
        ControlPanelComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        BrowserModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        ConfirmRegistrationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPasswordStep2Component,
        ControlPanelComponent
    ],
    providers: [CognitoUtil,
        AwsUtil,
        UserLoginService,
        UserParametersService,
        UserRegistrationService,
        EventsService]
})

export class AppModule {
}
