import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front-end';

  greetingLeave() {
    let greetings = document.querySelector('app-greetings')
    if (greetings !== null)
      greetings.classList.add("--leave")
    let menu = document.querySelector('app-menu')
    if (menu !== null)
      menu.classList.toggle("--show")
  }

}
