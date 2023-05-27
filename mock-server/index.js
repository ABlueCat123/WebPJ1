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

let playerList = [
    {
        name: 'policeman',
        userId: 'test1',
        position: {},
        grabTime:'',
        online: true
    },
    {
        name: 'thief',
        userId: 'test2',
        position: {},
        grabTime:'',
        online: true
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

    socket.on("update", data => {
        playerList.forEach(player => {
            if (player.name === data.name) {
                player.position = data.pos
            }
        })
        socket.broadcast.emit("player state", playerList)
    })

    socket.on("question", (callback) => {
        callback( {
            body: "This is only a test",
            choices: {
                A: 'this is choice A',
                B: 'this is choice B',
                C: 'this is choice C',
                D: 'this is choice D'
            },
            answer: 'A',
            time: new Date().getTime(),
            grabbed:false
        })
    })


    socket.on("grab", (callback)=>{
        // 这里的逻辑没有写，就假装这位成功抢到了吧
        callback(true)
    })
})

