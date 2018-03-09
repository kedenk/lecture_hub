'use strict';

var dbPool = require('../db/DbManager');
var logger = require('../utils/LogFactory').getLogger();

var Student = require('../models/student');
var Lecture = require('../models/lecture');
var Question = require('../models/question');

var tableName = 'question';


/**
 * Add a new question in a given lecture
 * 
 *
 * lectureID Long lectureID of the lecture in which the question should be posted
 * body Body_3 The textContent of the new question and the author (studentID) of the question
 * returns Question
 **/
exports.addQuestion = function(lectureID,body) {
  return new Promise(function(resolve, reject) {

  const query = [ 'INSERT INTO', tableName,
                    '(lecture, author, textcontent) VALUES',
                    '( $1, $2, $3 )',
                    'RETURNING questionid'].join(' ');

  const pool = dbPool.getDbPool();
  logger.debug('[DB] ' + query);

  pool.query(query, [ lectureID, body.studentID, body.textContent ],
      (err, cursor) => {
          if(err) {
              reject(err);
          }

          // successfully added
          if( cursor.rowCount > 0 ) {

              var row = cursor.rows[0];
              doGetQuestionByQuestionID(row.questionid, body.studentID)
                  .then(function(response) {

                      resolve(response);

                  })
                  .catch(function(response) {
                      console.error(response);
                      reject('Cant fetch new created question');
                  });

          } else {
              reject('Add question failed');
          }
      });
  });
}


/**
 * Returns all questions in the system
 *
 * studentID Long studentID of the student that requests the questions
 * returns List
 **/
exports.getQuestions = function(studentID) {
  return new Promise(function(resolve, reject) {

    const query = [ 'SELECT q.*, s.*, l.*,',
      'SUM(vfq.direction) as voteratio,',
      '(SELECT vq.direction FROM vote_for_question vq WHERE vq.votedby =', studentID, 'AND vq.votefor = q.questionid) as studentVote',
      'FROM', tableName, 'q',
      'LEFT JOIN vote_for_question vfq ON q.questionid = vfq.votefor',
      'LEFT JOIN student s ON q.author = s.studentid',
      'LEFT JOIN lecture l ON q.lecture = l.lectureid',
      'GROUP BY q.questionid, s.studentid, l.lectureid'].join(' ');

    const pool = dbPool.getDbPool();
    logger.debug('[DB] ' + query);

    pool.query(query,
        (err, cursor) => {
            if( err ) {
                console.log("error");
                console.log(err);
                reject(err);

            } else {
                console.log(cursor.rows);
                var result = [];
                for( var i = 0; i < cursor.rowCount; i++ ) {

                    var row = cursor.rows[i];

                    var question = buildQuestionObject( row );
                    result.push(question);
                }

                resolve(result);
            }
      });

  });
}

/**
 * Find questions by lectureID
 * Returns all questions for a lecture
 *
 * lectureID Long lectureID of corresponding lecture
 * studentID Long studentID of the student that requests the questions
 * returns List
 **/
exports.getQuestionsByLectureID = function (lectureID,studentID) {
    return new Promise(function(resolve, reject) {

        const query = [ 'SELECT q.*, s.*, l.*,',
            'SUM(vfq.direction) as voteRatio,',
            '(SELECT vq.direction FROM vote_for_question vq WHERE vq.votedby =', studentID, 'AND vq.votefor = q.questionid) as studentVote',
            'FROM', tableName, 'q',
            'LEFT JOIN vote_for_question vfq ON q.questionid = vfq.votefor',
            'LEFT JOIN student s ON q.author = s.studentid',
            'LEFT JOIN lecture l ON q.lecture = l.lectureid',
            'WHERE q.lecture =', lectureID,
            'GROUP BY q.questionid, s.studentid, l.lectureid'].join(' ');

        const pool = dbPool.getDbPool();
        logger.debug('[DB] ' + query);

        pool.query(query,
            (err, cursor) => {
                if( err ) {

                    reject(err);

                } else {

                    var result = [];
                    for( var i = 0; i < cursor.rowCount; i++ ) {

                        var row = cursor.rows[i];
                        var question = buildQuestionObject( row );
                        result.push(question);
                    }

                    resolve(result);
                }
            });
    });
}


