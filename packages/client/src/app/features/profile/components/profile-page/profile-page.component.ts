import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CheckTokenService } from '../../../../services/checkToken.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  user: any = {};

  constructor(
    private apiService: ApiService,
    private checkTokenService: CheckTokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.data;
      },
      error: (err) => {
        console.error('An error occurred during getting user data: ', err);
      },
    });
  }
  onEdit() {
    this.router.navigate(['profile/edit']);
  }
  onLogout() {
    this.checkTokenService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
