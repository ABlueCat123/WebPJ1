import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuComponent} from './menu/menu.component';
import {GreetingsComponent} from './greetings/greetings.component';
import {RouterModule, Routes} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {RoomComponent} from './room/room.component';
import {SelfInfoComponent} from './self-info/self-info.component';
import {GalleryComponent} from './gallery/gallery.component';
import {SettingsComponent} from './settings/settings.component';
import {ChooseRoomComponent} from './choose-room/choose-room.component';
import {ChooseCharacterComponent} from './choose-character/choose-character.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { ThreeDComponent } from './three-d/three-d.component';
import { ChatComponent } from './chat/chat.component';
import { LogoutComponent } from './logout/logout.component';

const appRoutes: Routes = [
  {path: '', component: GreetingsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'menu/new-game/choose-room', component: ChooseRoomComponent},
  {path: 'menu/new-game/choose-character', component: ChooseCharacterComponent},
  {path: 'menu/self-info', component: SelfInfoComponent},
  {path: 'menu/gallery', component: GalleryComponent},
  {path: 'menu/settings', component: SettingsComponent},
  {path: 'main', component: ThreeDComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    GreetingsComponent,
    LoginComponent,
    RegisterComponent,
    RoomComponent,
    SelfInfoComponent,
    GalleryComponent,
    SettingsComponent,
    ChooseRoomComponent,
    ChooseCharacterComponent,
    ThreeDComponent,
    ChatComponent,
    LogoutComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
