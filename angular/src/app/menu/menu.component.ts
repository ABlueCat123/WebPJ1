import { Component } from '@angular/core';
import {slideInAnimation} from "../animations";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations:[slideInAnimation]
})
export class MenuComponent {
  routeAnimations=false;
}
