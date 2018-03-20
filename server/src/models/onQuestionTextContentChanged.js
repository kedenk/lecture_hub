'use strict';

module.exports = class OnQuestionTextContentChanged {

    constructor(questionID, textContent) {
        this.questionID = questionID;
        this.textContent = textContent;
    }
};