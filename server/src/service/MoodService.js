'use strict';

var utils = require('../utils/writer.js');
var dbPool = require('../db/DbManager');
var logger = require('../utils/LogFactory').getLogger();
var Mood = require('../models/mood');

const tableName = 'mood_for_student_lecture';
const getAllQuery = [ 'SELECT t.lectureid,',
    'CAST(COALESCE(COUNT(CASE WHEN mood = 1 THEN 1 END), 0) AS int) AS positive,',
    'CAST(COALESCE(COUNT(CASE WHEN mood = -1 THEN -1 END), 0) AS int) AS negative,',
    'CAST(COALESCE(COUNT(CASE WHEN mood = 0 THEN 0 END), 0) AS int) AS neutral',
    'from', tableName, 't',
    'WHERE t.lectureid = $1',
    'GROUP BY t.lectureid' ].join(' ');


/**
 * Returns the moods over all lectures
 *
 * returns List
 **/
exports.getMood = function() {
  return new Promise(function(resolve, reject) {

      const query = [ 'SELECT t.lectureid,',
        'CAST(COALESCE(COUNT(CASE WHEN mood = 1 THEN 1 END), 0) AS int) AS positive,',
        'CAST(COALESCE(COUNT(CASE WHEN mood = -1 THEN -1 END), 0) AS int) AS negative,',
        'CAST(COALESCE(COUNT(CASE WHEN mood = 0 THEN 0 END), 0) AS int) AS neutral',
        'from', tableName, 't',
        'GROUP BY t.lectureid ORDER BY 1'].join(' ');

      const pool = dbPool.getDbPool();
      logger.info('[DB] ' + query);

      pool.query(query,
          (err, searchResult) => {
              if( err ) {

                  logger.error(err.stack);
                  reject(err);

              } else {

                  resolve( buildMoodList( searchResult ));
              }
          });
  });
}


/**
 * Returns the moods for a lecture
 *
 * lectureID Long lectureID of corresponding lecture
 * returns Mood
 **/
exports.getMoodByLectureID = function(lectureID) {
  return new Promise(function(resolve, reject) {

      const pool = dbPool.getDbPool();
      logger.info('[DB] ' + getAllQuery);

      pool.query(getAllQuery, [ lectureID ],
          (err, searchResult) => {
              if( err ) {

                  logger.error(err.stack);
                  reject(err);

              } else {

                  if ( searchResult.rowCount === 0 ) {
                      reject('Lecture not found');
                  } else {
                      resolve( buildMoodObject( searchResult.rows[0] ));
                  }
              }
          });
  });
}


/**
 * Get student's mood for a lecture
 * Return a student's current mood for a lecture. If there is no mood set, the neutral one is returned
 *
 * lectureID Long lectureID of corresponding lecture
 * studentID Long studentID of the corresponding student
 * returns inline_response_200
 **/
exports.getMoodForStudentByLecture = function(lectureID,studentID) {
  return new Promise(function(resolve, reject) {


      dbPool.selectByKey( tableName, 'lectureid', lectureID)
          .then( res => {
              if ( res.rowCount === 0 ) {
                  reject('Lecture not found');
              } else {

                  const query = [ 'SELECT * FROM', tableName, 'WHERE lectureid =', lectureID, 'AND studentid = ', studentID ].join(' ');
                  const pool = dbPool.getDbPool();
                  logger.info('[DB] ' + query);

                  pool.query(query,
                      (err, searchResult) => {
                          if( err ) {

                              logger.error(err.stack);
                              reject(err);

                          } else {

                              var mood = 0;
                              if ( searchResult.rowCount > 0 ) {
                                  mood = searchResult.rows[0].mood;
                              }

                              resolve( [ '{ "mood" :', mood, '}' ].join(' ') );
                          }
                      });
              }
          })
          .catch(err => {
              reject(err);
          });
  });
}


/**
 * Update/Post an existing student's mood for a given lecture
 *
 * lectureID Long lectureID of corresponding lecture
 * body Body The new mood for the lecture and the studentID 
 * returns Mood
 **/
exports.postMoodForLecture = function(lectureID,body) {
  return new Promise(function(resolve, reject) {

      // check if studentid is valid
      dbPool.selectByKey( 'student', 'studentid', body.studentID)
          .then( res => {
              if ( res.rowCount === 0 ) {
                  reject('Invalid studentID');
              } else {

                  // insert or update new mood
                  const query = [ 'INSERT INTO', tableName, '(studentid, lectureid, mood)',
                    'VALUES ($1, $2, $3)',
                    'ON CONFLICT (studentid, lectureid) DO UPDATE SET mood = $3',
                    'RETURNING studentid, lectureid'].join(' ');

                  const pool = dbPool.getDbPool();
                  logger.info('[DB] ' + query);

                  pool.query(query, [ body.studentID, lectureID, body.mood ],
                      (err, searchResult) => {
                          if( err ) {

                              logger.error(err.stack);
                              reject(err);

                          } else {

                              pool.query(getAllQuery, [ lectureID ],
                                  (error, result) => {
                                    if( error ) { reject(error); }
                                    else {


                                        resolve(buildMoodList( searchResult ));
                                    }
                                  });
                          }
                      });
              }
          })
          .catch(err => {
              reject(err);
          });
  });
}


exports.checkLectureId = function(lectureID) {
    return new Promise(function(resolve, reject) {

        dbPool.selectByKey('lecture', 'lectureid', lectureID)
            .then( res => {
                console.log(res);
                if( res.rowCount === 0 ) {
                    reject('Lecture not found');
                }
                resolve();
            })
            .catch(err => reject(err) );
    });
}


/***
 * Builds the Answer Object with the given row
 * @param row
 * @returns {*}
 */
function buildMoodObject( row ) {

    return new Mood( row.lectureid, row.positive, row.negative, row.neutral );
}


function buildMoodList( searchResult ) {

    var result = [];
    for( var i = 0; i < searchResult.rowCount; i++ ) {
        result.push( buildMoodObject( searchResult.rows[i] ));
    }

    return result;
}