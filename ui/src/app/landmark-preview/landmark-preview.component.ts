import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-landmark-preview',
  templateUrl: './landmark-preview.component.html',
  styleUrls: ['./landmark-preview.component.css'],
})
export class LandmarkPreviewComponent implements OnInit {
  landmark?: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.http.get(`${environment.hostUrl}/parse/landmarks/${id}`)
        .subscribe({
          next: (response: any) => this.landmark = response,
          error: (err) => console.log(err),
        });
    } 
  }
}
