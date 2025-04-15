import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService, Organization } from '../../services/organization.service';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  hasOrganization = false;
  organization: Organization | null = null;

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganization();
  }

  loadOrganization(): void {
    this.organizationService.getUserOrganization().subscribe({
      next: (org: Organization | null) => {
        this.organization = org;
        this.hasOrganization = !!org;
      },
      error: (error: Error) => {
        console.error('Error loading organization:', error);
      }
    });
  }

  createOrganization(): void {
    this.router.navigate(['/organization/create']);
  }

  navigateToUsers(): void {
    if (this.organization) {
      this.router.navigate(['/organization', this.organization.id, 'users']);
    }
  }
} 