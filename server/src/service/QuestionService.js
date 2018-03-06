'use strict';

var dbPool = require('../db/DbManager');
var logger = require('../utils/LogFactory').getLogger();

var tableName = 'question';


var Author = function(studentID, username) {
    this.studentID = studentID;
    this.username = username;
}

var Lecture = function(lectureID, lectureName, lectureDescription) {
    this.lectureName = lectureName;
    this.lectureID = lectureID;
    this.lectureDescription = lectureDescription;
}

var QuestionPayload = function(questionID, lecture, author, textContent, voteRatio, studentVote) {
    this.questionID = questionID;
    this.lecture = lecture;
    this.author = author;
    this.textContent = textContent;
    this.voteRatio = voteRatio;
    this.studentVote = studentVote;
}

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
    var examples = {};
    examples['application/json'] = {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = [ {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
}, {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
exports.getQuestionsByLectureID = function(lectureID,studentID) {
  return new Promise(function(resolve, reject) {

    dbPool.selectByKey('student', 'studentid', studentID)
        .then( res => {

          if( res.rowCount === 0 ) {
            reject('Student not found. Not permitted to get questions.');
          }

          dbPool.selectByKey('lecture', 'lectureid', lectureID)
              .then(
                  res => {

                    if(res.rowCount === 0 ) {
                      reject('No lecture found with given lecture id.');
                    }

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
                                  console.log(row);

                                  if(row.voteRatio === null) {
                                      row.voteRatio = 0;
                                  }

                                  if(row.studentVote === null) {
                                      row.studentVote = 0;
                                  }

                                  var author = new Author(row.studentid, row.username);
                                  var lecture = new Lecture(row.lectureid, row.lecturename, row.lecturedescription);
                                  var question = new QuestionPayload(row.questionid, lecture, author, row.textcontent, row.voteratio, row.studentvote);
                                  result.push(question);
                                }

                                resolve(result);
                              }
                          });
                  }
              )
              .catch( err => reject(err) );
        })
        .catch( err => reject(err) );
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
exports.updateQuestion = function(questionID,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "studentVote" : 1,
  "questionID" : 0,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "lecture" : {
    "lectureName" : "lectureName",
    "lectureDescription" : "lectureDescription",
    "lectureID" : 0
  },
  "textContent" : "textContent",
  "voteRatio" : 6
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

