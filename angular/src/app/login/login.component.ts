import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private url = "http://localhost:8080/user/login";

  constructor(public http:HttpClient) {}

  login() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var username = document.getElementById("username") as HTMLInputElement | null;
    var password = document.getElementById("password") as HTMLInputElement | null;

    if (username != null && password != null) {
      console.log(username.value);
      this.http.post(this.url,
        {"username": username.value,
        "password": password.value}, httpOptions).subscribe((response: any) => {
          window.alert(response.message);
        });
    }
  }
}
