// import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import * as Parse from 'parse';

Parse.initialize(environment.appId, environment.masterKey);
(Parse as any).serverURL = `${environment.serverUrl}`;

@Component({
  selector: 'app-landmark-preview',
  templateUrl: './landmark-preview.component.html',
  styleUrls: ['./landmark-preview.component.css'],
})
export class LandmarkPreviewComponent implements OnInit {
  landmark?: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    // private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      const Landmark = Parse.Object.extend('Landmark');
      const query = new Parse.Query(Landmark);

      query.get(id);
      query.first().then((response) => {
          if (response) {
            this.landmark = { ...response?.attributes, objectId: response.id };
          } else {
            this.landmark = {};
          }
        }).catch((err) => console.log(err));

      // REST way
      // this.http.get(`${environment.hostUrl}/parse/landmarks/${id}`)
      //   .subscribe({
      //     next: (response: any) => this.landmark = response,
      //     error: (err) => console.log(err),
      //   });
    } 
  }
}
