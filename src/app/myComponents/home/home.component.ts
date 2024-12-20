import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) { }

  logout(): void {
    // Clear the token or any session data from storage
    localStorage.removeItem('authToken');
  
    // Redirect to the login page and replace the history state
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  
}

// Security Focus: Use the version with replaceUrl: true to avoid the risk of 
// users navigating back to authenticated pages. This approach offers better security and avoids unintended behavior with browser history.