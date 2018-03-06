'use strict';

var utils = require('../utils/writer.js');
var Question = require('../service/QuestionService');
var HttpStatus = require('http-status-codes');
var logger = require('../utils/LogFactory').getLogger();

module.exports.addQuestion = function addQuestion (req, res, next) {
  var lectureID = req.params['lectureID'].value;
  var body = req.swagger.params['body'].value;
  Question.addQuestion(lectureID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getQuestions = function getQuestions (req, res, next) {
  var studentID = req.params.studentID;

  Question.getQuestions(studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getQuestionsByLectureID = function getQuestionsByLectureID (req, res, next) {
  var lectureID = req.params.lectureID;
  var studentID = req.query.studentID;

  if( lectureID === undefined || studentID === undefined ) {
      var msg = 'Invalid parameters or query';
      logger.error(msg)
      utils.writeJson(res, JSON.stringify(msg), HttpStatus.BAD_REQUEST);
  }

  Question.getQuestionsByLectureID(lectureID,studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
        utils.writeJson(res, utils.getErrorJson(response), HttpStatus.BAD_REQUEST);
    });
};

module.exports.getQuestionsByQuestionID = function getQuestionsByQuestionID (req, res, next) {
  var questionID = req.swagger.params['questionID'].value;
  var studentID = req.swagger.params['studentID'].value;
  Question.getQuestionsByQuestionID(questionID,studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateQuestion = function updateQuestion (req, res, next) {
  var questionID = req.swagger.params['questionID'].value;
  var body = req.swagger.params['body'].value;
  Question.updateQuestion(questionID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.voteQuestion = function voteQuestion (req, res, next) {
  var questionID = req.swagger.params['questionID'].value;
  var body = req.swagger.params['body'].value;
  Question.voteQuestion(questionID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
