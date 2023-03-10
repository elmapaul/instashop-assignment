import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import * as Parse from 'parse';
import { Landmark } from '../models/landmark.model';

Parse.initialize(environment.appId, environment.masterKey);
(Parse as any).serverURL = `${environment.serverUrl}`;

@Component({
  selector: 'app-landmark-form',
  templateUrl: './landmark-form.component.html',
  styleUrls: ['./landmark-form.component.css'],
})
export class LandmarkFormComponent implements OnInit {
  landmark?: Landmark;
  landmarkForm: FormGroup;
  fileName: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.landmarkForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      url: new FormControl(''),
      short_info: new FormControl(''),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      const Landmark = Parse.Object.extend('Landmark');
      const query = new Parse.Query(Landmark);

      query.get(id);
      query.first().then((response) => {
          if (response) {
            this.landmark = { ...response?.attributes, objectId: response.id };
            // Update form's values
            this.landmarkForm.patchValue({
              title: this.landmark?.title,
              description: this.landmark?.description,
              url: this.landmark?.url,
              short_info: this.landmark?.short_info
            });
          } else {
            this.landmark = {};
          }
        }).catch((err) => console.log(err));

      // REST way to get a landmark and update the form
      // this.http.get(`${environment.hostUrl}/parse/landmarks/${id}`)
      //   .subscribe({
      //     next: (response: any) => {
      //       this.landmark = response;
      
      //       this.landmarkForm.patchValue({
      //         title: this.landmark?.title,
      //         description: this.landmark?.description,
      //         url: this.landmark?.url,
      //         short_info: this.landmark?.short_info
      //       });
      //     },
      //     error: (err) => {
      //       console.log(err);
      //     },
      //   });
    } 
  }

  validateUploadedFile(fileToUpload: any): boolean {    
    // Check file type
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (fileToUpload && !allowedMimeTypes.includes(fileToUpload.type)) {
      // FIXME: improve UI message
      alert('Not alloweded file type!');
      return false;
    }
    // Prevent uploading > 5Mb
    if (fileToUpload.size > (5 * 1024 * 1024)) {
      // FIXME: improve UI message
      alert('Uploading more than 5Mb is not allowed!');
      return false;
    }

    return true;
  }

  uploadFile(event: any) {
    const fileToUpload = event.target.files[0];
    const isValid = this.validateUploadedFile(fileToUpload);

    if (!isValid) return false;

    const url = environment.hostUrl + '/parse/files/' + fileToUpload.name;
    const formData: FormData = new FormData();

    // Pass binary file in order to resize it on the server
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    // this.landmarkForm.patchValue({ photo: url });
    return this.http.post(url, formData).subscribe();    
  }

  submit() {    
    if (this.landmark) {
      const formData = { ...this.landmarkForm.value };
      const url = `${environment.hostUrl}/parse/classes/Landmark/${this.landmark.objectId}`;
  
      // Update via REST
      this.http.put(url, formData).subscribe({
          next: (response: any) => {
            this.router.navigate([`/landmarks/${this.landmark?.objectId}`]);
          },
          error: (err) => console.log(err),
        });
    }
  }
}
