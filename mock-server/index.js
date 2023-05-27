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
let currentQuestion;
let gameTimer;
let grabTimer;
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
            gameTimer=setTimeout(()=>{
                let result={
                    winner:'thief',
                    message:"Time is over. The thief has won!"
                }
                socket.emit("game over",result)
                socket.broadcast.emit("game over",result)
            },60*10*1000)
        }
    })

    socket.on("update", data => {
        playerList.forEach(player => {
            if (player.name === data.name) {
                player.position = data.pos
            }
        })
        socket.broadcast.emit("player state", playerList)
        let pos1=playerList[0].position
        let pos2=playerList[1].position
        if( (pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 <= 300 ** 2)
        {
            socket.emit("catchable");
            socket.broadcast.emit("catchable");
        }
    })

    socket.on("question", (callback) => {
        try {
            const response = axios.get('http://localhost:8081/question/getOne')
                .then(response => {
                    const data = response.data
                    currentQuestion = {
                        body: data.description,
                        choices: {
                            A: data.a,
                            B: data.b,
                            C: data.c,
                            D: data.d
                        },
                        answer: data.answer === 1 ? 'A' : data.answer === 2 ? 'B' : data.answer === 3 ? 'C' : 'D',
                        time: new Date().getTime(),
                        grabbed: false,
                        grabber: ''
                    }
                    callback(currentQuestion);
                    grabTimer=setTimeout(()=>{
                        let msg="Grab timeout, the answer is "+currentQuestion.answer+'.'
                        socket.emit("grab timeout",msg)
                    },10000)
                })
        } catch (error) {
            console.error(error);
        }
    })


    socket.on("grab", (character, callback) => {
        clearTimeout(grabTimer)
        if (currentQuestion.grabbed === false) {
            currentQuestion.grabbed = true;
            currentQuestion.grabber = character
            callback(true)
        } else
            callback(false)
    })
    socket.on("right answer", () => {
        let msg = currentQuestion.grabber + " answered right.\n" +
            " The answer is " + currentQuestion.answer + '.'
        let data = {
            right: true,
            answerer: currentQuestion.grabber,
            message: msg
        }
        socket.emit("answered", data)
        socket.broadcast.emit("answered", data)

    })
    socket.on("wrong answer", () => {
        let msg = currentQuestion.grabber + " answered wrong.\n" +
            " Now side changes."
        let data = {
            right: false,
            answerer: currentQuestion.grabber,
            message: msg
        }
        socket.emit("answered", data)
        socket.broadcast.emit("answered", data)
        if (currentQuestion.grabber === 'policeman')
            currentQuestion.grabber = 'thief'
        else if (currentQuestion.grabber === 'thief')
            currentQuestion.grabber = 'policeman'
    })
    socket.on("catch",()=>{
        let result={
            winner:'policeman',
            message:"The policeman has caught the thief.\n" +
                "The policeman has won!"
        }
        socket.emit("game over",result)
        socket.broadcast.emit("game over",result)
    })
})

