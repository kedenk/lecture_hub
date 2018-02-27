'use strict';

var logger = require('../utils/LogFactory').getLogger();
var chatService = require('./ChatService.js');
const studentService = require('./../service/studentService.js');


var chatRegistration = {};
var socketio;

var Registration = function(studentID, username, lectureID, socket) {
    this.studentid = studentID;
    this.username = username;
    this.lectureid = lectureID;
    this.socket = socket;
}

var OnReceiveMessage = function(lectureID, username, message) {
    this.lectureid = lectureID;
    this.username = username;
    this.message = message;
}

var Author = function(studentID, username) {
    this.studentid = studentID;
    this.username = username;
}

var OnNewQuestionMessage = function(lectureID, questionID, voteRatio, author, textContent) {
    this.lectureid = lectureID;
    this.questionid = questionID;
    this.voteRatio = voteRatio;
    this.author = author;
    this.textContent = textContent;
}

var OnNewAnswer = function(answerID, questionID, voteRatio, author, textContent) {
    this.answerid = answerID;
    this.questionid = questionID;
    this.voteRatio = voteRatio;
    this.author = author;
    this.textContent = textContent;
}

var OnQuestionVoteRatioChanged = function(questionID, voteRatio) {
    this.questionid = questionID;
    this.voteRatio = voteRatio;
}

var OnAnswerVoteRatioChanged = function(answerID, voteRatio) {
    this.answerid = answerID;
    this.voteRatio = voteRatio;
}

var OnQuestionTextContentChanged = function(questionID, textContent) {
    this.questionid = questionID;
    this.textContent = textContent;
}

var OnAnswerTextContentChanged = function(answerID, textContent) {
    this.answerid = answerID;
    this.textContent = textContent;
}

var OnMoodChanged = function(lectureID, mood) {
    this.lectureid = lectureID;
    this.mood = mood;
}

var Mood = function(positive, neutral, negative) {
    this.positive = positive;
    this.neutral = neutral;
    this.negative = negative;
}


module.exports = function( io ) {

    socketio = io;

    const registerTopic = "onRegisterForChat";
    // Server receives messages from clients
    const sendMessageTopic = "onSendMessage";
    // Server sends messages to clients
    const receiveMessageTopic = "onReceiveMessage";


    io.on('connection', function(socket) {
        logger.info('user connected');

        socket.on(registerTopic, function( msg ) {
           logger.debug(msg);

            // {lectureID: <intValu>, studentID: <intValue>}

            studentService.getStudentByStudentID( msg.studentID )
                .then(function (response) {

                    var reg = new Registration(msg.studentID, response[0].username, msg.lectureID, socket);
                    chatRegistration[msg.studentID] = reg;

                    logger.info('New chat registration for: ' + chatRegistration[msg.studentID].username);
                });
        });

        socket.on(sendMessageTopic, function( msg ) {

            logger.debug(msg);

            if ( chatRegistration[msg.studentid] !== undefined ) {

                propagateMessage( msg.lectureid, chatRegistration[msg.studentid].username, msg.message );
            }
        });
    });

    io.on('disconnect', function(socket) {
       logger.info('user disconnected');

       Object.keys(chatRegistration).forEach(function(key) {

           if ( chatRegistration[key].socket === socket ) {
               delete chatRegistration[key];
           }
       });
    });

    function propagateMessage( lectureID, username, message ) {

        Object.keys(chatRegistration).forEach(function(key) {

            if( chatRegistration[key].lectureid === lectureID ) {

                logger.debug("message: <" + message + "> TO -> " + username + "@" + lectureID );
                io.to(chatRegistration[key].socket.id).emit(receiveMessageTopic, new OnReceiveMessage(lectureID, username, message));
            }
        });
    }
}


function sendMessage( topic, msg ) {
    socketio.emit(topic, msg);
}

exports.onNewQuestion = function(lectureID, questionID, voteRatio, author, textContent) {

    sendMessage('onNewQuestion', new OnNewQuestionMessage(lectureID, questionID, voteRatio, author, textContent));
}

exports.onNewAnswer = function( newAnswerObj ) {

    sendMessage('onNewAnswer', newAnswerObj);
}

exports.onQuestionVoteRatioChanged = function( onQuestionVoteRatioChObj ) {

    sendMessage('onQuestionVoteRatioChanged', onQuestionVoteRatioChObj);
}

exports.onAnswerVoteRatioChanged = function( onAnswerVoteRatioChObj ) {

    sendMessage('onAnswerVoteRatioChanged', onAnswerVoteRatioChObj );
}
