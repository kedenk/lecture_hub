import {Student} from './student';

export class NewAnswer {
    /**
     * answerID as generated by the database system
     */
    answerID?: number;
    author?: Student;

    questionID?: number;
    /**
     * The _answer itself
     */
    textContent?: string;
    /**
     * Number of all upvotes for this _answer subtracted by the number of downvotes
     */
    voteRatio?: number;
    /**
     * The vote that was performed by the student for which studentID was given (either 0,1,-1)
     */
    studentVote?: number;
}