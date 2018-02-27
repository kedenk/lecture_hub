'use strict';

module.exports = function(app) {
    /***
     * Routes for Answer
     */
    var answer = require('../controllers/Answer');

    app.route('/answer')
        .get(answer.getAnswers);

    app.route('/answer/:answerID')
        .get(answer.getAnswersByAnswerID)
        .put(answer.updateAnswer);

    app.route('/answer/vote/:answerID')
        .post(answer.voteAnswer);

    app.route('/answer/byLecture/:lectureID')
        .get(answer.getAnswersByLectureID);

    app.route('/answer/byQuestion/:questionID')
        .get(answer.getAnswersByQuestionID)
        .post(answer.addAnswer);


    /***
     * Routes for Mood
     */
    var mood = require('../controllers/Mood');

    app.route('/mood')
        .get(mood.getMood);

    app.route('/mood/byLecture/:lectureID')
        .get(mood.getMoodByLectureID)
        .post(mood.postMoodForLecture);

    app.route('/mood/byLecture/:lectureID/byStudent/:studentID')
        .get(mood.getMoodForStudentByLecture);


    /***
     * Routes for Lecture
     */
    var lecture = require('../controllers/Lecture');

    app.route('/lecture')
        .get(lecture.getLectures);



    /***
     * Routes for Student
     */
    var student = require('../controllers/Student');

    app.route('/student')
        .post(student.addStudent)
        .get(student.getStudents);

    app.route('/student/:student')
        .get(student.getStudentByStudentID);



    /***
     * Routes for Question
     */
    var question = require('../controllers/Question');

    app.route('/question')
        .get(question.getQuestions);

    app.route('/question/:questionID')
        .get(question.getQuestionsByQuestionID)
        .put(question.updateQuestion);

    app.route('/question/vote/:questionID')
        .post(question.voteQuestion);

    app.route('/question/byLecture/:lectureID')
        .get(question.getQuestionsByLectureID)
        .post(question.addQuestion);
};