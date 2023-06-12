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
import {SelfInfoComponent} from './self-info/self-info.component';
import {GalleryComponent} from './gallery/gallery.component';
import {ChooseRoomComponent} from './choose-room/choose-room.component';
import {ChooseCharacterComponent} from './choose-character/choose-character.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import { ThreeDComponent } from './three-d/three-d.component';
import { ChatComponent } from './chat/chat.component';
import { LogoutComponent } from './logout/logout.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { HttpClientModule, HttpClient } from '@angular/common/http';

const appRoutes: Routes = [
  {path: '', component: GreetingsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'choose-room', component: ChooseRoomComponent},
  {path: 'choose-character', component: ChooseCharacterComponent},
  {path: 'self-info', component: SelfInfoComponent},
  {path: 'gallery', component: GalleryComponent},
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
    SelfInfoComponent,
    GalleryComponent,
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
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
