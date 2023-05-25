import {Component, OnInit} from '@angular/core';
import {io} from 'socket.io-client';
import {Router} from "@angular/router";

@Component({
  selector: 'app-choose-character',
  templateUrl: './choose-character.component.html',
  styleUrls: ['./choose-character.component.css']
})
export class ChooseCharacterComponent implements OnInit {
  socket: any;
  list: any;
  choosing: Boolean;
  choice: any;

  constructor(private router: Router) {
    this.choosing = true
    this.list = [
      {
        name: "policeman",
        chosen: false
      },
      {
        name: "thief",
        chosen: false
      }
    ]
  }

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on("connect", () => {
      console.log("Connected to server!");
    })

    this.socket.on("characters", (res: any) => {
      console.log(res.data)
      this.list = res.data;
    })

    this.socket.on("ready", (res: any) => {
      console.log("ready!")
      this.router.navigate(['/main'], {
        queryParams: {
          character:this.choice
        }
      })
    })
  }

  choose(choice: string): void {
    this.socket.emit('choose character', choice);
    console.log(choice)
    this.choosing = false
    this.choice = choice
  }

  //TODO:
  // 2. 反馈选择的角色
  // 3. 得到游戏开始信号 (waiting for the other player...)
}
