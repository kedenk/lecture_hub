'use strict';

var dbPool = require('../db/DbManager');

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
    var examples = {};
    examples['application/json'] = {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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

      const query = 'SELECT * FROM answers';
      const pool = dbPool.getDbPool();
      console.log('[DB] ' + query);

      pool.query(query,
          (err, searchResult) => {
              if( err ) {

                  console.error(err.stack);
                  resolve(err);

              } else {

                  resolve(searchResult.rows);
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
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
    var examples = {};
    examples['application/json'] = [ {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
}, {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = [ {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
}, {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = {
  "answerID" : 0,
  "answerTo" : 6,
  "studentVote" : 5,
  "author" : {
    "studentID" : 0,
    "username" : "username"
  },
  "textContent" : "textContent",
  "voteRatio" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

