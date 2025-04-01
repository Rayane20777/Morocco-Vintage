import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Store } from '@ngrx/store'
import { logout } from '../../../store/auth/auth.actions'
import { UserService, UserProfile } from '../../../services/user.service'
import { selectAuthUser } from '../../../store/auth/auth.selectors'
import { take } from 'rxjs/operators'

@Component({
  selector: "app-account-settings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold dark:text-white">Account Settings</h2>
        <button 
          (click)="onLogout()"
          class="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            formControlName="username"
            [placeholder]="currentUser?.username || 'Enter your username'"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            [class.border-red-500]="profileForm.get('username')?.invalid && profileForm.get('username')?.touched"
          >
          <div *ngIf="profileForm.get('username')?.invalid && profileForm.get('username')?.touched" class="text-red-500 text-sm mt-1">
            Username must be between 3 and 50 characters
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            formControlName="firstName"
            [placeholder]="currentUser?.firstName || 'Enter your first name'"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            [class.border-red-500]="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched"
          >
          <div *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched" class="text-red-500 text-sm mt-1">
            First name must be between 2 and 50 characters
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            formControlName="lastName"
            [placeholder]="currentUser?.lastName || 'Enter your last name'"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            [class.border-red-500]="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched"
          >
          <div *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched" class="text-red-500 text-sm mt-1">
            Last name must be between 2 and 50 characters
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            formControlName="email"
            [placeholder]="currentUser?.email || 'Enter your email'"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            [class.border-red-500]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched"
          >
          <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
            Please enter a valid email address
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            formControlName="phoneNumber"
            [placeholder]="currentUser?.phoneNumber || 'Enter your phone number'"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            [class.border-red-500]="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched"
          >
          <div *ngIf="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched" class="text-red-500 text-sm mt-1">
            Please enter a valid phone number
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Image
          </label>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <img
                [src]="imagePreview || userService.getProfileImageUrl(currentUser?.imageId || '')"
                alt="Profile"
                class="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              >
              <label
                for="image"
                class="absolute bottom-0 right-0 bg-teal text-white rounded-full p-1.5 cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  id="image"
                  class="hidden"
                  accept="image/*"
                  (change)="onFileSelected($event)"
                >
              </label>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p>Upload a new profile picture</p>
              <p class="mt-1">Recommended: Square image, max 2MB</p>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            [disabled]="profileForm.invalid || isSubmitting"
            class="w-full bg-teal hover:bg-teal/90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>

      @if (showSuccess) {
        <div class="mt-4 p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg">
          Your profile has been updated successfully!
        </div>
      }

      @if (error) {
        <div class="mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
          {{ error }}
        </div>
      }
    </div>
  `,
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  error: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentUser: UserProfile | null = null;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private store: Store
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.currentUser = profile;
        // Set form values with user data
        this.profileForm.patchValue({
          username: profile.username || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || ''
        });
      },
      error: (error) => {
        this.error = 'Failed to load user profile';
        console.error('Error loading user profile:', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      this.error = null;
      this.showSuccess = false;

      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        formData.append(key, this.profileForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.userService.updateProfile(formData).subscribe({
        next: (response) => {
          this.currentUser = response;
          this.isSubmitting = false;
          this.showSuccess = true;
          this.selectedFile = null;
          this.imagePreview = null;
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
        },
        error: (error) => {
          this.error = error.message || 'Failed to update profile';
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}

