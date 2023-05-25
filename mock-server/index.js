import {createServer} from "http";
import {Server} from "socket.io";
// $env:DEBUG='app';nodemon ./index.js

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200"
    }
});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});
let data = [
    {
        name: "policeman",
        chosen: false
    },
    {
        name: "thief",
        chosen: false
    }
]
io.on("connect", (socket) => {
    console.log("connect")
    socket.emit("characters", {data: data});
})

io.on("connection", socket => {
    socket.on('choose character', (choice) => {
        for (let element of data)
            if (element.name === choice)
                element.chosen = true;
        let ready = true;
        for (let element of data)
            if (element.chosen === false)
                ready = false;
        if (ready) socket.broadcast.emit("ready")
    })
})
