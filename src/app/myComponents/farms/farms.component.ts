import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  standalone: false,
  styleUrls: ['./farms.component.css']
})
export class FarmsComponent implements OnInit {
  farms: Array<any> = [];
  errorMessage: string | null = null;

  // New farm data
  newFarm = {
    area: '',
    village: '',
    crop_grown: '',
    sowing_date: '',
    farmer_id: '',
    country_id: ''
  };

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchFarms();
    } else {
      this.errorMessage = 'LocalStorage is not available on the server.';
    }
  }

  // Fetch farms
  fetchFarms(): void {
    const apiUrl = 'http://13.203.75.128/farm/allfarms';
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.farms = response; // Assign farms to the component's variable
        } else {
          this.errorMessage = 'Invalid response structure. Farms data is missing.';
        }
      },
      error: (error) => {
        console.error('Error fetching farms:', error);
        this.errorMessage =
          error.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load farms. Please try again later.';
      },
    });
  }

  // Create a new farm
  createFarm(): void {
    const apiUrl = 'http://13.203.75.128/farm/create-farm';
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.post<any>(apiUrl, this.newFarm, { headers }).subscribe({
      next: (response) => {
        this.farms.push(response); // Add the new farm to the list
        this.newFarm = { area: '', village: '', crop_grown: '', sowing_date: '', farmer_id: '', country_id: '' }; // Reset form
      },
      error: (error) => {
        console.error('Error creating farm:', error);
        this.errorMessage = 'Failed to create farm. Please try again later.';
      }
    });
  }

  // Delete a farm
  deleteFarm(farmId: number): void {
    const apiUrl = `http://13.203.75.128/farm/delete-farm/${farmId}`;
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete<any>(apiUrl, { headers }).subscribe({
      next: () => {
        this.farms = this.farms.filter(farm => farm.id !== farmId); // Remove the deleted farm from the list
      },
      error: (error) => {
        console.error('Error deleting farm:', error);
        this.errorMessage = 'Failed to delete farm. Please try again later.';
      }
    });
  }
}
