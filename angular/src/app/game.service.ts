import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {io} from "socket.io-client";

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

  constructor() {
    this.socket = io('http://localhost:3000/');
    this.socket.connect();

    this.socket.on("connect", () => {
      this.connected = true
    })

    this.socket.on("characters", (res: any) => {
      this.updateList.emit(res.data)
    })
    this.socket.on("ready", (res: any) => {
      this.inGame=true;
      this.gameReady.emit(null)
    })
  }

  chooseCharacter(choice: string) {
    this.socket.emit('choose character', choice);
  }


}
