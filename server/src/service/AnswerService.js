'use strict';

var dbPool = require('../db/DbManager');
var Student = require('../models/student');
var Answer = require('../models/answer');

var logger = require('../utils/LogFactory').getLogger();

var tableName = 'answer'

/**
 * Add a new answer for a given question
 * 
 *
 * questionID Long questionID of the question in which the answer should be posted
 * body Body_6 The textContent of the new answer and the author (studentID) of the answer
 * returns Answer
 **/
exports.addAnswer = function(questionID,body) {
  return new Promise(function(resolve, reject) {

      const query = [ 'INSERT INTO', tableName, '(author, answerto, textcontent) VALUES ($1, $2, $3) RETURNING answerid'].join(' ');
      const pool = dbPool.getDbPool();
      console.log('[DB] ' + query);

      pool.query(query, [ body.studentID, questionID, body.textContent ],
          (err, cursor) => {
              if( err ) {

                  reject(err);

              } else {

                  if( cursor.rowCount > 0 ) {
                      var row = cursor.rows[0];
                      doGetAnswerByAnswerID( row.answerid, body.studentID)
                          .then(function (response) {
                              resolve(response);
                          })
                          .catch(function (response) {
                              reject('Cant fetch new created answer');
                          });
                  } else {
                      reject('Add new answer failed');
                  }
              }
          });
  });
}


/**
 * Returns all answers in the system
 *
 * studentID Long studentID of the student that requests the answers
 * returns List
 **/
exports.getAnswers = function(studentID) {
  return new Promise(function(resolve, reject) {

      const query = [ 'SELECT a.*, s.*,',
          'SUM(vfa.direction) as voteratio,',
          '(SELECT va.direction FROM vote_for_answer va WHERE va.votedby =', studentID, 'AND va.votefor = a.answerid) as studentvote',
          'FROM', tableName, 'a',
          'LEFT JOIN vote_for_answer vfa ON a.answerid = vfa.votefor',
          'LEFT JOIN student s ON a.author = s.studentid',
          'GROUP BY a.answerid, s.studentid'].join(' ');

      const pool = dbPool.getDbPool();
      console.log('[DB] ' + query);

      pool.query(query,
          (err, cursor) => {
              if( err ) {

                  reject(err);

              } else {

                  var result = [];
                  for( var i = 0; i < cursor.rowCount; i++ ) {

                      var row = cursor.rows[i];

                      var question = buildAnswerObject( row );
                      result.push(question);
                  }

                  resolve(result);
              }
          });
  });
}


/**
 * Find answer by answerID
 * Returns answer for a answerID
 *
 * answerID Long answerID of corresponding answer
 * studentID Long studentID of the student that requests the answers
 * returns Answer
 **/
exports.getAnswersByAnswerID = function(answerID,studentID) {
      return doGetAnswerByAnswerID(answerID, studentID);
}


/**
 * Find answers by lectureID
 * Returns all answers for a lecture
 *
 * lectureID Long lectureID of corresponding lecture
 * studentID Long studentID of the student that requests the answers
 * returns List
 **/
exports.getAnswersByLectureID = function(lectureID,studentID) {
  return new Promise(function(resolve, reject) {

      const query = [ 'SELECT a.*, s.*,',
          'SUM(vfa.direction) as voteratio,',
          '(SELECT va.direction FROM vote_for_answer va WHERE va.votedby =', studentID, 'AND va.votefor = a.answerid) as studentvote',
          'FROM', tableName, 'a',
          'LEFT JOIN vote_for_answer vfa ON a.answerid = vfa.votefor',
          'LEFT JOIN student s ON a.author = s.studentid',
          'LEFT JOIN question q ON a.answerto = q.questionid',
          'WHERE q.lecture =', lectureID,
          'GROUP BY a.answerid, s.studentid, q.questionid'].join(' ');

      const pool = dbPool.getDbPool();
      console.log('[DB] ' + query);

      pool.query(query,
          (err, cursor) => {
              if( err ) {

                  reject(err);

              } else {

                  if( cursor.rowCount === 0 ) {

                      reject('Answers not found');
                  }

                  var result = [];
                  for( var i = 0; i < cursor.rowCount; i++ ) {
                      result.push( buildAnswerObject( cursor.rows[i] ));
                  }
                  resolve(result);
              }
          });

  });
}


/**
 * Find answers by questionID
 * Returns all answers for a question
 *
 * questionID Long questionID of corresponding question
 * studentID Long studentID of the student that requests the answers
 * returns List
 **/
