'use strict';

module.exports = class Answer {

    constructor(answerID, author, answerTo, textContent, voteRatio, studentVote) {
        this.answerID = answerID;
        this.author = author;
        this.answerTo = answerTo;
        this.textContent = textContent;
        this.voteRatio = parseInt(voteRatio);
        this.studentVote = parseInt(studentVote);
    }
};