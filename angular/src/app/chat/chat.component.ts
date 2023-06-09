import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: string[] = [];

  constructor(private gameService: GameService) {
    this.gameService.socket.on('chat', (message: string) => {
      console.log(`Received message: ${message}`);
      this.messages.push(message);
      console.log(this.messages);
    });
  }

  sendMessage() {
    let text = document.getElementById("chat") as HTMLInputElement | null;
    const user = localStorage.getItem('user');
    if (text && text.value && user) {
      console.log(`Sending message: ${text.value}`);
      this.gameService.socket.emit('chat', String(JSON.parse(user).username) + ': ' + text.value);
      text.value = '';
    }
  }
}
