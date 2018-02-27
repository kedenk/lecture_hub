import { Component, OnInit } from '@angular/core';

import {
    UinotificationService, NotificationTypes, NotificationAlign,
    NotificationPosition
} from '../services/uinotification.service';
import {ChatService} from '../services/chat.service';
import {Lecture} from '../api/model/models';
import {LectureService} from 'app/api';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    lectures: Lecture[] = [];
    lastUpdate: Date;
    lecturesLoading = false;

  constructor(
      private uiNotiService: UinotificationService,
      private chatService: ChatService,
      private lectureService: LectureService,
      private router: Router
  ) { }

  ngOnInit() {

      this.chatService.initSocket();
      this.chatService.onMessage().subscribe(
          data => {
              this.uiNotiService.showNotification('top', 'center', NotificationTypes.success, data);
              console.log(data);
          });

      this.refreshLectures();
    }

    /***
     * Fetches all lectures from the server
     */
    refreshLectures(): void {

        this.lecturesLoading = true;
        this.lectureService.getLectures().subscribe(
            data => {
                console.log(data);
                this.lectures = data;
                this.lecturesLoading = false;
                this.lastUpdate = new Date();
            },
            error => {
                this.uiNotiService.showNotification(NotificationPosition.top,
                    NotificationAlign.center,
                    NotificationTypes.danger,
                    'We can not fetch data from the server. Please check your network connection or server status.');
                console.error(error);
                this.lecturesLoading = false;
            }
        );
    }

    /***
     * Method, if a lecture is selected in the table
     * @param {Lecture} lecture
     */
    lectureSelected( lecture: Lecture ): void {

        const navigationExtras: NavigationExtras = {
            queryParams: {
                lecture: JSON.stringify(lecture)
            }
        }

        this.router.navigate(['lecture'], navigationExtras);
    }
}