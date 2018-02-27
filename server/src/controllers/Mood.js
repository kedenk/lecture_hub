'use strict';

var utils = require('../utils/writer.js');
var Mood = require('../service/MoodService');
var HttpStatus = require('http-status-codes');
var logger = require('../utils/LogFactory').getLogger();

module.exports.getMood = function getMood (req, res, next) {
  Mood.getMood()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      logger.error(response);
      utils.writeJson(res, utils.getErrorJson(response), HttpStatus.BAD_REQUEST);
    });
};

module.exports.getMoodByLectureID = function getMoodByLectureID (req, res, next) {

  var lectureID = req.params.lectureID;

  checkNumberParam(lectureID, 'The given parameter lectureID is not a number or not present.', HttpStatus.BAD_REQUEST, res);

  Mood.getMoodByLectureID(lectureID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
    });
};

module.exports.getMoodForStudentByLecture = function getMoodForStudentByLecture (req, res, next) {
  var lectureID = req.params.lectureID;
  var studentID = req.params.studentID;

    checkNumberParam(studentID, 'The given parameter studentID is not a number or not present.', HttpStatus.FORBIDDEN, res);
    checkNumberParam(lectureID, 'The given parameter lectureID is not a number or not present.', HttpStatus.BAD_REQUEST, res);

    // check if lecture id is valid
    Mood.checkLectureId( lectureID )
        .then(function() {

            // do actual stuff
            Mood.getMoodForStudentByLecture(lectureID,studentID)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
                });
        })
        .catch(function (response) {
            utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
        });




};

module.exports.postMoodForLecture = function postMoodForLecture (req, res, next) {

    var lectureID = req.params.lectureID;
    var body = req.body;

    checkNumberParam(lectureID, 'The given parameter lectureID is not a number or not present.', HttpStatus.BAD_REQUEST, res);

    if ( body === undefined ||
        body.mood === undefined ||
        !(!isNaN(parseFloat(body.mood)) && isFinite(body.mood))  ||
        body.studentID === undefined ||
        !(!isNaN(parseFloat(body.studentID)) && isFinite(body.studentID)) ) {
        utils.writeJson(res, utils.getErrorJson('Body of request is invalid.'), HttpStatus.BAD_REQUEST);
    }

    Mood.checkLectureId( lectureID )
        .then(function() {
            Mood.postMoodForLecture(lectureID,body)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, utils.getErrorJson(response), HttpStatus.FORBIDDEN );
                });
        })
        .catch(function (response) {
                utils.writeJson(res, utils.getErrorJson(response), HttpStatus.NOT_FOUND);
          });


};

function checkNumberParam(param, msg, httpStatusCode, res) {

    if ( param === undefined || !(!isNaN(parseFloat(param)) && isFinite(param)) ) {

        logger.error(msg);
        utils.writeJson(res, utils.getErrorJson(msg), httpStatusCode);
    }
}
