import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { GameService } from '../game.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  text: string = '';
  messages: string[] = [];

  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.socket.on('chat', (message: string) => {
      console.log(`Received message: ${message}`);
      this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    this.gameService.socket.disconnect();
  }

  sendMessage() {
    if (this.text !== '') {
      console.log(`Sending message: ${this.text}`);
      this.gameService.socket.emit('chat', this.text);
      this.text = '';
    }
  }
}
