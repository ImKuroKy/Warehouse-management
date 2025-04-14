import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { ComparePasswordDirective } from '../../../../directives/compare-password.directive';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ComparePasswordDirective],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { username, email, password, confirmPassword } = this.user;
      const requestData = { username, email, password, confirmPassword };
      this.apiService.register(requestData).subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('An error occurred during registration: ', error);
        },
      });
    }
  }
}
