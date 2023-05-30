import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private url = "http://localhost:8081/register";

  constructor(public http:HttpClient, private router: Router) {}

  register() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var username = document.getElementById("register-username") as HTMLInputElement | null;
    var password = document.getElementById("register-password") as HTMLInputElement | null;
  
    if (username && password && username.value && password.value) {
      this.http.post(this.url,
        {"username": username.value,
        "password": password.value}, httpOptions).subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.router.navigate(['login']);
          }
          else {
            window.alert('failed to register');
          }
        });
    }
    else {
      window.alert("empty");
    }
  }
}
