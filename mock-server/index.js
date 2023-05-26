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

let characterList = [
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
    socket.emit("characters", {data: characterList});
})
io.on("connection", socket => {
    socket.on('choose character', (choice) => {

        for (let element of characterList)
            if (element.name === choice)
                element.chosen = true;
        let ready = true;
        for (let element of characterList)
            if (element.chosen === false)
                ready = false;
        console.log(characterList)
        if (ready) {
            socket.emit("ready")
            socket.broadcast.emit("ready")
        }
    })

})

