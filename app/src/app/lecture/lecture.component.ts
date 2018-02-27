import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Lecture} from '../api/model/models';
import {Mood} from '../api/model/mood';
import {MoodService} from '../api/api/mood.service';
import {
    NotificationAlign, NotificationPosition, NotificationTypes,
    UinotificationService
} from 'app/services/uinotification.service';
import {ChartType, LegendItem} from 'app/lbd/lbd-chart/lbd-chart.component';
import {Subscription} from "rxjs/Subscription";
import {ServerNotificationService} from "../services/servernotification.service";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-lecture',
    templateUrl: './lecture.component.html'
})
export class LectureComponent implements OnInit, OnDestroy {

    lecture: Lecture;

    mood: Mood;
    moodIsLoading = false;
    moodChartType: ChartType;
    moodChartData: any;
    moodChartLegendItems: LegendItem[];
    moodLastUpdate: Date;
    moodLastUpdateMessage: string;
    moodErrorMessage: string;

    moodUpdateSubscription: Subscription;

    public constructor(private route: ActivatedRoute,
                       private moodService: MoodService,
                       private uiNotiService: UinotificationService,
                       private serverNotiService: ServerNotificationService,
                       private datePipe: DatePipe) {

        this.route.queryParams.subscribe(
            params => {
                console.log(params);
                this.lecture = new Lecture();
                this.lecture = JSON.parse(params['lecture']);
                console.log(this.lecture);
            }
        );
    }

    ngOnInit(): void {

        this.refreshMood();

        this.serverNotiService.initSocket();
        this.moodUpdateSubscription = this.serverNotiService.onMoodChanged().subscribe(data => {
            this.mood = data;
            this.setLastMoodUpdateTime();
        });
    }

    ngOnDestroy(): void {

        if ( this.moodUpdateSubscription !== undefined ) {
            this.moodUpdateSubscription.unsubscribe();
        }
    }


    initMoodChart(): void {

        const fraction = 0;
        const moodSum = this.mood.neutral + this.mood.positive + this.mood.negative;
        const posPerc = (this.mood.positive / moodSum) * 100;
        const neutPerc = (this.mood.neutral / moodSum) * 100;
        const negPerc = (this.mood.negative / moodSum) * 100;

        this.moodChartType = ChartType.Pie;
        this.moodChartData = {
            labels: [posPerc.toFixed(fraction).toString() + '%',
                neutPerc.toFixed(fraction).toString() + '%',
                negPerc.toFixed(fraction).toString() + '%'],
            series: [posPerc, neutPerc, negPerc]
        };
        this.moodChartLegendItems = [
            { title: 'Positive (' + this.mood.positive + ')', imageClass: 'fa fa-circle text-info' },
            { title: 'Neutral (' + this.mood.neutral + ')', imageClass: 'fa fa-circle text-warning' },
            { title: 'Negative (' + this.mood.negative + ')', imageClass: 'fa fa-circle text-danger' }
        ];
    }

    setLastMoodUpdateTime(): void {

        this.moodLastUpdate = new Date();
        this.moodLastUpdateMessage = 'Last Update: ' + this.datePipe.transform(this.moodLastUpdate, 'dd.MM.yyyy HH:mm:ss');
    }

    /***
     * Refreshes the mood with current data from server
     */
    refreshMood(): void {

        this.moodIsLoading = true;
        this.moodService.getMoodByLectureID( this.lecture.lectureid ).subscribe(
            data => {
                this.mood = data;
                this.moodIsLoading = false;
                this.setLastMoodUpdateTime();

                this.initMoodChart();
            },
            error => {

                if ( error.status && error.status === 404 ) {
                    this.moodErrorMessage = 'Currently no voting available';

                } else {

                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.danger,
                        'We can not fetch data from the server. Please check your network connection or server status.');
                }
                console.error(error);
                this.moodIsLoading = false;
            }
        );
    }

}
