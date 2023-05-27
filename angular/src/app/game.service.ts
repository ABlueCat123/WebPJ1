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
  showMessage(msg:string){
    this.snackBar.open(msg,'Confirm',{
      horizontalPosition:"center",
      verticalPosition:"top",
      duration:2000
    })
  }

}
