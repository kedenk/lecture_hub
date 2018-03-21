import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Answer} from '../../api/model/answer';
import {Body5} from '../../api/model/body5';
import {UserService} from '../../services/user.service';
import {AnswerService} from '../../api/api/answer.service';
import {NotificationAlign, NotificationPosition, NotificationTypes, UinotificationService} from '../../services/uinotification.service';
import {Body4} from 'app/api';
import {AnswerTextChanged} from '../../api/model/answertextchanged';

@Component({
  selector: 'app-answerview',
  templateUrl: './answerview.component.html',
  styleUrls: ['./answerview.component.scss']
})
export class AnswerviewComponent {

    /***
     * The answer of the question
     */
    @Input()
    answer: Answer;

    /***
     * Event is triggered, if a vote of an answer has changed
     * @type {EventEmitter<Answer>}
     */
    @Output()
    onAnswerVoteChanged: EventEmitter<Answer> = new EventEmitter<Answer>();
    /***
     * Event is triggered, if a answer text content has changed
     * @type {EventEmitter<AnswerTextChanged>}
     */
    @Output()
    onAnswerTextChanged: EventEmitter<AnswerTextChanged> = new EventEmitter<AnswerTextChanged>();

    private isAnswerVotingLoading: boolean = false;
    private isAnswerUpdateSending: boolean = false;

    /***
     * Variables for answer change dialog
     */
    private changedAnswerContent: string = '';
    private isUpdateAnswerDialog: boolean = false;

    constructor(
      private userService: UserService,
      private answerService: AnswerService,
      private uiNotiService: UinotificationService
    ) { }


    /***
     * Triggers the output event <code>onAnswerVoteChanged</code>
     * @param {Answer} answer
     */
    answerVoteChanged( answer: Answer ): void {
        if( answer !== undefined ) {
            this.onAnswerVoteChanged.emit(answer);
        }
    }

    /***
     * Triggers the output event <code>onAnswerTextChanged</code>
     * @param {Answer} answer
     */
    answerTextContentChanged( changedAnswer: AnswerTextChanged ): void {
        if( changedAnswer !== undefined ) {
            this.onAnswerTextChanged.emit( changedAnswer );
        }
    }

    /***
    * Invoke to upvote an answer
    * @param {Answer} answer
    */
    onAnswerUpvote( answer: Answer ): void {
      this.answerVote(answer, 1);
    }

    /***
    * Invoke to downvote an answer
    * @param {Answer} answer
    */
    onAnswerDownvote( answer: Answer ): void {
      this.answerVote(answer, -1);
    }


    /***
    * Performs the actual vote request for an answer to the server
    * @param {Answer} answer
    * @param {number} vote
    */
    private answerVote(answer: Answer, vote: number): void {

      if (!this.isAnswerVotingLoading && answer !== undefined) {
          this.isAnswerVotingLoading = true;

          let b = new Body5();
          b.vote = vote;
          b.studentID = parseInt(this.userService.getCurrentUser().studentID);

          this.answerService.voteAnswer(answer.answerID, b).subscribe(
              data => {
                  this.uiNotiService.showNotification(NotificationPosition.top,
                      NotificationAlign.center,
                      NotificationTypes.success,
                      'Successfully voted.');

                  // udpate votes
                  answer.voteRatio = data.voteRatio;
                  answer.studentVote = vote;

                  this.answerVoteChanged( answer );
                  this.isAnswerVotingLoading = false;
              },
              error => {
                  console.log(error);
                  let msg = 'Unknown error. Please try again later.';

                  switch(error.status) {
                      case 405: msg = 'You already voted for this answer';
                          break;
                      case 403: msg = 'The studentID is invalid.';
                          break;
                      case 404: msg = 'The answer you voted for was not found.';
                          break;
                  }

                  this.uiNotiService.showNotification(NotificationPosition.top,
                      NotificationAlign.center,
                      NotificationTypes.danger,
                      msg);

                  this.isAnswerVotingLoading = false;
              }
          );
      }
    }


    /***
     * Sends a updated answer to the server
     * @param {Answer} answer
     */
    sendAnswerUpdate( answer: Answer ) {

        this.isAnswerUpdateSending = true;
        let b: Body4 = new Body4();
        b.studentID = parseInt(this.userService.getCurrentUserId(), 10);
        b.textContent = this.changedAnswerContent;

        this.answerService.updateAnswer( answer.answerID, b ).subscribe(
            data => {

                let a: AnswerTextChanged = new AnswerTextChanged();
                a.answerID = data.answerID;
                a.textContent = data.textContent;
                this.answerTextContentChanged( a );
                this.closeUpdateAnswerDialog();
                this.isAnswerUpdateSending = false;
            },
            error => {
                console.error(error);
                this.isAnswerUpdateSending = false;
            }
        )
    }


    showUpdateAnswerDialog( answer: Answer ): void {
        this.changedAnswerContent = answer.textContent;
        this.isUpdateAnswerDialog = true;
    }

    closeUpdateAnswerDialog(): void {
        this.changedAnswerContent = '';
        this.isUpdateAnswerDialog = false;
    }

    /***
     * Checks, if the logged user is the author of the given answer
     * @param {Answer} answer
     * @returns {boolean} True, if author, else False
     */
    isAnswerAuthor( answer: Answer ): boolean {

        let answerAuthor: number = parseInt(answer.author.studentID, 10);
        return parseInt(this.userService.getCurrentUser().studentID, 10) === answerAuthor;
    }
}
