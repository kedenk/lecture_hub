'use strict';

module.exports = class OnQuestionVoteRatioChanged {

    constructor(questionID, voteRatio) {
        this.questionID = questionID;
        this.voteRatio = voteRatio;
    }
};