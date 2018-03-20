import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionService} from '../api/api/question.service';
import {Question, Student, QuestionTextContentChanged, QuestionVoteRatioChanged} from '../api/model/models';
import {UserService} from '../services/user.service';
import {
    NotificationAlign, NotificationPosition, NotificationTypes,
    UinotificationService
} from '../services/uinotification.service';
import {Subscription} from 'rxjs/Subscription';
import {ServerNotificationService} from '../services/servernotification.service';

@Component({
    selector: 'app-questionoverview',
    templateUrl: './questionoverview.component.html',
    styleUrls: ['./questionoverview.component.css']
})
export class QuestionoverviewComponent implements OnInit, OnDestroy {

    @Input()
    lectureId: number;
    currentUser: Student;

    questions: Question[] = [];
    isQuestionLoading = false;

    onNewQuestionSubscription: Subscription;
    onQuestionUpdateSubscription: Subscription;
    onQuestionVoteUpdateSubsription: Subscription;

    constructor(private userService: UserService,
                private uiNotiService: UinotificationService,
                private questionService: QuestionService,
                private serverNotiService: ServerNotificationService
                ) {}

    ngOnInit(): void {

        this.currentUser = this.userService.getCurrentUser();
        this.getQuestions();

        // add subscription for new Questions
        this.onNewQuestionSubscription = this.serverNotiService.onNewQuestion().subscribe(
            question => this.addNewQuestion( question )
        )

        this.onQuestionUpdateSubscription = this.serverNotiService.onQuestionTextContentChanged().subscribe(
            questionUpdate => this.updateQuestionContent( questionUpdate )
        )

        this.onQuestionVoteUpdateSubsription = this.serverNotiService.onQuestionVoteRatioChanged().subscribe(
            voteUpdate => this.updateQuestionVotes( voteUpdate )
        )
    }

    /***
     * Cleanup
     */
    ngOnDestroy(): void {

        if ( this.onNewQuestionSubscription !== undefined ) {
            this.onNewQuestionSubscription.unsubscribe();
        }

        if ( this.onQuestionUpdateSubscription !== undefined ) {
            this.onQuestionUpdateSubscription.unsubscribe();
        }

        if ( this.onQuestionVoteUpdateSubsription !== undefined ) {
            this.onQuestionVoteUpdateSubsription.unsubscribe();
        }
    }


    /***
     * Get all questions for this lecture from the server
     */
    getQuestions(): void {

        this.isQuestionLoading = true;
        this.questionService.getQuestionsByLectureID( this.lectureId, parseInt(this.currentUser.studentID, 10) ).subscribe(
            data => {
                this.questions = data;
                this.sortQuestions();

                this.isQuestionLoading = false;
            },
            error => {
                console.error(error);
                this.isQuestionLoading = false;
            }
        );
    }

    /***
     * Adds a new question to the question list
     * @param {Question} question
     */
    private addNewQuestion( question: Question ): void {

        if( this.questions === undefined ) {
            this.questions = [];
        }

        if( question !== undefined ) {
            this.questions.push(question);
            this.sortQuestions();

            this.serverUpdateUIInfo( 'New question was added' );
        }
    }


    /***
     * Updates the content of a question
     * @param {QuestionTextContentChanged} questionUpdate
     */
    private updateQuestionContent( questionUpdate: QuestionTextContentChanged ) {

        if( questionUpdate !== undefined ) {

            this.questions.forEach(
                question => {
                    if ( question.questionID == questionUpdate.questionID ) {
                        question.textContent = questionUpdate.textContent;

                        this.serverUpdateUIInfo( 'A question text was updated' );
                        return;
                    }
                }
            )
        }
    }

    /***
     * Updates the vote of a question
     * @param {QuestionVoteRatioChanged} voteUpdate
     */
    private updateQuestionVotes( voteUpdate: QuestionVoteRatioChanged ) {

        if( voteUpdate !== undefined ) {

            this.questions.forEach(
                question => {
                    if ( question.questionID == voteUpdate.questionID ) {
                        question.voteRatio = voteUpdate.voteRatio;
                        // new vote, so we may have to order the questions new
                        this.sortQuestions();
                        this.serverUpdateUIInfo( 'A question vote was updated' );
                        return;
                    }
                }
            )
        }
    }


    /***
     * Shows a info message in the UI with the given message
     * @param {string} message
     */
    private serverUpdateUIInfo( message: string ) {

        this.uiNotiService.showNotification(NotificationPosition.top,
            NotificationAlign.center,
            NotificationTypes.info,
            message);
    }

    /***
     * Sorts all Questions in the list <code>question</code> descending
     */
    sortQuestions(): void {
        this.questions.sort(this.questionSortDECFunc);
    }

    /***
     * Custom sort function for questions
     * Orders questions with hottest first
     * @param {Question} q1
     * @param {Question} q2
     * @returns {number}
     */
    questionSortDECFunc(q1: Question, q2: Question): number {
        return q2.voteRatio - q1.voteRatio;
    }
}
