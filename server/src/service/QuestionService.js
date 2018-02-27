'use strict';


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

