import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';              // Import map from rxjs

@Component({
  selector: 'app-farmers',
  templateUrl: './farmers.component.html',
  standalone: false,
  styleUrls: ['./farmers.component.css']
})
export class FarmersComponent implements OnInit {
  farmers: Array<any> = [];
  errorMessage: string | null = null;
  cropName: string = ''; // Input field for crop name
  newFarmer = {
    name: '',
    phone_number: '',
    language: '',
    country_id: 0,
  };                  // For creating a new farmer

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchAllFarmers();
    } else {
      this.errorMessage = 'LocalStorage is not available on the server.';
    }
  }

  // Fetch all farmers
  fetchAllFarmers(): void {
    const apiUrl = 'http://13.203.75.128/farmer/allfarmers';
    this.fetchFarmers(apiUrl);
  }

  // Fetch farmers by crop name
  fetchFarmersByCrop(): void {
    if (!this.cropName.trim()) {
      this.errorMessage = 'Please enter a crop name to search.';
      return;
    }


    const apiUrl = `http://13.203.75.128/farmer/crop/${this.cropName}`;

    // Log the URL being used for debugging
    console.log('Fetching farmers for crop:', this.cropName, 'Using URL:', apiUrl);

    this.fetchFarmers(apiUrl);
  }

  // Common logic to fetch farmers data
  private fetchFarmers(apiUrl: string): void {
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(apiUrl, { headers }).pipe(
      map((data) => {
        if (data && Array.isArray(data.farmers)) {
          return data.farmers;
        } else {
          throw new Error('No farmers data found in the response.');
        }
      })
    ).subscribe({
      next: (farmers) => {
        this.farmers = farmers;
        this.errorMessage = null; // Clear any previous error messages
      },
      error: (error) => {
        console.error('Error fetching farmers:', error);
        this.errorMessage =
          error.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load farmers. Please try again later.';
      },
    });
  }

  // Create a new farmer
  createFarmer(): void {
    const apiUrl = 'http://13.203.75.128/farmer/create-farmer';
    const token = localStorage.getItem('authToken');            // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.post<any>(apiUrl, this.newFarmer, { headers }).subscribe({
      next: (response) => {
        this.farmers.push(response);  // Add the new farmer to the list
        this.newFarmer = { name: '', phone_number: '', language: '', country_id: 0 };  // Reset the form
      },
      error: (error) => {
        console.error('Error creating farmer:', error);
        this.errorMessage = 'Failed to create farmer. Please try again later.';
      }
    });
  }

  // Delete a farmer by ID
  deleteFarmer(farmerId: number): void {
    const apiUrl = `http://13.203.75.128/farmer/delete-farmer/${farmerId}`;
    const token = localStorage.getItem('authToken'); // Accessing localStorage

    if (!token) {
      this.errorMessage = 'You are not logged in. Please log in to continue.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete<any>(apiUrl, { headers }).subscribe({
      next: () => {
        this.farmers = this.farmers.filter(farmer => farmer.id !== farmerId);  // Remove the deleted farmer from the list
      },
      error: (error) => {
        console.error('Error deleting farmer:', error);
        this.errorMessage = 'Failed to delete farmer. Please try again later.';
      }
    });
  }
}
