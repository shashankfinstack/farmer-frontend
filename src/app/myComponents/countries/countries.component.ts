import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-country',
  templateUrl: './countries.component.html',  
  standalone: false,
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  countries: { id: number, name: string }[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchCountries();
    } else {
      this.errorMessage = 'LocalStorage is not available on the server.';
    }
  }

  fetchCountries(): void {
    const apiUrl = 'http://13.203.75.128/country/all';
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<{ id: number; name: string }[]>(apiUrl, { headers }).subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
        this.errorMessage =
          error.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load countries. Please try again later.';
      },
    });
  }
}



