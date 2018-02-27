var logger = require('./src/utils/LogFactory').getLogger();
var express = require('express');

const port = 5300;
const app = express();
var router = express.Router();

var cors = require('cors');

//
// define and start app
//
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port);

//
// define and start routes
//
var routes = require('./src/routes/serverroutes');
routes(app);

//
// define and start websockets
//
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket = require('./src/websocket/sockets');
socket(io);
http.listen(3000, function() {
    console.log('websocket listening on port ' + 3000);
})


logger.info("Server started. Listen on port " + port)

logger.warn("Still in dev mode!");