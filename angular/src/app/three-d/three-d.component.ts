import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-three-d',
  templateUrl: './three-d.component.html',
  styleUrls: ['./three-d.component.css']
})
export class ThreeDComponent implements OnInit {
  game: any;
  ngOnInit(): void {
    this.game = new Game("police");

  }
}
