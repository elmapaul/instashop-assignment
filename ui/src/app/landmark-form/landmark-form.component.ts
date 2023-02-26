import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landmark-form',
  templateUrl: './landmark-form.component.html',
  styleUrls: ['./landmark-form.component.css'],
})
export class LandmarkFormComponent implements OnInit {
  landmark?: any;

  theForm = new FormGroup({
    name: new FormControl(this.landmark?.name, [Validators.required]),
    url: new FormControl(this.landmark?.url),
    description: new FormControl(this.landmark?.description),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.http
        .get(`https://localhost:4000/api/landmarks/${id}`)
        .subscribe({
          next: (response: any) => {
            console.log(response.data);
            this.landmark = response.data;

            this.theForm.patchValue({
              name: this.landmark.name,
              url: this.landmark.url,
              description: this.landmark.description,
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      // add
    }
  }

  submit() {
    this.http
      .post(
        'https://localhost:4000/api/landmarks',
        JSON.stringify(this.theForm.value),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}