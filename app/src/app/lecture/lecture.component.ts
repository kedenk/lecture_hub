import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Lecture, Body3} from '../api/model/models';
import {Mood} from '../api/model/mood';
import {MoodService} from '../api/api/mood.service';
import {
    NotificationAlign, NotificationPosition, NotificationTypes,
    UinotificationService
} from 'app/services/uinotification.service';
import {Subscription} from 'rxjs/Subscription';
import {ServerNotificationService} from '../services/servernotification.service';
import {DatePipe} from '@angular/common';
import {UserService} from '../services/user.service';
import {Body} from '../api/model/body';
import {QuestionService} from '../api/api/question.service';

@Component({
    selector: 'app-lecture',
    templateUrl: './lecture.component.html',
    styleUrls: [ './lecture.component.css' ]
})
export class LectureComponent implements OnInit, OnDestroy {

    lecture: Lecture;

    mood: Mood;
    moodIsLoading = false;
    moodLastUpdate: Date;
    moodLastUpdateMessage: string;
    moodErrorMessage: string;
    userLectureMood = -5;
    showMoodHelp = false;

    moodResizeMultiplicator = 4;
    /***
     * Icon size in percentage
     */
    moodIconStdSize = 50;
    moodPosIconSize = 50;
    moodNeutIconSize = 50;
    moodNegIconSize = 50;

    moodUpdateSubscription: Subscription;

    isQuestionDialog = false;
    isQuestionAdding = false;
    newQuestionContent = '';
    minQuestionContentLength = 10;

    public constructor(private route: ActivatedRoute,
                       private moodService: MoodService,
                       private uiNotiService: UinotificationService,
                       private serverNotiService: ServerNotificationService,
                       private userService: UserService,
                       private questionService: QuestionService,
                       private datePipe: DatePipe) {

        this.route.queryParams.subscribe(
            params => {
                this.lecture = new Lecture();
                this.lecture = JSON.parse(params['lecture']);
            }
        );
    }

    ngOnInit(): void {

        this.refreshMood();
        this.getStudentsMood();

        this.serverNotiService.initSocket();
        this.moodUpdateSubscription = this.serverNotiService.onMoodChanged().subscribe(data => {

            // websockets sends different format than class mood is -> decode it to correct class
            // only update, if it is the correct lecture
            if ( data.lectureID == this.lecture.lectureID ) {

                this.mood = new Mood();
                this.mood.lectureID = data.lectureID;
                this.mood.positive = data.mood.positive;
                this.mood.neutral = data.mood.neutral;
                this.mood.negative = data.mood.negative;
                this.updateMoodIcons();
                this.setLastMoodUpdateTime();
            }
        });
    }

    ngOnDestroy(): void {

        if ( this.moodUpdateSubscription !== undefined ) {
            this.moodUpdateSubscription.unsubscribe();
        }
    }


    /***
     * Sends the current mood for the logged student
     * @param value 1 | 0 | -1
     */
    sendMood( value ): void {

        if ( value !== 1 && value !== 0 && value !== -1 ) {
            console.error( 'No valid mood value given' );
            return;
        }
        this.moodIsLoading = true;

        const b: Body = new Body();
        b.studentID = parseInt(this.userService.getCurrentUser().studentID, 10);
        b.mood = value;
        this.moodService.postMoodForLecture( this.lecture.lectureID, b ).subscribe(
            data => {
                this.mood = data;
                this.updateMoodIcons();
                this.getStudentsMood();
                this.moodIsLoading = false;
                this.setLastMoodUpdateTime();
            },
            error => {
                console.error(error);
                let msg = 'Unexpected error occurred. Please try again later.';

                if ( error.status === 404 ) {
                    msg = 'Lecture not found';
                }
                if ( error.status === 403 ) {
                    msg = 'Invalid studentID';
                }

                this.uiNotiService.showNotification(NotificationPosition.top,
                    NotificationAlign.center,
                    NotificationTypes.danger,
                    msg);

                this.moodIsLoading = false;
            }
        )
    }

    /***
     * Get mood for lecture for current logged student
     */
    getStudentsMood(): void {

        this.moodService.getMoodForStudentByLecture( this.lecture.lectureID,
            parseInt(this.userService.getCurrentUser().studentID, 10) ).subscribe(
            data => {
                this.userLectureMood = data.mood;
            },
            error => {
                console.error(error);

                if ( error.status !== 404 ) {
                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.danger,
                        'Unable to fetch your mood.');
                }
            }
        );
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
        this.moodService.getMoodByLectureID( this.lecture.lectureID ).subscribe(
            data => {
                this.mood = data;
                this.updateMoodIcons();
                this.moodIsLoading = false;
                this.setLastMoodUpdateTime();

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
                this.setLastMoodUpdateTime();
                this.moodIsLoading = false;
            }
        );
    }

    /***
     * Updates the mood icon size depending on the current lecture mood
     */
    updateMoodIcons(): void {

        if ( this.mood ) {
            this.moodPosIconSize = this.moodIconStdSize + (this.mood.positive * this.moodResizeMultiplicator);
            this.moodNeutIconSize = this.moodIconStdSize + (this.mood.neutral * this.moodResizeMultiplicator);
            this.moodNegIconSize = this.moodIconStdSize + (this.mood.negative * this.moodResizeMultiplicator);
        }
    }


    showNewQuestionDialog(): void {
        this.isQuestionDialog = true;
    }

    closeNewQuestionDialog(): void {
        this.isQuestionDialog = false;
    }

    sendNewQuestion(): void {

        if ( this.newQuestionContent !== undefined && this.newQuestionContent.length > this.minQuestionContentLength ) {

            this.isQuestionAdding = true;

            const b: Body3 = new Body3();
            b.studentID = parseInt(this.userService.getCurrentUser().studentID, 10);
            b.textContent = this.newQuestionContent;

            this.questionService.addQuestion( this.lecture.lectureID, b).subscribe(
                data => {

                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.success,
                        'Question successfully submitted.');

                    this.newQuestionContent = '';
                    this.closeNewQuestionDialog();
                    this.isQuestionAdding = false;
                },
                error => {
                    console.error(error);

                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.danger,
                        error.message);

                    this.isQuestionAdding = false;
                }
            );

        } else {

            this.uiNotiService.showNotification(NotificationPosition.top,
                NotificationAlign.center,
                NotificationTypes.warning,
                'Question should not be empty and the text longer than ' + this.minQuestionContentLength + ' characters.');
        }
    }


    /***
     * Checks, if new question is valid
     * @returns {boolean}
     */
    newQuestionValid(): boolean {

        if ( this.newQuestionContent ) {
            return this.newQuestionContent.length > this.minQuestionContentLength;
        } else {
            return false;
        }
    }
}
