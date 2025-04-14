import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CheckTokenService } from '../../services/checkToken.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(private checkTokenService: CheckTokenService) {}

  ngOnInit(): void {
    this.checkTokenService.isAuthenticated.subscribe(
      (isAuthenticated) => (this.isAuthenticated = isAuthenticated)
    );
  }
}
