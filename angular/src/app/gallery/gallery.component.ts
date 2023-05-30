import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  private url = "http://localhost:8081/record/getByUser";

  constructor(public http:HttpClient) {}

  getData() {
    const user = localStorage.getItem('user');
    if (user) {
      const params = new HttpParams().set('userId', JSON.parse(user).id);
  
      this.http.get(this.url, {params}).subscribe((response: any) => {
        console.log(response);
        if (response) {
            // TODO: 将数据显示出来
        }
        else {
          window.alert('failed to get data');
        }
      });
    }
  }
}
