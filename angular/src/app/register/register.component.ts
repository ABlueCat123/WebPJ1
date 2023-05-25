import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private url = "http://localhost:8080/user/register";

  constructor(public http:HttpClient) {}

  register() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.http.post(this.url,
      {username: 'abc',
      password: "123456"}, httpOptions).subscribe((response: any) => {
        window.alert(response.message);
      });
  }
}
