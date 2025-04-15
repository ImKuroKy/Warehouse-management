import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-create-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {
  organizationForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    public router: Router
  ) {
    this.organizationForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Zа-яА-Я0-9\s\-_]+$/)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.organizationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const { name, description } = this.organizationForm.value;

      this.organizationService.createOrganization(name, description).subscribe({
        next: () => {
          this.router.navigate(['/organization']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Произошла ошибка при создании организации';
        }
      });
    }
  }

  get name() {
    return this.organizationForm.get('name');
  }

  get description() {
    return this.organizationForm.get('description');
  }
} 