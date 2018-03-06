import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QuestionService} from '../api/api/question.service';
import {AnswerService} from '../api/api/answer.service';
import {Question, Student, Answer} from '../api/model/models';
import {UserService} from '../services/user.service';

@Component({
    selector: 'app-questionpreview',
    templateUrl: './questionpreview.component.html',
    styleUrls: ['./questionpreview.component.css']
})
export class QuestionpreviewComponent implements OnInit, OnDestroy {

    @Input()
    lectureId: number;
    currentUser: Student;

    questions: Question[] = [];
    answerDict = {};
    isQuestionLoading = false;
    isVotingLoading = false;

    constructor(private userService: UserService,
                private questionService: QuestionService,
                private answerService: AnswerService) {}

    ngOnInit(): void {

        this.isQuestionLoading = true;

        this.currentUser = this.userService.getCurrentUser();

        this.questionService.getQuestionsByLectureID( this.lectureId, parseInt(this.currentUser.studentid, 10) ).subscribe(
            data => {
                this.questions = data;
                this.sortQuestions();

                this.isQuestionLoading = false;

                // get the answers for every question
                /*
                this.questions.forEach(
                    question => {
                        this.answerService.getAnswersByQuestionID(question.questionID, parseInt(this.currentUser.studentid, 10)).subscribe(
                            data => {
                                this.answerDict[question.questionID] = data;
                            },
                            error => console.error(error)
                        );
                });*/
            },
            error => {
                console.error(error);
                this.isQuestionLoading = false;
            }
        );
    }

    ngOnDestroy(): void {
    }

    /***
     * Is triggered, if upvote button for question is clicked
     * @param {Question} question
     */
    onUpvote(question: Question): void {

        // Check, if a vote is currently in process
        // The user has to wait until his vote is processed
        // Same for downvote
        if (!this.isVotingLoading) {
            this.isVotingLoading = true;
            console.log("Upvote");

            // process voting

            this.isVotingLoading = false;
        }
    }

    /***
     * Is triggered, if downvote button for question is clicked
     * @param {Question} question
     */
    onDownvote(question: Question): void {

        if (!this.isVotingLoading) {
            this.isVotingLoading = true;
            console.log("Downvote");


            // process voting

            this.isVotingLoading = false;
        }
    }

    updateVote(questionID: number, newVoteRatio: number): void {

        this.questions.forEach(
            question => {
                if ( question.questionID === questionID ) {
                    question.voteRatio = newVoteRatio;
                }
            }
        );

        this.sortQuestions();
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
}
