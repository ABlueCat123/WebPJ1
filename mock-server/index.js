import {createServer} from "http";
import {Server} from "socket.io";
import axios from "axios";
import { assert } from "console";

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

class RoomInfo {
    characterList = [
        {
            name: "policeman",
            chosen: false
        },
        {
            name: "thief",
            chosen: false
        }
    ]
    
    playerList = [
        {
            name: 'policeman',
            userId: 'test1',
            position: {},
            grabTime: '',
            online: true
        },
        {
            name: 'thief',
            userId: 'test2',
            position: {},
            grabTime: '',
            online: true
        }
    ]
    
    currentQuestion;
    gameTimer;
    grabTimer;
}

let UserRoomMap = new Map(); // userId --> room
let RoomInfoMap = new Map(); // room --> RoomInfo

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    socket.leave(socket.id);
    if (UserRoomMap.get(userId)) {
        socket.join(UserRoomMap.get(userId));
    }
    else {
        UserRoomMap.set(userId, null);
    }
    console.log(`${socket.id} connect`);

    socket.on("room list", () => {
        console.log(io.sockets.adapter.rooms);
        const roomSet = new Set(io.sockets.adapter.rooms.keys());
        const rooms = Array.from(roomSet);
        socket.emit('room list', rooms);
    });

    socket.on('join room', (room) => {
        console.log('join room');
        if (io.sockets.adapter.rooms.get(room) == undefined) {
            socket.join(room);
            socket.emit('message', `success`);
            console.log(`User ${socket.id} joined room ${room}`);
            UserRoomMap.set(userId, room);
            RoomInfoMap.set(room, new RoomInfo());
        } else if (io.sockets.adapter.rooms.get(room).size < 2) {
            socket.join(room);
            socket.emit('message', `success`);
            console.log(`User ${socket.id} joined room ${room}`);
            UserRoomMap.set(userId, room);
        } else {
            socket.emit('message', `the room ${room} is full`);
            console.log(`the room ${room} is full`);
        }
    });
    socket.on('leave room', (room) => {
        console.log('leave room');
        UserRoomMap.delete(userId);
        socket.leave(room);
        socket.emit('leave room');
        if (io.sockets.adapter.rooms.get(room) == undefined || io.sockets.adapter.rooms.get(room).size == 0) {
            RoomInfoMap.delete(room);
        }
    });
    socket.on('chat', (message) => {
        console.log(`Received message: ${message}`);
        socket.broadcast.to(UserRoomMap.get(userId)).emit('chat', message);
    });

    socket.on("characters", (callback) => {
        if (UserRoomMap.get(userId)) {
            let characterList = (RoomInfoMap.get(UserRoomMap.get(userId))).characterList;
            callback({data: characterList})
        }
    })
    socket.on('choose character', (choice) => {
        let characterList = RoomInfoMap.get(UserRoomMap.get(userId)).characterList;
        for (let element of characterList)
            if (element.name === choice)
                element.chosen = true;
        let ready = true;
        for (let element of characterList)
            if (element.chosen === false)
                ready = false;
        console.log(characterList)
        if (ready) {
            socket.broadcast.to(UserRoomMap.get(userId)).emit("ready")
            RoomInfoMap.get(UserRoomMap.get(userId)).gameTimer = setTimeout(() => {
                let result = {
                    winner: 'thief',
                    message: "Time is over. The thief has won!"
                }
                socket.broadcast.to(UserRoomMap.get(userId)).emit("game over", result)
                
                try {
                    const roomId = UserRoomMap.get(userId);
                    let anotherUserId = null;
                    UserRoomMap.forEach((value, key) => {
                      if (value === roomId && key !== userId) {
                        anotherUserId = key;
                      }
                    });
                    assert(anotherUserId != null);
                    let record = null;
                    if (choice === 'policeman') {
                        axios.post('http://localhost:8081/record/add',
                            {
                                "policeId": userId,
                                "thiefId": anotherUserId,
                                "startTime": null,
                                "time": null,
                                "winnerRole": "thief"
                            }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                            }).then(response => {
                                console.log(response.data);
                            });
                    } else {
                        axios.post('http://localhost:8081/record/add',
                        {
                            "policeId": anotherUserId,
                            "thiefId": userId,
                            "startTime": null,
                            "time": null,
                            "winnerRole": "thief"
                        }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                        }).then(response => {
                            console.log(response.data);
                        });
                    }
                } catch (error) {
                    console.error(error);
                }
            }, 60 * 10 * 1000)
        }
    })

    socket.on("update", data => {
        if (!UserRoomMap.get(userId)) {
            return;
        }
        RoomInfoMap.get(UserRoomMap.get(userId)).playerList.forEach(player => {
            if (player.name === data.name) {
                player.position = data.pos
            }
        })
        let playerList = RoomInfoMap.get(UserRoomMap.get(userId)).playerList;
        socket.broadcast.to(UserRoomMap.get(userId)).emit("player state", playerList)
        let pos1 = playerList[0].position
        let pos2 = playerList[1].position
        if ((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 <= 600 ** 2) {
            socket.broadcast.to(UserRoomMap.get(userId)).emit("catchable");
        }
    })

    socket.on("question request", () => {
        if (!UserRoomMap.get(userId)) {
            return;
        }
        try {
            const response = axios.get('http://localhost:8081/question/getOne')
                .then(response => {
                    const data = response.data
                    RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion = {
                        body: data.description,
                        choices: {
                            A: data.a,
                            B: data.b,
                            C: data.c,
                            D: data.d
                        },
                        answer: data.answer,
                        time: new Date().getTime(),
                        grabbed: false,
                        grabber: ''
                    }
                    socket.broadcast.to(UserRoomMap.get(userId)).emit("question", RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion);
                    // grabTimer=setTimeout(()=>{
                    //     let msg="Grab timeout, the answer is "+currentQuestion.answer+'.'
                    //     socket.emit("grab timeout",msg)
                    //     socket.broadcast.emit("grab timeout",msg)
                    //     clearTimeout(grabTimer);
                    // },10000)
                    //TODO: 超时逻辑有点问题。
                })
        } catch (error) {
            console.error(error);
        }
    })


    socket.on("grab", (character, callback) => {
        clearTimeout(RoomInfoMap.get(UserRoomMap.get(userId)).grabTimer);
        if (RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion.grabbed === false) {
            RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion.grabbed = true;
            RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion.grabber = character
            callback(true)
        } else
            callback(false)
    })
    socket.on("right answer", () => {
        let currentQuestion = RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion;
        let msg = currentQuestion.grabber + " answered right.\n" +
            " The answer is " + currentQuestion.answer + '.\n' +
            'The ' + currentQuestion.grabber + " can take a move now."
        let data = {
            right: true,
            answerer: currentQuestion.grabber,
            message: msg
        }
        socket.broadcast.to(UserRoomMap.get(userId)).emit("answered", data)
    })
    socket.on("wrong answer", () => {
        let currentQuestion = RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion;
        let msg = currentQuestion.grabber + " answered wrong.\n" +
            " Now side changes."
        let data = {
            right: false,
            answerer: currentQuestion.grabber,
            message: msg
        }
        socket.broadcast.to(UserRoomMap.get(userId)).emit("answered", data)

        if (currentQuestion.grabber === 'policeman')
        RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion.grabber = 'thief'
        else if (currentQuestion.grabber === 'thief')
        RoomInfoMap.get(UserRoomMap.get(userId)).currentQuestion.grabber = 'policeman'
    })
    socket.on("catch", () => {
        let result = {
            winner: 'policeman',
            message: "The policeman has caught the thief.\n" +
                "The policeman has won!"
        }
        socket.broadcast.to(UserRoomMap.get(userId)).emit("game over", result)

        try {
            const roomId = UserRoomMap.get(userId);
            let anotherUserId = null;
            UserRoomMap.forEach((value, key) => {
              if (value === roomId && key !== userId) {
                anotherUserId = key;
              }
            });
            assert(anotherUserId != null);
            axios.post('http://localhost:8081/record/add', 
                {
                    "policeId": userId,
                    "thiefId": anotherUserId,
                    "startTime": null,
                    "time": null,
                    "winnerRole": "policeman"
                }, {
                headers: {
                    'Content-Type': 'application/json'
                }
                }).then(response => {
                    console.log(response.data);
                });
        } catch (error) {
            console.error(error);
        }
    })
})

