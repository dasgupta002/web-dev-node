const express = require("express");
const io = require("socket.io");
const app = express();

app.use(express.static("public"));

const server = app.listen(200);
const dev = io(server);

dev.on("connection", function(socket) {
    socket.on("mouse", (data) => {
        socket.broadcast.emit("painter", data);
    });
});