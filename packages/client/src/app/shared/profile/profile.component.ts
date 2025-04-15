import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CheckTokenService } from '../../services/checkToken.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() username: string = '';
  @Output() closeProfile = new EventEmitter<void>();
  private isMouseOver = false;

  constructor(
    private checkTokenService: CheckTokenService,
    private router: Router
  ) {}

  onMouseEnter(): void {
    this.isMouseOver = true;
  }

  onMouseLeave(): void {
    this.isMouseOver = false;
    // Даем небольшую задержку перед закрытием, чтобы успеть перейти на кнопку
    setTimeout(() => {
      if (!this.isMouseOver) {
        this.closeProfile.emit();
      }
    }, 100);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.checkTokenService.logout();
    this.router.navigate(['/auth/login']);
    this.closeProfile.emit();
  }
} 