/**
 * Find question by questionID
 * Returns question for a questionID
 *
 * questionID Long questionID of corresponding question
 * studentID Long studentID of the student that requests the questions
 * returns Question
 **/
exports.getQuestionsByQuestionID = function(questionID,studentID) {
  return doGetQuestionByQuestionID(questionID, studentID);
};

function doGetQuestionByQuestionID(questionID, studentID) {
    return new Promise(function(resolve, reject) {

        const query = [ 'SELECT q.*, s.*, l.*,',
            'SUM(vfq.direction) as voteRatio,',
            '(SELECT vq.direction FROM vote_for_question vq WHERE vq.votedby =', studentID, 'AND vq.votefor = q.questionid) as studentVote',
            'FROM', tableName, 'q',
            'LEFT JOIN vote_for_question vfq ON q.questionid = vfq.votefor',
            'LEFT JOIN student s ON q.author = s.studentid',
            'LEFT JOIN lecture l ON q.lecture = l.lectureid',
            'WHERE q.questionid = $1',
            'GROUP BY q.questionid, s.studentid, l.lectureid'].join(' ');

        const pool = dbPool.getDbPool();
        logger.debug('[DB] ' + query);

        pool.query(query, [ questionID ],
            (err, cursor) => {
                if( err ) {

                    reject(err);

                } else {

                    if(cursor.rowCount > 0) {
                        resolve( buildQuestionObject(cursor.rows[0]) );
                    } else {
                        reject('Question not found');
                    }
                }
            });
    });
}


/**
 * Update a question
 * 
 *
 * questionID Long questionID of corresponding question
 * body Body_1 The new textContent of the question and the studentID to check if it matches the author of the question
 * returns Question
 **/
exports.updateQuestion = function(questionID, body) {
  return new Promise(function(resolve, reject) {

      doGetQuestionByQuestionID( questionID, body.studentID )
          .then(function(resp) {

          })

    const query = [ 'UPDATE', tableName, 'SET textcontent = $2 WHERE questionid = $1'].join(' ');
    const pool = dbPool.getDbPool();
    logger.debug('[DB] ' + query);

    pool.query(query, [ questionID, body.textContent ],
        (err, cursor) => {

            if( err ) {
                reject(err);
            } else {

                resolve( doGetQuestionByQuestionID( questionID, body.studentID ) );
            }
        });

  });
}


/**
 * Vote for a question. NOTE that voting is only possible once per user and question/answer!
 * 
 *
 * questionID Long questionID of corresponding question
 * body Body_2 The vote (-1 or 1) for a . NOTE that voting is only possible once per user and question/answer!
 * returns Question
 **/
exports.voteQuestion = function(questionID,body) {
  return new Promise(function(resolve, reject) {

      const query = [ 'INSERT INTO', 'vote_for_question', '(votefor, votedby, direction) VALUES ($1, $2, $3)' ].join(' ');
      const pool = dbPool.getDbPool();
      logger.debug('[DB] ' + query);

      pool.query(query, [ questionID, body.studentID, body.vote ],
          (err, cursor) => {

              if( err ) {
                  reject(err);
              } else {

                  resolve( doGetQuestionByQuestionID( questionID, body.studentID ) );
              }
          });

  });
}


/***
 * Returns the vote of a student for a question
 * @param questionID
 * @param studentID
 * @returns {Promise}
 */
exports.getVote = function( questionID, studentID ) {
    return new Promise(function(resolve, reject) {

        const query = [ 'SELECT * FROM', 'vote_for_question', 'WHERE votefor = $1 AND votedby = $2'].join(' ');
        logger.debug('[DB] ' + query);
        dbPool.getDbPool().query(query, [ questionID, studentID],
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


/***
 * Builds the Question Object with the given row
 * @param row
 * @returns {*}
 */
function buildQuestionObject( row ) {

    if(row.voteratio === null) {
        row.voteratio = 0;
    }

    if(row.studentvote === null) {
        row.studentvote = 0;
    }

    var author = new Student(row.studentid, row.username);
    var lecture = new Lecture(row.lectureid, row.lecturename, row.lecturedescription);
    var question = new Question(row.questionid, lecture, author, row.textcontent, row.voteratio, row.studentvote);

    return question;
}