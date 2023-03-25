//create an express app with socketio
var express = require("express");
var app = express();
var http = require("http").Server(app);
//io needs to have allow EIO3 and cors
var io = require("socket.io")(http, {
  transports: ["websocket", "polling"],
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//serve the index.html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/indexBin.html");
});


//listen for a connection
io.on("connection", function (socket) {
  if (socket.handshake.query.clientType == "web") {
    console.log("WEB Client connected:" + socket.id);
  } else {
    console.log("ESP client connected:" + socket.id);
  }

  //this is message from esp8266 client
  socket.on("message", function (msg) {
    console.log("received message");
    socket.broadcast.emit("message", msg);
  });
});


//listen on port 3002
http.listen(process.env.PORT || 3002, function () {
  console.log("listening on *:3002");
});
