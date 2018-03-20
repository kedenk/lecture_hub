import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import {UserService} from './services/user.service';
import {Student} from './api/index';
import {UinotificationService, NotificationTypes, NotificationAlign, NotificationPosition} from "./services/uinotification.service";
import {FormGroup, FormControl} from "@angular/forms";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loginErrorMessage: string;

    loginForm: FormGroup;

    constructor(
        public location: Location,
        private userService: UserService,
        private notiService: UinotificationService) {}

    ngOnInit() {
        this.loginForm = new FormGroup({
            username: new FormControl()
        });
    }

    isMap(path) {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice( 1 );
        if (path === titlee) {
            return false;
        } else {
            return true;
        }
    }

    loginUser(): void {

        if ( !this.loginForm.valid ) {

            this.notiService.showNotification(
                NotificationPosition.top,
                NotificationAlign.center,
                NotificationTypes.warning,
                'Please insert a username');

            this.loginErrorMessage = 'Please insert a username';
            return;
        }

        let username: string = this.loginForm.value.username.toString();
        console.log("Username is: ", username);
        this.userService.login( username ).subscribe(
            data => {
                console.log("Lodded in: ", data);
                this.notiService.showNotification(
                    NotificationPosition.top,
                    NotificationAlign.center,
                    NotificationTypes.warning,
                    'Hello ' + data.username + ". You are logged in now!");

                this.loginErrorMessage = '';
            },
            error => {
                this.notiService.showNotification(NotificationPosition.top, NotificationAlign.center, NotificationTypes.warning, error);
            }
        );
    }

    isLoggedIn(): boolean {
        return this.userService.isLoggedIn();
    }
}
