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
  // room:number; 由服务器端维护
  updateList: EventEmitter<any> = new EventEmitter<any>();
  gameReady: EventEmitter<any> = new EventEmitter<any>();

  constructor(public snackBar:MatSnackBar) {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }

    // 连接socket
    this.socket = io('http://localhost:3000/', {   
      query: { userId: JSON.parse(user).id }
    });

    this.socket.on('connection', () => {
      this.connected = true;
    });

    this.socket.on("ready", (res: any) => {
      this.inGame=true;
      this.gameReady.emit(null);
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
