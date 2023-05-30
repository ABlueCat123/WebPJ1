import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private url = "http://localhost:8081/login";

  constructor(public http:HttpClient, private router: Router) {}

  login() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var username = document.getElementById("login-username") as HTMLInputElement | null;
    var password = document.getElementById("login-password") as HTMLInputElement | null;

    if (username && password && username.value && password.value) {
      console.log(username.value);
      this.http.post(this.url,
        {"username": username.value,
        "password": password.value}, httpOptions).subscribe((response: any) => {
          console.log(response);
          if (response) {
            localStorage.setItem('user', JSON.stringify(response));
            this.router.navigate(['menu']);
          }
          else {
            window.alert('failed to login');
          }
        });
    }
    else {
      window.alert("empty");
    }
  }
}
