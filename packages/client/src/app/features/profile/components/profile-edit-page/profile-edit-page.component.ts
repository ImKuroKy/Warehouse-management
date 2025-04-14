import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit-page',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit-page.component.html',
  styleUrl: './profile-edit-page.component.css'
})
export class ProfileEditPageComponent implements OnInit {
  profileEditForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileEditForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      about: [''],
      avatar: [null],
      background: [null]
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
        next: (response) => {
            // Извлекаем данные из объекта response.data
            const profile = response.data;
            this.profileEditForm.patchValue({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                about: profile.about
            });
        },
        error: (error) => {
            console.error('Error loading profile', error);
        }
    });
}

  onFileSelect(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileEditForm.patchValue({
        [field]: input.files[0]
      });
    }
  }

  onSubmit(): void {
    if (this.profileEditForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileEditForm.get('name')?.value || '');
      formData.append('email', this.profileEditForm.get('email')?.value || '');
      formData.append('phone', this.profileEditForm.get('phone')?.value || '');
      formData.append('about', this.profileEditForm.get('about')?.value || '');
      
      if (this.profileEditForm.get('avatar')?.value) {
        formData.append('avatar', this.profileEditForm.get('avatar')?.value);
      }
      
      if (this.profileEditForm.get('background')?.value) {
        formData.append('background', this.profileEditForm.get('background')?.value);
      }

      this.profileService.updateUserProfile(formData).subscribe({
        next: (response) => {
          // Handle success response
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          // Handle error response
          console.error('Error updating profile', error);
        }
    });
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}