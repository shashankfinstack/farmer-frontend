
import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  standalone: false,
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  schedules: Array<any> = [];
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchSchedules(); // Default: fetch all schedules
    } else {
      this.errorMessage = 'LocalStorage is not available on the server.';
    }
  }

  // Fetch all schedules (default method)
  fetchSchedules(): void {
    const apiUrl = 'http://13.203.75.128/schedule/all';
    this.fetchData(apiUrl);
  }

  // Fetch schedules for today
  fetchSchedulesForToday(): void {
    const apiUrl = 'http://13.203.75.128/schedule/today';
    this.fetchData(apiUrl);
  }

  // Fetch schedules for tomorrow
  fetchSchedulesForTomorrow(): void {
    const apiUrl = 'http://13.203.75.128/schedule/tomorrow';
    this.fetchData(apiUrl);
  }

  // Common fetch logic
  private fetchData(apiUrl: string): void {
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        // Check if the schedules data exists and is an array
        if (response && Array.isArray(response)) {
          this.schedules = response; // Assign schedules to the component's variable
          this.errorMessage = null; // Clear any error message
          console.log(this.schedules);
        } else {
          this.errorMessage = 'Invalid response structure. Schedules data is missing.';
        }
      },
      error: (error) => {
        console.error('Error fetching schedules:', error);
        this.errorMessage =
          error.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load schedules. Please try again later.';
      },
    });
  }
}
