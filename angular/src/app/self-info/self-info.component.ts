import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-info',
  templateUrl: './self-info.component.html',
  styleUrls: ['./self-info.component.css']
})
export class SelfInfoComponent implements OnInit {
  user : any;

  ngOnInit(): void {
    // just for test
    this.user.username = "test";
    this.user.password = "test";
  }
}
