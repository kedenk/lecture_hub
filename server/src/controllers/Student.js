'use strict';

var utils = require('../utils/writer.js');
var Student = require('../service/StudentService');
var HttpStatus = require('http-status-codes');
var logger = require('../utils/LogFactory').getLogger();

module.exports.addStudent = function addStudent (req, res, next) {

  var student = req.body;

  if ( student === undefined || student.username == undefined ||student.username === "") {

      var msg = 'The body contained wrong data. Username is empty or missing.';
      logger.error(msg)
      utils.writeJson(res, JSON.stringify(msg), HttpStatus.METHOD_NOT_ALLOWED);

  } else {

      Student.addStudent(student)
          .then(function (response) {
              utils.writeJson(res, response);
          })
          .catch(function (response) {
              logger.error(response);
              utils.writeJson(res, utils.getErrorJson(response), HttpStatus.METHOD_NOT_ALLOWED);
          });
  }
};

module.exports.getStudentByStudentID = function getStudentByStudentID (req, res, next) {

    var studentID = req.params.student;

    if ( studentID === undefined || !(!isNaN(parseFloat(studentID)) && isFinite(studentID)) ) {

        var msg = 'The given parameter studentID is not a number.';
        logger.error(msg);
        utils.writeJson(res, utils.getErrorJson(msg), HttpStatus.BAD_REQUEST);
    }


  Student.getStudentByStudentID(studentID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
    });
};

module.exports.getStudents = function getStudents (req, res, next) {
  Student.getStudents()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
    });
};