exports.getAnswersByQuestionID = function(questionID,studentID) {
  return new Promise(function(resolve, reject) {

      const query = [ 'SELECT a.*, s.*,',
          'SUM(vfa.direction) as voteratio,',
          '(SELECT va.direction FROM vote_for_answer va WHERE va.votedby =', studentID, 'AND va.votefor = a.answerid) as studentvote',
          'FROM', tableName, 'a',
          'LEFT JOIN vote_for_answer vfa ON a.answerid = vfa.votefor',
          'LEFT JOIN student s ON a.author = s.studentid',
          'WHERE a.answerto =', questionID,
          'GROUP BY a.answerid, s.studentid'].join(' ');

      const pool = dbPool.getDbPool();
      console.log('[DB] ' + query);

      pool.query(query,
          (err, cursor) => {
              if( err ) {

                  reject(err);

              } else {

                  if( cursor.rowCount === 0 ) {

                      reject('Answer not found');
                  }

                  var result = [];
                  for( var i = 0; i < cursor.rowCount; i++ ) {
                      result.push( buildAnswerObject( cursor.rows[i] ));
                  }
                  resolve(result);
              }
          });
  });
}


/**
 * Update an answer
 * 
 *
 * answerID Long answerID of corresponding answer
 * body Body_4 The new textContent of the answer and the studentID to check if it matches the author of the answer
 * returns Answer
 **/
exports.updateAnswer = function(answerID,body) {
  return new Promise(function(resolve, reject) {

      const query = [ 'UPDATE', tableName, 'SET textcontent = $2 WHERE answerid = $1 AND author = $3'].join(' ');
      const pool = dbPool.getDbPool();
      logger.debug('[DB] ' + query);

      pool.query(query, [ answerID, body.textContent, body.studentID ],
          (err, cursor) => {

              if( err ) {
                  reject(err);
              } else {

                  resolve( doGetAnswerByAnswerID( answerID, body.studentID ) );
              }
          });
  });
}


/**
 * Vote for an answer. NOTE that voting is only possible once per user and question/answer!
 * 
 *
 * answerID Long answerID of corresponding answer
 * body Body_5 The vote (-1 or 1) for a . NOTE that voting is only possible once per user and question/answer!
 * returns Answer
 **/
exports.voteAnswer = function(answerID,body) {
  return new Promise(function(resolve, reject) {

      const query = [ 'INSERT INTO', 'vote_for_answer', '(votefor, votedby, direction) VALUES ($1, $2, $3)'].join(' ');
      logger.debug('[DB] ' + query);
      dbPool.getDbPool().query(query, [ answerID, body.studentID, body.vote],
          (err, cursor) => {
              if(err) { reject(err); } else {

                  if(cursor.rowCount > 0) {

                      doGetAnswerByAnswerID( answerID, body.studentID )
                          .then(function (response) {
                              resolve(response);
                          })
                          .catch(function (response) {
                              reject(response);
                          });
                  } else {
                      reject('Unexpected error occured during insert statement.');
                  }
              }
          });
  });
}


/***
 * Builds the Answer Object with the given row
 * @param row
 * @returns {*}
 */
function buildAnswerObject( row ) {

    if(row.voteratio === null) {
        row.voteratio = 0;
    }

    if(row.studentvote === null) {
        row.studentvote = 0;
    }

    var author = new Student(row.studentid, row.username);
    var answer = new Answer(row.answerid, author, row.answerto, row.textcontent, row.voteratio, row.studentvote);

    return answer;
}


/***
 * Returns the vote of a student for a answer
 * @param questionID
 * @param studentID
 * @returns {Promise}
 */
exports.getVote = function( answerID, studentID ) {
    return new Promise(function(resolve, reject) {

        const query = [ 'SELECT * FROM', 'vote_for_answer', 'WHERE votefor = $1 AND votedby = $2'].join(' ');
        logger.debug('[DB] ' + query);
        dbPool.getDbPool().query(query, [ answerID, studentID],
            (err, cursor) => {
                if(err) { reject(err); } else {

                    if(cursor.rowCount > 0) {
                        resolve(cursor.rows);
                    } else {
                        reject('No vote found');
                    }
                }
            });
    });
}


function doGetAnswerByAnswerID(answerID, studentID) {
    return new Promise(function(resolve, reject) {

        const query = [ 'SELECT a.*, s.*,',
            'SUM(vfa.direction) as voteratio,',
            '(SELECT va.direction FROM vote_for_answer va WHERE va.votedby =', studentID, 'AND va.votefor = a.answerid) as studentvote',
            'FROM', tableName, 'a',
            'LEFT JOIN vote_for_answer vfa ON a.answerid = vfa.votefor',
            'LEFT JOIN student s ON a.author = s.studentid',
            'WHERE a.answerid =', answerID,
            'GROUP BY a.answerid, s.studentid'].join(' ');

        const pool = dbPool.getDbPool();
        console.log('[DB] ' + query);

        pool.query(query,
            (err, cursor) => {
                if( err ) {

                    reject(err);

                } else {

                    if( cursor.rowCount === 0 ) {

                        reject('Answer not found');
                        return;
                    }

                    resolve(buildAnswerObject( cursor.rows[0] ));
                }
            });
    });
}