import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Question} from '../../api/model/question';
import {
    NotificationAlign, NotificationPosition, NotificationTypes,
    UinotificationService
} from '../../services/uinotification.service';
import {Body2} from '../../api/model/body2';
import {Body6} from '../../api/model/body6';
import {AnswerService} from 'app/api';
import {QuestionService} from '../../api/api/question.service';
import {UserService} from '../../services/user.service';
import {Answer} from '../../api/model/answer';
import {ActivatedRoute} from '@angular/router';
import {Body1} from '../../api/model/body1';
import {ServerNotificationService} from '../../services/servernotification.service';
import {Subscription} from 'rxjs/Subscription';
import {AnswerTextChanged} from '../../api/model/answertextchanged';
import {AnswerVoteRatioChanged} from '../../api/model/answervoteratechanged';
import {NewAnswer} from '../../api/model/newanswer';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-questionview',
  templateUrl: './questionview.component.html',
  styleUrls: ['./questionview.component.css'],
  animations: [
      trigger('onAnswerChangedAnimation', [
          state('show', style({ background: 'lime' })),
          state('hide', style({ background: 'white' })),
          transition( 'show <=> hide', animate('500ms'))
      ])
  ]
})
export class QuestionviewComponent implements OnInit, OnDestroy {

    @Input()
    onlyPreview = false;

    private question: Question;
    private answers: Answer[] = [];

    private newAnswerTextContent = '';
    private minAnswerLength = 10;
    private minQuestionText = 10;

    private isVotingLoading = false;

    private isAnswerLoading = false;
    private isLoading = false;

    private isAnswerDialog = false;
    private isAnswerSending = false;
    private isUpdateDialog = false;

    private changedQuestionContent = '';

    private onNewAnswerSubscription: Subscription;
    private onAnswerTextChangedSubscription: Subscription;
    private onAnswerVoteChangedSubscription: Subscription;

    private answerChangedState: string;

    constructor(private uiNotiService: UinotificationService,
              private userService: UserService,
              private questionService: QuestionService,
              private answerService: AnswerService,
                private serverNotiService: ServerNotificationService,
                private route: ActivatedRoute) { }

    ngOnInit() {

        const questionIDParam = this.route.snapshot.queryParams.questionID;
        this.isLoading = true;

        if ( questionIDParam !== undefined ) {

            // get the question to visualize
            this.questionService.getQuestionsByQuestionID( questionIDParam, this.getCurrentUserID() ).subscribe(
                question => {
                    // load question and answers afterwards
                    this.question = question;
                    this.isLoading = false;

                    // get the answers for this question
                    this.getAnswers();
                },
                error => {
                    console.error(error);
                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.danger,
                        'No server connection. Please try again later.');

                    this.isLoading = false;
                }
            );
        } else {
            this.getAnswers();
        }

        //
        // Websocket subscriptions
        //
        this.onNewAnswerSubscription = this.serverNotiService.onNewAnswer().subscribe(
            newAnswer => this.addNewAnswer( newAnswer )
        );

