import {Component, OnInit} from '@angular/core';
declare var game:any
@Component({
  selector: 'app-three-d',
  templateUrl: './three-d.component.html',
  styleUrls: ['./three-d.component.css']
})
export class ThreeDComponent implements OnInit{
  ngOnInit(): void {
    new game.Game("police");
  }

}
