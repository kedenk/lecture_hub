'use strict';

var logger = require('../utils/LogFactory').getLogger();
const studentService = require('./../service/studentService.js');

var OnNewQuestion = require('./../models/onNewQuestion');

var chatRegistration = {};
var socketio;

var Registration = function(studentID, username, lectureID, socket) {
    this.studentID = studentID;
    this.username = username;
    this.lectureID = lectureID;
    this.socket = socket;
};

var OnReceiveMessage = function(lectureID, username, message) {
    this.lectureID = lectureID;
    this.username = username;
    this.message = message;
};

module.exports = function( io ) {

    console.log( io );
    if( io !== undefined ) {
        socketio = io;
    }

    const registerTopic = "onRegisterForChat";
    // Server receives messages from clients
    const sendMessageTopic = "onSendMessage";
    // Server sends messages to clients
    const receiveMessageTopic = "onReceiveMessage";


    io.on('connection', function(socket) {
        logger.info('socket connected');

        socket.on(registerTopic, function( msg ) {
           logger.debug(msg);

            // {lectureID: <intValu>, studentID: <intValue>}

            studentService.getStudentByStudentID( msg.studentID )
                .then(function (response) {

                    var reg = new Registration(msg.studentID, response.username, msg.lectureID, socket);
                    chatRegistration[msg.studentID] = reg;

                    logger.info('New chat registration for: ' + chatRegistration[msg.studentID].username);
                })
                .catch(function (response) {
                    logger.error(response);
                });
        });

        socket.on(sendMessageTopic, function( msg ) {

            logger.debug(msg);

            if ( chatRegistration[msg.studentID] !== undefined ) {

                propagateMessage( msg.lectureID, chatRegistration[msg.studentID].username, msg.message );
            }
        });
    });

    io.on('disconnect', function(socket) {
       logger.info('user disconnected');

       Object.keys(chatRegistration).forEach(function(key) {

           if ( chatRegistration[key].socket === socket ) {
               logger.debug('delete from chat registration');
               delete chatRegistration[key];
           }
       });
    });

    function propagateMessage( lectureID, username, message ) {

        Object.keys(chatRegistration).forEach(function(key) {

            if( chatRegistration[key].lectureID === lectureID ) {

                logger.debug("message: <" + message + "> TO -> " + username + "@" + lectureID );
                io.to(chatRegistration[key].socket.id).emit(receiveMessageTopic, new OnReceiveMessage(lectureID, username, message));
            }
        });
    }
}


function sendMessage( topic, msg ) {

    socketio.sockets.emit(topic, msg);
}

module.exports.onNewQuestion = function(lectureID, questionID, voteRatio, author, textContent) {

    logger.info("[Notification] New Question");
    sendMessage('onNewQuestion', new OnNewQuestion(lectureID, questionID, voteRatio, author, textContent));
};

module.exports.onNewAnswer = function( newAnswerObj ) {

    logger.info("[Notification] New Answer", newAnswerObj);
    sendMessage('onNewAnswer', newAnswerObj);
};

module.exports.onQuestionVoteRatioChanged = function( onQuestionVoteRatioChObj ) {

    logger.info("[Notification] Question Vote Ratio changed", onQuestionVoteRatioChObj);
    sendMessage('onQuestionVoteRatioChanged', onQuestionVoteRatioChObj);
};

module.exports.onAnswerVoteRatioChanged = function( onAnswerVoteRatioChObj ) {

    logger.info("[Notification] Answer Vote Ratio changed", onAnswerVoteRatioChObj);
    sendMessage('onAnswerVoteRatioChanged', onAnswerVoteRatioChObj );
};

module.exports.onQuestionTextContentChanged = function ( onQuestionTextContentChangedObj ) {

    logger.info("[Notification] Question text content changed", onQuestionTextContentChangedObj);
    sendMessage('onQuestionTextContentChanged', onQuestionTextContentChangedObj );
};

module.exports.onAnswerTextChanged = function( onAnswertTextChangedObj ) {

    logger.info("[Notification] Answer text content changed", onAnswertTextChangedObj);
    sendMessage('onAnswerTextChanged', onAnswertTextChangedObj );
};

module.exports.onMoodChanged = function( onMoodChangedObj ) {

    logger.info("[Notification] Mood changed", onMoodChangedObj);
    sendMessage('onMoodChanged', onMoodChangedObj );
}