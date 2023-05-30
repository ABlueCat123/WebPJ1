import {EventEmitter, Inject, Injectable, OnInit} from '@angular/core';
import {io} from "socket.io-client";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  socket: any;
  connected: boolean = false;
  inGame: boolean = false;
  // room:number;
  updateList: EventEmitter<any> = new EventEmitter<any>();
  gameReady: EventEmitter<any> = new EventEmitter<any>();

  constructor(public snackBar:MatSnackBar) {
    // 连接socket
    this.socket = io('http://localhost:3000/', {   
      transports: ['websocket'],
      upgrade: false
    });
    // const storedSocketId = localStorage.getItem('socketId');
    // if (storedSocketId) {
    //   console.log(storedSocketId);
    //   this.socket = io('http://localhost:3000/', {   
    //     transports: ['websocket'],
    //     upgrade: false,
    //     // query : { id: storedSocketId }
    //   });
    // }
    // else {
    //   this.socket = io('http://localhost:3000/', {   
    //     transports: ['websocket'],
    //     upgrade: false
    //   });
    //   localStorage.setItem('socketId', this.socket.id);
    // }

    const room = localStorage.getItem('room');
    if (room) {
      this.socket.emit('join room', room);
    }

    this.socket.on('connect', () => {
      this.connected = true;
    });

    this.socket.on("ready", (res: any) => {
      this.inGame=true;
      this.gameReady.emit(null);
    })

    setInterval(()=>{
      this.socket.emit("characters", (res: any) => {
        this.updateList.emit(res.data)
      })
    },400)
  }

  chooseCharacter(choice: string) {
    this.socket.emit('choose character', choice);
  }
  showMessage(msg:string){
    this.snackBar.open(msg,'Confirm',{
      horizontalPosition:"center",
      verticalPosition:"top",
      duration:2000
    })
  }

}
