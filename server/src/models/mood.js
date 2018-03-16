'use strict';

module.exports = class Mood {

    constructor(lectureID, positive, negative, neutral) {
        this.lectureID = lectureID;
        this.positive = positive;
        this.negative = negative;
        this.neutral = neutral;
    }
};