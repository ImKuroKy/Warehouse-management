import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationUser} from '../../../core/models/organization-user.model';
import { AuthService, User } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user-role.model';
import { HttpErrorResponse } from '@angular/common/http';

interface ServerError {
  error: string;
  message?: string;
}

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
  inviteNickname = '';

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
    this.organizationService.getOrganizationUsers(this.organizationId).subscribe({
      next: users => {
        this.users = users;
        this.filterUsers();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        this.inviteError = 'Ошибка при загрузке списка пользователей';
      }
    });
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: user => {
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
      error: (error: HttpErrorResponse) => {
        console.error('Error loading current user:', error);
        this.inviteError = 'Ошибка при загрузке данных текущего пользователя';
      }
    });
  }

  loadCurrentUserRole(): void {
    this.authService.getCurrentUserRole(this.organizationId).subscribe({
      next: role => {
        this.currentUserRole = role;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading current user role:', error);
        this.inviteError = 'Ошибка при загрузке роли пользователя';
      }
    });
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
    this.inviteError = '';
    this.inviteNickname = '';
  }

  inviteUser(): void {
    if (!this.inviteNickname.trim()) {
      this.inviteError = 'Введите никнейм пользователя';
      return;
    }

    this.organizationService.inviteUser(this.organizationId, this.inviteNickname).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.filterUsers();
        this.showInviteForm = false;
        this.inviteNickname = '';
        this.inviteError = '';
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error response:', error);
        const serverError = error.error as ServerError;
        if (error.status === 400) {
          this.inviteError = serverError.error || 'Ошибка при приглашении пользователя';
        } else if (error.status === 403) {
          this.inviteError = 'У вас нет прав для приглашения пользователей';
        } else if (error.status === 404) {
          this.inviteError = 'Пользователь не найден';
        } else {
          this.inviteError = 'Произошла ошибка при приглашении пользователя';
        }
      }
    });
  }

  promoteUser(userId: string): void {
    this.organizationService.promoteUser(this.organizationId, userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error promoting user:', error);
        this.inviteError = 'Ошибка при повышении пользователя';
      }
    });
  }

  demoteUser(userId: string): void {
    this.organizationService.demoteUser(this.organizationId, userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error demoting user:', error);
        this.inviteError = 'Ошибка при понижении пользователя';
      }
    });
  }

  removeUser(userId: string): void {
    this.organizationService.removeUser(this.organizationId, userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error removing user:', error);
        this.inviteError = 'Ошибка при удалении пользователя';
      }
    });
  }
} 