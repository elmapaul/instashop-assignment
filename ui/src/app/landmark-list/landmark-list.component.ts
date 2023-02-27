import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { Landmark } from './landmark.model';


@Component({
  selector: 'app-landmark-list',
  templateUrl: './landmark-list.component.html',
  styleUrls: ['./landmark-list.component.css'],
})
export class LandmarkListComponent implements OnInit {
  landmarks: Landmark[] = [];
  searchText: string = "";
  showModal: boolean = false;
  modalUrl: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get(`${environment.landmarksUrl}`)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.landmarks = response;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // Show modal if image url defined, otherwise set it hidden
  triggerModal(url?: string) {
    if (url) {
      this.modalUrl = url;
    }

    this.showModal = !this.showModal;
  }

  search(){
    // search code
  }
}
