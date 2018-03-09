'use strict';

module.exports = class Question {

    constructor(questionID, lecture, author, textContent, voteRatio, studentVote) {
        this.questionID = questionID;
        this.lecture = lecture;
        this.author = author;
        this.textContent = textContent;
        this.voteRatio = parseInt(voteRatio);
        this.studentVote = parseInt(studentVote);
    }
};