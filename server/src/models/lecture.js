'use strict';

module.exports = class Lecture {

    constructor(lectureID, lectureName, lectureDescription) {
        this.lectureName = lectureName;
        this.lectureID = lectureID;
        this.lectureDescription = lectureDescription;
    }
};