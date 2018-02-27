'use strict';

var utils = require('../utils/writer.js');
var Answer = require('../service/AnswerService');

module.exports.addAnswer = function addAnswer (req, res, next) {
  var questionID = req.swagger.params['questionID'].value;
  var body = req.swagger.params['body'].value;
  Answer.addAnswer(questionID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAnswers = function getAnswers (req, res, next) {
  var studentID = req.swagger.params['studentID'].value;
  Answer.getAnswers(studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAnswersByAnswerID = function getAnswersByAnswerID (req, res, next) {
  var answerID = req.swagger.params['answerID'].value;
  var studentID = req.swagger.params['studentID'].value;
  Answer.getAnswersByAnswerID(answerID,studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAnswersByLectureID = function getAnswersByLectureID (req, res, next) {
  var lectureID = req.swagger.params['lectureID'].value;
  var studentID = req.swagger.params['studentID'].value;
  Answer.getAnswersByLectureID(lectureID,studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAnswersByQuestionID = function getAnswersByQuestionID (req, res, next) {
  var questionID = req.swagger.params['questionID'].value;
  var studentID = req.swagger.params['studentID'].value;
  Answer.getAnswersByQuestionID(questionID,studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateAnswer = function updateAnswer (req, res, next) {
  var answerID = req.swagger.params['answerID'].value;
  var body = req.swagger.params['body'].value;
  Answer.updateAnswer(answerID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.voteAnswer = function voteAnswer (req, res, next) {
  var answerID = req.swagger.params['answerID'].value;
  var body = req.swagger.params['body'].value;
  Answer.voteAnswer(answerID,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
