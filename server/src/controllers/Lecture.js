'use strict';

var utils = require('../utils/writer.js');
var Lecture = require('../service/LectureService');
var HttpStatus = require('http-status-codes');
var logger = require('../utils/LogFactory').getLogger();

module.exports.getLectures = function getLectures (req, res, next) {
  Lecture.getLectures()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, utils.getErrorJson(response), HttpStatus.INTERNAL_SERVER_ERROR);
    });
};
