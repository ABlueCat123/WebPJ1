import { Component, OnDestroy } from '@angular/core';
import { io, Socket } from "socket.io-client";

@Component({
  selector: 'app-choose-room',
  templateUrl: './choose-room.component.html',
  styleUrls: ['./choose-room.component.css']
})
export class ChooseRoomComponent implements OnDestroy {
  private socket: Socket;
  rooms: any[] = [];
  selectedRoom = '';

  constructor() {
    // 连接服务器
    this.socket = io('http://localhost:4200');

    // 监听可用房间列表
    this.socket.on('roomList', (rooms: any[]) => {
      this.rooms = rooms;
    });
  }

  ngOnDestroy() {
    // 清理事件监听器和关闭连接
    this.socket.off('roomList');
    this.socket.disconnect();
  }

  joinRoom() {
    // 发送请求加入房间
    if (this.selectedRoom) {
      this.socket.emit('joinRoom', this.selectedRoom);
    }
  }
}
