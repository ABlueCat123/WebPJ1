import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  records: any;

  constructor(public http:HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      let url = "http://localhost:8081/record/getByUser?userId=" + String(JSON.parse(user).id);

      this.http.get(url).subscribe((response: any) => {
        console.log(response);
        if (response) {
            this.records = response;
        }
        else {
          window.alert('failed to get data');
        }
      });
    }
  }
}
