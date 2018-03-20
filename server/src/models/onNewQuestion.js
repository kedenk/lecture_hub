'use strict';

module.exports = class OnNewQuestion {

    constructor(lectureID, questionID, voteRatio, author, textContent) {
        this.lectureID = lectureID;
        this.questionID = questionID;
        this.voteRatio = voteRatio;
        this.author = author;
        this.textContent = textContent;
    }
};