import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationUser} from '../../../core/models/organization-user.model';
import { AuthService, User } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-role.model';

@Component({
  selector: 'app-organization-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss']
})
export class OrganizationUsersComponent implements OnInit {
  users: OrganizationUser[] = [];
  filteredUsers: OrganizationUser[] = [];
  searchTerm = '';
  organizationId = '';
  currentUser: User | null = null;
  currentUserRole: UserRole | null = null;
  showInviteForm = false;
  inviteError = '';
  inviteEmail = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('organizationId');
      if (id) {
        this.organizationId = id;
        this.loadUsers();
        this.loadCurrentUser();
        this.loadCurrentUserRole();
      } else {
        console.error('No organization ID provided in route');
      }
    });
  }

  loadUsers(): void {
    this.organizationService.getOrganizationUsers(this.organizationId).subscribe(
      users => {
        this.users = users;
        this.filterUsers();
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        if (user && !this.users.some(u => u.id === user.id)) {
          this.users.push({
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'member'
          });
          this.filterUsers();
        }
      },
      error => {
        console.error('Error loading current user:', error);
      }
    );
  }

  loadCurrentUserRole(): void {
    this.authService.getCurrentUserRole(this.organizationId).subscribe(
      role => {
        this.currentUserRole = role;
      },
      error => {
        console.error('Error loading current user role:', error);
      }
    );
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    this.filterUsers();
  }

  isCreator(): boolean {
    return this.currentUserRole === 'creator';
  }

  toggleInviteForm(): void {
    this.showInviteForm = !this.showInviteForm;
    if (!this.showInviteForm) {
      this.inviteEmail = '';
      this.inviteError = '';
    }
  }

  inviteUser(): void {
    if (!this.inviteEmail) {
      this.inviteError = 'Пожалуйста, введите никнейм пользователя';
      return;
    }

    this.organizationService.inviteUser(this.organizationId, this.inviteEmail).subscribe(
      () => {
        this.loadUsers();
        this.toggleInviteForm();
      },
      error => {
        this.inviteError = error.message || 'Ошибка при приглашении пользователя';
      }
    );
  }

  promoteUser(userId: string): void {
    this.organizationService.promoteUser(this.organizationId, userId).subscribe(
      () => this.loadUsers(),
      error => console.error('Error promoting user:', error)
    );
  }

  demoteUser(userId: string): void {
    this.organizationService.demoteUser(this.organizationId, userId).subscribe(
      () => this.loadUsers(),
      error => console.error('Error demoting user:', error)
    );
  }

  removeUser(userId: string): void {
    this.organizationService.removeUser(this.organizationId, userId).subscribe(
      () => this.loadUsers(),
      error => console.error('Error removing user:', error)
    );
  }
} 