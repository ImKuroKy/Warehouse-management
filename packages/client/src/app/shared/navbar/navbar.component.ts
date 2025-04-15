import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CheckTokenService } from '../../services/checkToken.service';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ProfileComponent, NotificationsComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  showProfile = false;
  showNotifications = false;
  username = 'Пользователь'; // В будущем можно получать из сервиса
  notifications: any[] = [];
  private profileTimeout: any;
  private notificationsTimeout: any;

  constructor(private checkTokenService: CheckTokenService) {}

  ngOnInit(): void {
    this.checkTokenService.isAuthenticated.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }

  onProfileMouseEnter(): void {
    if (this.profileTimeout) {
      clearTimeout(this.profileTimeout);
    }
    this.showProfile = true;
  }

  onProfileMouseLeave(): void {
    this.profileTimeout = setTimeout(() => {
      this.showProfile = false;
    }, 100);
  }

  onNotificationsMouseEnter(): void {
    if (this.notificationsTimeout) {
      clearTimeout(this.notificationsTimeout);
    }
    this.showNotifications = true;
  }

  onNotificationsMouseLeave(): void {
    this.notificationsTimeout = setTimeout(() => {
      this.showNotifications = false;
    }, 100);
  }

  closeProfile(): void {
    this.showProfile = false;
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }
}
