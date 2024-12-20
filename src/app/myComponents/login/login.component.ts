import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isPasswordVisible: boolean = false; 

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    console.log('LoginComponent initialized.');
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login() {
    const credentials = { username: this.username, password: this.password };

    // POST request to the login API
    this.http.post<any>('http://13.203.75.128/user/login', credentials).subscribe(
      (response) => {
        console.log(response)
        if (response && response.access_token) {         // Assume a successful response contains a token

          // Store token or other user data if necessary (localStorage, etc.)
          localStorage.setItem('authToken', response.access_token);
          
          // redirect to the home page
          this.router.navigate(['/home']);
        } else {
          alert('Invalid login credentials');
        }
      },
      (error) => {
        console.error('Login error', error);
        alert('There was an error logging in');
      }
    );
  }
}

