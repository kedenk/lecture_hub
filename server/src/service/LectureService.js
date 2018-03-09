'use strict';

var dbPool = require('../db/DbManager');
var Lecture = require('../models/lecture');

var tableName = 'lecture';

/**
 * Returns all lectures in the system
 *
 * returns List
 **/
exports.getLectures = function() {
  return new Promise(function(resolve, reject) {

      dbPool.selectAll('lecture')
          .then( res => {

              var result = [];
              for( var i = 0; i < res.rowCount; i++) {
                  var row = res.rows[i];
                  var tmp = new Lecture(row.lectureid, row.lecturename, row.lecturedescription);
                  result.push(tmp);
              }

              resolve(result);
          })
          .catch(err => reject(err) );
  });
};

/**
 * Returns the lecture with the give lectureID
 * @param lectureID
 * @returns {Promise}
 */
exports.getLecture = function(lectureID) {
    return new Promise(function(resolve, reject) {

        dbPool.selectByKey(tableName, 'lectureid', lectureID)
            .then( res => {

                if( res.rowCount > 0 ) {
                    var row = res.rows[0];
                    var lecture = new Lecture(row.lectureid, row.lecturename, row.lecturedescription);
                    resolve(lecture);
                } else {
                    reject('Lecture not found');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}
