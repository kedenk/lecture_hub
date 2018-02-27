'use strict';

var logger = require('../utils/LogFactory').getLogger();

exports.onNewMessage = function (io, msg) {

    logger.info('New message: ');
    console.log(msg);

    io.propagateMessage( msg.lectureID, msg.studentID, msg.message );
};