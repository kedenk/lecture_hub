import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {UserService} from './services/user.service';
import {UinotificationService, NotificationTypes, NotificationAlign, NotificationPosition} from './services/uinotification.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loginErrorMessage: string;

    loginForm: FormGroup;
    username: FormControl;

    minUsernameLength = 5;
    maxUsernameLength = 12;

    constructor(
        public location: Location,
        private userService: UserService,
        private notiService: UinotificationService) {}

    ngOnInit() {
        this.username = new FormControl('', [
            Validators.required,
            Validators.minLength(this.minUsernameLength),
            Validators.maxLength(this.maxUsernameLength)
        ]);

        this.loginForm = new FormGroup({
            username: this.username
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

        const username: string = this.username.value.toString();

        this.userService.login( username ).subscribe(
            data => {

                this.notiService.showNotification(
                    NotificationPosition.top,
                    NotificationAlign.center,
                    NotificationTypes.warning,
                    'Hello ' + data.username + '. You are logged in now!');

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
