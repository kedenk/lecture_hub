'use strict';

var utils = require('../utils/writer.js');
var Question = require('../service/QuestionService');
var Student = require('../service/StudentService');
var Lecture = require('../service/LectureService');
var HttpStatus = require('http-status-codes');
var logger = require('../utils/LogFactory').getLogger();

module.exports.addQuestion = function addQuestion (req, res, next) {
  var lectureID = req.params.lectureID;
  var newQuestion = req.body;

  if( lectureID === undefined || newQuestion === undefined ) {
      writeError( res, 'Invalid or missing parameters', HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  if( newQuestion.textContent === undefined || newQuestion.studentID === undefined ) {
      writeError( res, 'Invalid input', HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  // check if lecture is valid
  Lecture.getLecture( lectureID )
      .then(function(response) {

          // check if student is valid
          Student.getStudentByStudentID(newQuestion.studentID)
              .then(function(response) {


                  // store actual question
                  Question.addQuestion(lectureID,newQuestion)
                      .then(function (response) {
                          utils.writeJson(res, response);
                      })
                      .catch(function (response) {
                          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
                      });

              })
              .catch(function(response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
              });
      })
      .catch(function(response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
      });
};


/***
 * Returns all questions
 * @param req
 * @param res
 * @param next
 */
module.exports.getQuestions = function getQuestions (req, res, next) {
  var studentID = req.query.studentID;

  if( studentID === undefined ) {
      writeError(res, 'Missing parameters', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {

          Question.getQuestions(studentID)
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
              });

      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN);
      });
};


/***
 * Returns all questions for a given lectureID
 * @param req
 * @param res
 * @param next
 */
module.exports.getQuestionsByLectureID = function getQuestionsByLectureID (req, res, next) {
  var lectureID = req.params.lectureID;
  var studentID = req.query.studentID;

  if( lectureID === undefined || studentID === undefined ) {
      writeError(res, 'Missing parameters or query', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {

          // valid student
          Lecture.getLecture( lectureID )
              .then(function (response) {

                  // valid lacture
                  Question.getQuestionsByLectureID( lectureID, studentID )
                      .then(function (response) {

                          utils.writeJson(res, response);

                      })
                      .catch(function (response) {
                          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
                      });

              })
              .catch(function (response) {
                 // lecture not found
                  utils.writeJson(res, utils.getErrorJson('Lecture not found'), HttpStatus.NOT_FOUND);
              });
      })
      .catch(function (response) {
          // invalid user
          utils.writeJson(res, utils.getErrorJson('Invalid studentID'), HttpStatus.FORBIDDEN);
      });
};


/***
 * Returns all questions for a given QuestiondId
 * @param req
 * @param res
 * @param next
 */
module.exports.getQuestionsByQuestionID = function getQuestionsByQuestionID (req, res, next) {
  var questionID = req.params.questionID;
  var studentID = req.query.studentID;

  if( questionID === undefined || studentID === undefined ) {
      writeError(res, 'Missing parameters or query', HttpStatus.BAD_REQUEST);
      return;
  }

  Student.getStudentByStudentID( studentID )
      .then(function (response) {

          Question.getQuestionsByQuestionID(questionID,studentID)
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
              });

      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson('Invalid studentID'), HttpStatus.FORBIDDEN);
      });
};


/***
 * Updates a question with the given body
 * @param req
 * @param res
 * @param next
 */
module.exports.updateQuestion = function updateQuestion (req, res, next) {
  var questionID = req.params.questionID;
  var question = req.body;

  // check if data is valid and available
  if(questionID === undefined || question === undefined || question.studentID === undefined || question.textContent === undefined ) {
      utils.writeJson(res, utils.getErrorJson('Invalid input'), HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  // check if question is available
  Question.getQuestionsByQuestionID( questionID, question.studentID )
      .then(function (response) {

          // check if updater ist author
          if( response.author.studentID !== question.studentID ) {
              utils.writeJson(res, utils.getErrorJson('studentID does not match author of question'), HttpStatus.FORBIDDEN);
              return;
          }

          // update question
          Question.updateQuestion( questionID, question )
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
              });
      })
      .catch(function (response) {
          utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
          return;
      });
};


/***
 * Sets a vote for a question
 * @param req
 * @param res
 * @param next
 */
module.exports.voteQuestion = function voteQuestion (req, res, next) {
  var questionID = req.params.questionID;
  var body = req.body;

  // check if request has valid data
  if( questionID === undefined || body === undefined || body.vote === undefined || body.studentID === undefined ) {
      utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  // check if vote is correct
  if( isNaN(body.vote) || (body.vote !== -1 && body.vote !== 1) ) {
      utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);
      return;
  }

  // check if student is available
    Student.getStudentByStudentID( body.studentID )
        .then(function (response) {

            // check if student has already voted
            Question.getVote( questionID, body.studentID )
                .then(function(response) {

                    // if a vote for that question from that user is found, user is not allowed to vote again
                    utils.writeJson(res, utils.getErrorJson('Invalid input/Already voted'), HttpStatus.METHOD_NOT_ALLOWED);

                })
                .catch(function (response) {

                    // if no vote is found user is allowed to vote
                    Question.voteQuestion( questionID, body )
                        .then(function (response) {
                            utils.writeJson(res, response);
                        })
                        .catch(function (response) {
                            utils.writeJson(res, utils.getErrorJson('Question not found'), HttpStatus.NOT_FOUND);
                        });
                });



        })
        .catch(function (response) {
            utils.writeJson(res, utils.getErrorJson('Invalid studentID'), HttpStatus.FORBIDDEN);
        });
};


function writeError( res, msg, httpStatus ) {
    logger.error(msg)
    utils.writeJson(res, JSON.stringify(msg), httpStatus);
}