        this.onAnswerTextChangedSubscription = this.serverNotiService.onAnswerTextChanged().subscribe(
            updatedAnswer => this.changeAnswerText( updatedAnswer )
        );
        this.onAnswerVoteChangedSubscription = this.serverNotiService.onAnswerVoteRatioChanged().subscribe(
            updatedAnswerVote => this.answerVoteChanged( updatedAnswerVote )
        );
    }

    /***
     * Cleanup on destroy
     */
    ngOnDestroy(): void {

        if ( this.onNewAnswerSubscription !== undefined ) {
            this.onNewAnswerSubscription.unsubscribe();
        }
        if ( this.onAnswerTextChangedSubscription !== undefined ) {
            this.onAnswerTextChangedSubscription.unsubscribe();
        }
        if ( this.onAnswerVoteChangedSubscription !== undefined ) {
            this.onAnswerVoteChangedSubscription.unsubscribe();
        }
    }

    @Input()
    set setQuestion( question: Question ) {
        this.question = question;
    }

    /***
     * Methods for state change of animations
     */
    notifyAnswerChanged() { this.answerChangedState = 'show'; }
    endNotifyAnswerChanged() { this.answerChangedState = 'hide'; }


    /***
     * Load all answers for this question
     */
    getAnswers(): void {

        this.isAnswerLoading = true;
        // get the answer for question
        this.answerService.getAnswersByQuestionID(this.question.questionID, this.getCurrentUserID()).subscribe(
            data => {
                this.answers = data;
                this.sortAnswers();

                this.isAnswerLoading = false;
                this.isLoading = false;
            },
            error => {
                this.isAnswerLoading = false;
                this.isLoading = false;
                console.error(error);
            }
        );
    }


    /***
     * Adds a new answer to the answer list
     * @param {Answer} newAnswer
     */
    private addNewAnswer( newAnswer: NewAnswer ): void {

        if ( this.answers === undefined ) {
            this.answers = [];
        }

        // check, if this answer is for this question
        if ( newAnswer.questionID !== this.question.questionID ) {
            return;
        }

        // check if answer is already there
        this.answers.forEach(
            answer => {
                if ( answer.answerID === newAnswer.answerID ) {
                    return;
                }
            }
        );

        // add answer to list
        this.answers.push( newAnswer );
        this.sortAnswers();
    }


    /***
     * Changes the text content of an answer
     * @param {AnswerTextChanged} changedAnswer
     */
    private changeAnswerText( changedAnswer: AnswerTextChanged ): void {

        if ( changedAnswer !== undefined ) {
            this.answers.forEach(
                answer => {
                    // not nice but not patience anymore :D
                    if (answer.answerID === parseInt(changedAnswer.answerID.toString(), 10) &&
                        answer.textContent !== changedAnswer.textContent) {

                        answer.textContent = changedAnswer.textContent;

                        this.notifyAnswerChanged();
                        this.serverUpdateUIInfo('The content of an answer has changed.');
                        return;
                    }
                }
            );
        }
    }

    /***
     * Updates the vote ratio of an answer
     * @param {AnswerVoteRatioChanged} changedVoteRatio
     */
    private answerVoteChanged( changedVoteRatio: AnswerVoteRatioChanged ): void {

        if ( changedVoteRatio !== undefined ) {
            this.answers.forEach(
                answer => {
                    if ( answer.answerID === parseInt(changedVoteRatio.answerID.toString(), 10) ) {
                        answer.voteRatio = changedVoteRatio.voteRatio;
                        // new votes, we have to sort answers new
                        this.sortAnswers();

                        this.serverUpdateUIInfo('An answer voting has changed.');
                        return;
                    }
                }
            );
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

    getCurrentUserID(): number {
        return parseInt(this.userService.getCurrentUser().studentID, 10);
    }


    /***
     * Determines, if current logged user is author of this question
     * @returns {boolean}
     */
    isAuthor(): boolean {
        const questionAuthor: number = parseInt(this.question.author.studentID, 10);
        return this.getCurrentUserID() === questionAuthor;
    }

    /***
     * Sorts the answer for correct visualization
     */
    sortAnswers(): void {
        this.answers.sort(this.answerSortDECFunc);
    }

    /***
     * Custom sort function for answers
     * Orders answers with hottest first
     * @param {Answer} a1
     * @param {Answer} a2
     * @returns {number}
     */
    answerSortDECFunc(a1: Answer, a2: Answer): number {
        return a2.voteRatio - a1.voteRatio;
    }

    /***
     * Is triggered, if upvote button for question is clicked
     * @param {Question} question
     */
    onQuestionUpvote(question: Question): void {

        // Check, if a vote is currently in process
        // The user has to wait until his vote is processed
        // Same for downvote
        this.questionVote( question, 1 );
    }

    /***
     * Is triggered, if downvote button for question is clicked
     * @param {Question} question
     */
    onQuestionDownvote(question: Question): void {

        this.questionVote( question, -1 );
    }


    /***
     * Performs the actual request of a question vote to the server
     * @param {Question} question
     * @param {number} vote
     */
    private questionVote(question: Question, vote: number): void {

        if (!this.isVotingLoading && question !== undefined) {
            this.isVotingLoading = true;

            const b = new Body2();
            b.vote = vote;
            b.studentID = parseInt(this.userService.getCurrentUser().studentID, 10);

            this.questionService.voteQuestion(question.questionID, b).subscribe(
                data => {
                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.info,
                        'Successfully voted.');

                    this.question.voteRatio = data.voteRatio;
                    this.question.studentVote = vote;
                    this.isVotingLoading = false;
                },
                error => {
                    console.log(error);
                    let msg = 'Unknown error. Please try again later.';

                    switch (error.status) {
                        case 405: msg = 'You already voted for this question';
                            break;
                        case 403: msg = 'The studentID is invalid.';
                            break;
                        case 404: msg = 'The question you voted for was not found.';
                            break;
                    }

                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.danger,
                        msg);

                    this.isVotingLoading = false;
                }
            );
        }
    }


    showAnswerDialog(): void {
        this.isAnswerDialog = true;
    }

    closeNewAnswerDialog(): void {
        this.isAnswerDialog = false;
    }

    showUpdateDialog(): void {
        this.changedQuestionContent = this.question.textContent;
        this.isUpdateDialog = true;
    }

    closeUpdateDialog(): void {
        this.changedQuestionContent = '';
        this.isUpdateDialog = false;
    }

    /***
     * Sends a new answer to the server
     */
    sendNewAnswer(): void {

        if ( this.newAnswerTextContent !== undefined && this.newAnswerTextContent.length > this.minAnswerLength ) {

            const b = new Body6();
            b.textContent = this.newAnswerTextContent;
            b.studentID = this.getCurrentUserID();

            this.isAnswerSending = true;
            this.answerService.addAnswer( this.question.questionID, b).subscribe(
                data => {

                    // add new answer to answers
                    this.isAnswerSending = false;
                    // show all answers, if you added one
                    this.onlyPreview = false;
                    this.closeNewAnswerDialog();

                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.success,
                        'Answer saved');
                },
                error => {
                    console.log(error);
                    this.isAnswerSending = false;
                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.warning,
                        'A unexpected error occured. Please try again later.');
                }
            );
        } else {

            this.uiNotiService.showNotification(NotificationPosition.top,
                NotificationAlign.center,
                NotificationTypes.warning,
                'Answer must be longer than ' + this.minAnswerLength + ' characters');
        }
    }


    /***
     * Sends a updated question to the server.
     */
    sendUpdatedQuestion(): void {

        if ( this.question !== undefined && this.question.textContent.length > this.minQuestionText ) {

            this.isLoading = true;

            // send the question
            const b = new Body1();
            b.studentID = this.getCurrentUserID();
            b.textContent = this.changedQuestionContent;
            this.questionService.updateQuestion( this.question.questionID, b ).subscribe(
                data => {

                    this.question = data;
                    this.isLoading = false;
                    this.uiNotiService.showNotification(NotificationPosition.top,
                        NotificationAlign.center,
                        NotificationTypes.success,
                        'Question updated');

                    this.closeUpdateDialog();
                },
                error => {
                    console.error(error);
                    this.isLoading = false;
                }
            );


        } else {

            // warning if question is to short
            this.uiNotiService.showNotification(NotificationPosition.top,
                NotificationAlign.center,
                NotificationTypes.warning,
                'Question must be longer than ' + this.minQuestionText + ' characters');
        }
    }

    showAllAnswers( show: boolean ): void {
        this.onlyPreview = !show;
    }

    /***
     * Checks, if the new answer is valid
     * @returns {boolean}
     */
    newAnswerValid(): boolean {

        if ( this.newAnswerTextContent ) {
            return this.newAnswerTextContent.length > this.minAnswerLength;
        } else {
            return false;
        }
    }

    /***
     * Checks, if the changed question is valid
     * @returns {boolean}
     */
    changedQuestionValid(): boolean {

        if ( this.changedQuestionContent ) {
            return this.changedQuestionContent.length > this.minQuestionText;
        } else {
            return false;
        }
    }
}
