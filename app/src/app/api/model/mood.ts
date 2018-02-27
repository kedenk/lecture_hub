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



export class Mood {
    /**
     * lectureID of the corresponding lecture
     */
    lectureid?: number;
    /**
     * number of positive (1) mood votings
     */
    positive?: number;
    /**
     * number of negative (-1) mood votings
     */
    negative?: number;
    /**
     * number of neutral (0) mood votings
     */
    neutral?: number;
}
