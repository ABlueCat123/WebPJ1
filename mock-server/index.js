import {createServer} from "http";
import {Server} from "socket.io";
import axios from "axios";

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
        try {
            const response = axios.get('http://localhost:8081/question/getOne')
                .then(response => {

                    const data = response.data

                    callback({
                        body: data.description,
                        choices: {
                            A: data.a,
                            B: data.b,
                            C: data.c,
                            D: data.d
                        },
                        answer: data.answer === 1 ? 'A' : data.answer === 2 ? 'B' : data.answer === 3 ? 'C' : 'D',
                        time: new Date().getTime(),
                        grabbed: false
                    });
                })
        } catch (error) {
            console.error(error);
        }
    })


    socket.on("grab", (callback)=>{
        // 这里的逻辑没有写，就假装这位成功抢到了吧
        callback(true)
    })
})

