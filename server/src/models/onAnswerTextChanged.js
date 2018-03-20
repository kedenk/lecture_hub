'use strict';

module.exports = class OnAnswerTextChanged {

    constructor(answerID, textContent) {
    this.answerID = answerID;
    this.textContent = textContent;
    }
};