import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CheckTokenService } from '../../../../services/checkToken.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  user = {
    email: '',
    password: '',
  };

  constructor(
    private apiService: ApiService,
    private checkTokenService: CheckTokenService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.apiService.login(this.user).subscribe({
      next: (response) => {
        this.router.navigate(['/profile']);
        this.checkTokenService.login();
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        console.error('There was an error logging in: ', error);
      },
    });
  }
}
