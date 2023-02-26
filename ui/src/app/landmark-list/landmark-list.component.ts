import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landmark-list',
  templateUrl: './landmark-list.component.html',
  styleUrls: ['./landmark-list.component.css'],
})
export class LandmarkListComponent implements OnInit {
  landmarks: any[] = [];
  searchText: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('https://localhost:4000/api/landmarks')
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.landmarks = response.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  search(){
    // search code
  }
}
