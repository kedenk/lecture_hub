'use strict';

module.exports = class OnNewAnswer {

    constructor(answerID, questionID, voteRatio, author, textContent) {
        this.answerID = answerID;
        this.questionID = questionID;
        this.voteRatio = voteRatio;
        this.author = author;
        this.textContent = textContent;
    }
};