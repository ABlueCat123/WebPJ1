import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { GameService } from '../game.service';

@Component({
  selector: 'app-choose-room',
  templateUrl: './choose-room.component.html',
  styleUrls: ['./choose-room.component.css']
})
export class ChooseRoomComponent implements OnInit{
  rooms: any[] = [];

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit(): void {
    // 获取可用房间列表
    this.gameService.socket.emit('room list');
    this.gameService.socket.on('room list', (rooms: any[]) => {
      this.rooms = rooms;
      console.log(this.rooms);
    });
  }

  createRoom() {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('create room');
      this.gameService.socket.emit('join room', String(JSON.parse(user).id));
      this.gameService.socket.on('message', (message: String) => {
        if (message === 'success') {
          localStorage.setItem('room', String(JSON.parse(user).id));
          this.router.navigate(['/choose-character']);
        }
        else {
          window.alert(message);
        }
      });
    }
  }

  joinRoom(room : any) {
    console.log(room);
    // 发送请求加入房间
    if (room) {
      this.gameService.socket.emit('join room', room);
      this.gameService.socket.on('message', (message : String) => {
        if (message === 'success') {
          localStorage.setItem('room', room);
          this.router.navigate(['/choose-character']);
        }
        else {
          window.alert(message);
        }
      });
    }
  }
}
