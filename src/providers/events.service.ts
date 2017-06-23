import {Events} from "ionic-angular/index";
import {Injectable} from "@angular/core";

export const _USER_LOGOUT_EVENT = 'user:logout';
export const _USER_LOGIN_EVENT = 'user:login';

@Injectable()
export class EventsService {

    constructor(public events: Events) {

    }

    sendLoggedInEvent() {
        console.log("Publishing login event");
        this.events.publish(_USER_LOGIN_EVENT);
    }

    sendLogoutEvent() {
        console.log("Publishing logout event");
        this.events.publish(_USER_LOGOUT_EVENT);
    }

}
