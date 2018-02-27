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

    currentUser: Student;
    loggedin = false;
    loginErrorMessage: string;

    loginForm: FormGroup;

    constructor(
        public location: Location,
        private userService: UserService,
        private notiService: UinotificationService) {}

    ngOnInit() {

        this.loggedin = false;
        this.currentUser = new Student();

        this.loginForm = new FormGroup({
            username: new FormControl()
        });

        // just for testing now
        const currentUserId = this.userService.isLoggedIn();
        console.log(currentUserId);

        if ( currentUserId && currentUserId !== undefined && currentUserId !== '' ) {
            this.currentUser = this.userService.getCurrentUser();
            this.loggedin = true;
        }
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

    login(): void {

        if ( !this.loginForm.valid ) {

            this.notiService.showNotification(
                NotificationPosition.top,
                NotificationAlign.center,
                NotificationTypes.warning,
                'Please insert a username');

            this.loginErrorMessage = 'Please insert a username';
            this.loggedin = false;
            return;
        }
console.log("first")

        console.log("second");
        this.userService.getUserId(this.loginForm.value.username).subscribe(
            data => {
                this.currentUser = data;
                this.notiService.showNotification(
                    NotificationPosition.top,
                    NotificationAlign.center,
                    NotificationTypes.warning,
                    'Successfully logged in.');

                this.loginErrorMessage = '';
                this.loggedin = true;
            },
            error => {
                this.loggedin = false;
                this.notiService.showNotification(NotificationPosition.top, NotificationAlign.center, NotificationTypes.warning, error);
            }
        );
    }
}
