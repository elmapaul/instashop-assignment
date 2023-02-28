import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { Landmark } from '../models/landmark.model';
import * as Parse from 'parse';

Parse.initialize(environment.appId, environment.masterKey);
(Parse as any).serverURL = `${environment.serverUrl}`;

@Component({
  selector: 'app-landmark-list',
  templateUrl: './landmark-list.component.html',
  styleUrls: ['./landmark-list.component.css'],
})
export class LandmarkListComponent implements OnInit {
  landmarks: Landmark[] = [];
  searchText: string = '';
  showModal: boolean = false;
  modalImageUrl: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const Landmark = Parse.Object.extend('Landmark');
    const query = new Parse.Query(Landmark)
                           .select([
                              'title',
                              'photo',
                              'photo_thumb',
                              'short_info',
                              'objectId']
                            ).descending("order"); 
    query.find().then((response) => {
        response.map((landmark) => {
          const landmarkObj = { 
            ...landmark.attributes, 
            objectId: landmark.id
          };
          this.landmarks.push(landmarkObj);
        });
      }).catch((err) => console.log(err));

    // REST way
    // this.http.get(`${environment.landmarksUrl}`).subscribe({
    //     next: (response: any) => this.landmarks = response,
    //     error: (err) => console.log(err),
    //   });
  }

  // Show modal if image url defined, otherwise set it hidden
  triggerModal(url?: string) {
    if (url) {
      this.modalImageUrl = url;
    }

    this.showModal = !this.showModal;
  }

  search = async () => {
    this.http.get(`${environment.hostUrl}/landmarks/search?text=${this.searchText}`)
      .subscribe({
        next: (response: any) => this.landmarks = response,
        error: (err) => console.log(err),
      });
  }
}
