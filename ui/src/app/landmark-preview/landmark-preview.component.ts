import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import * as Parse from 'parse';
import { AuthService } from '../auth/auth.service';

Parse.initialize(environment.appId, environment.masterKey);

@Component({
  selector: 'app-landmark-preview',
  templateUrl: './landmark-preview.component.html',
  styleUrls: ['./landmark-preview.component.css'],
})
export class LandmarkPreviewComponent implements OnInit {
  landmark?: any;
  user: any;
  canUpdate: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

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

      // Alternative way with REST
      // this.http.get(`${environment.hostUrl}/parse/landmarks/${id}`)
      //   .subscribe({
      //     next: (response: any) => this.landmark = response,
      //     error: (err) => console.log(err),
      //   });
    } 
    
    // Get current user and check if 'write' permission exists
    if (this.authService.user) {
      this.user = this.authService.user;
      const userObj = this.user._value;
      
      this.canUpdate = userObj?.ACL[userObj.objectId]?.write;
    } 
  }
}
