import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GameService} from "../game.service";

@Component({
  selector: 'app-choose-character',
  templateUrl: './choose-character.component.html',
  styleUrls: ['./choose-character.component.css']
})
export class ChooseCharacterComponent implements OnInit,OnDestroy {
  list: any= [
    {
      name: "policeman",
      chosen: false
    },
    {
      name: "thief",
      chosen: false
    }
  ];
  choosing: boolean = true;
  choice: any;

  constructor(private router: Router, private gameService:GameService) {}

  ngOnInit(): void {
    this.gameService.updateList.subscribe((res:any)=>{
      this.list=res
    })
    this.gameService.gameReady.subscribe(()=>{
      this.router.navigate(['/main'], {
        queryParams: {
          character:this.choice
        }
      })
    })
  }

  choose(choice: string): void {
    this.choice=choice
    this.gameService.chooseCharacter(choice)
    this.choosing=false
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    // console.log("Destroyed!")
  }
}
