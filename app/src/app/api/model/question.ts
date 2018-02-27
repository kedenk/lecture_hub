/**
 * WebDev Practical Project Server API
 * WebDev Practical Project Server API
 *
 * OpenAPI spec version: 1.0.0
 * Contact: maximilian.altmeyer@dfki.de
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { Lecture } from './lecture';
import { Student } from './student';


export class Question {
    /**
     * questionID as generated by the database system
     */
    questionID?: number;
    lecture?: Lecture;
    author?: Student;
    /**
     * The question itself
     */
    textContent?: string;
    /**
     * Number of all upvotes for this question subtracted by the number of downvotes
     */
    voteRatio?: number;
    /**
     * The vote that was performed by the student for which studentID was given (either 0,1,-1)
     */
    studentVote?: number;
}