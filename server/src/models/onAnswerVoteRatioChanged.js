'use strict';

module.exports = class OnAnswerVoteRatioChanged {

    constructor(answerID, voteRatio) {
    this.answerID = answerID;
    this.voteRatio = voteRatio;
    }
};