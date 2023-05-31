import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-self-info',
  templateUrl: './self-info.component.html',
  styleUrls: ['./self-info.component.css']
})
export class SelfInfoComponent implements OnInit {
  user : any;
  private readonly url = "http://localhost:8081/change";

  constructor(public http:HttpClient) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
  }

  update() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    var username = document.getElementById("update-username") as HTMLInputElement | null;
    var password = document.getElementById("update-password") as HTMLInputElement | null;
  
    if (username && password && username.value && password.value) {
      this.http.post(this.url,
        {"id": JSON.parse(this.user).id,
        "username": username.value,
        "password": password.value}, httpOptions).subscribe((response: any) => {
          console.log(response);
          if (response) {
            localStorage.setItem('user', JSON.stringify(response));
          }
          else {
            window.alert('failed to update');
          }
        });
    }
    else {
      window.alert("empty");
    }
  }
}
