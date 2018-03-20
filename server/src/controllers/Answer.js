'use strict';

var utils = require('../utils/writer.js');
var Answer = require('../service/AnswerService');
var Question = require('../service/QuestionService');
var logger = require('../utils/LogFactory').getLogger();
var HttpStatus = require('http-status-codes');
var Student = require('../service/StudentService');

var websocket = require('../websocket/sockets');
var OnNewAnswer = require('../models/onNewAnswer');
var OnAnswerVoteRatioChanged = require('../models/onAnswerVoteRatioChanged');
var OnAnswerTextChanged = require('../models/onAnswerTextChanged');

module.exports.addAnswer = function addAnswer (req, res, next) {
    var questionID = req.params.questionID;
    var body = req.body;

    if(questionID === undefined || body === undefined || body.textContent === undefined || body.studentID === undefined ) {
        utils.writeJson(res, utils.getErrorJson('Invalid input'), HttpStatus.METHOD_NOT_ALLOWED);
        return;
    }

    // check if student is valid
    Student.getStudentByStudentID( body.studentID )
        .then(function (response) {
            // student is valid

            Question.getQuestionsByQuestionID( questionID, body.studentID )
                .then(function (response) {

                    // question is available
                    // insert answer
                    Answer.addAnswer(questionID,body)
                        .then(function (response) {

                            // notify about new answer
                            websocket.onNewAnswer(new OnNewAnswer(response.answerID, response.answerTo, response.voteRatio, response.author, response.textContent));

                            utils.writeJson(res, response);
                        })
                        .catch(function (response) {
                            utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
                        });

                })
                .catch(function (response) {
                    utils.writeJson(res, utils.getErrorJson('Question not found'), HttpStatus.NOT_FOUND);
                });
        })
        .catch(function (response) {
            utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
        });
};

/***
 * Returns all answers
 * @param req
 * @param res
 * @param next
 */
module.exports.getAnswers = function getAnswers (req, res, next) {
  var studentID = req.query.studentID;

  if( studentID === undefined ) {
      writeError(res, 'Missing parameters', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {
          // student is valid

          Answer.getAnswers(studentID)
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, response);
              });
      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
      });
};


/***
 * Returns the answer for a given answerID
 * @param req
 * @param res
 * @param next
 */
module.exports.getAnswersByAnswerID = function getAnswersByAnswerID (req, res, next) {
  var answerID = req.params.answerID;
  var studentID = req.query.studentID;

  if(answerID === undefined || studentID === undefined ) {
      writeError(res, 'Missing parameters', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {
          // student is valid

          Answer.getAnswersByAnswerID(answerID, studentID)
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
              });
      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
      });
};

module.exports.getAnswersByLectureID = function getAnswersByLectureID (req, res, next) {
    var lectureID = req.params.lectureID;
    var studentID = req.query.studentID;

    if(lectureID === undefined || studentID === undefined ) {
        writeError(res, 'Missing parameters', HttpStatus.BAD_REQUEST);
        return;
    }

    // check if student is valid
    Student.getStudentByStudentID( studentID )
        .then(function (response) {
            // student is valid

            Answer.getAnswersByLectureID(lectureID,studentID)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, utils.getErrorJson('Answers not found'), HttpStatus.NOT_FOUND);
                });
        })
        .catch(function (response) {
            utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
        });
};


/***
 * Retruns the answers for a given questionID
 * @param req
 * @param res
 * @param next
 */
module.exports.getAnswersByQuestionID = function getAnswersByQuestionID (req, res, next) {
  var questionID = req.params.questionID;
  var studentID = req.query.studentID;

  if(questionID === undefined || studentID === undefined ) {
      writeError(res, 'Missing parameters', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {
          // student is valid

          Answer.getAnswersByQuestionID(questionID,studentID)
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
              });
      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
      });
};


/***
 * Updates an existing answer
 * @param req
 * @param res
 * @param next
 */
module.exports.updateAnswer = function updateAnswer (req, res, next) {
  var answerID = req.params.answerID;
  var body = req.body;

  if(answerID === undefined || body === undefined || body.textContent === undefined || body.studentID === undefined ) {
      utils.writeJson(res, utils.getErrorJson('Invalid input'), HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  Answer.getAnswersByAnswerID( answerID, body.studentID )
      .then(function (response) {

          // check if updater is author
          if( response.author.studentID !== body.studentID ) {
              utils.writeJson(res, utils.getErrorJson('studentID does not match author of answer'), HttpStatus.FORBIDDEN);
              return;
          }

          // update answer
          Answer.updateAnswer( answerID, body )
              .then(function (response) {

                  // publish updated answer
                  websocket.onAnswerTextChanged( new OnAnswerTextChanged( answerID, response.textContent ));

                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
              });
      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
      });
};

module.exports.voteAnswer = function voteAnswer (req, res, next) {
  var answerID = req.params.answerID;
  var body = req.body;

    if(answerID === undefined || body === undefined || body.vote === undefined || body.studentID === undefined ) {
        utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);
        return;
    }

    // check if vote is correct
    if( isNaN(body.vote) || (body.vote !== -1 && body.vote !== 1) ) {
        utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);
        return;
    }

    // check if studentID is valid
    Student.getStudentByStudentID( body.studentID )
        .then(function (response) {
            // student is valid

            Answer.getAnswersByAnswerID( answerID, body.studentID )
                .then(function (response) {

                    // Answer for vote is available
                    Answer.getVote( answerID, body.studentID )
                        .then(function (response) {

                            // user already voted
                            utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);
                        })
                        .catch(function(response) {

                            // user has not voted. is allowed to vote
                            Answer.voteAnswer( answerID, body )
                                .then(function (response) {

                                    // publish vote
                                    websocket.onAnswerVoteRatioChanged( new OnAnswerVoteRatioChanged( answerID, response.voteRatio ) );

                                    utils.writeJson(res, response);
                                })
                                .catch(function (response) {
                                    utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
                                });
                        });

                })
                .catch(function (response) {

                    utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
                });
        })
        .catch(function (response) {

            // no student found. user not authorized
            utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
        });
};


function writeError( res, msg, httpStatus ) {
    logger.error(msg);
    utils.writeJson(res, utils.getErrorJson(msg), httpStatus);
}