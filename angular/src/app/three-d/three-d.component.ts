import {Component, OnInit} from '@angular/core';
import {io} from 'socket.io-client';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-three-d',
  templateUrl: './three-d.component.html',
  styleUrls: ['./three-d.component.css']
})
export class ThreeDComponent implements OnInit {
  character: any;
  game: any;
  socket: any;

  constructor(private activatedRoute:ActivatedRoute) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.character=queryParams['character'];
      this.game = new Game(this.character);
    });
  }

  ngOnInit(): void {
  //   this.game = new Game("police");
    // this.socket=io('http://localhost:3000');
    // this.socket.on("connect",()=>{
    //   console.log("Connected!");
    // })
  }

  sendMessage(msg: string) {
    // this.socket.emit('sendMessage',{message:msg});

  }

  onNewMessage() {

  }
}
