import { Component, Input, Output, EventEmitter, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { User } from "../../store/users/user.types"

@Component({
  selector: "app-edit-user-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" *ngIf="isOpen">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold dark:text-white">Edit User</h2>
          <button 
            (click)="onClose()" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div *ngIf="user" class="space-y-4">
          <!-- User Profile Image -->
          <div class="flex flex-col items-center mb-4">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
                <img 
                  *ngIf="imagePreview || user.imageUrl" 
                  [src]="imagePreview || user.imageUrl" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                >
                <div *ngIf="!imagePreview && !user.imageUrl" class="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <label for="profile-image" class="absolute bottom-0 right-0 bg-teal text-white rounded-full p-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input 
                  type="file" 
                  id="profile-image" 
                  class="hidden" 
                  accept="image/*" 
                  (change)="onImageSelected($event)"
                >
              </label>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.username }}</p>
          </div>

          <!-- User Details Form -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="editedUser.firstName"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal dark:bg-gray-700 dark:text-white"
              >
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="editedUser.lastName"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal dark:bg-gray-700 dark:text-white"
              >
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="editedUser.email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal dark:bg-gray-700 dark:text-white"
            >
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              [(ngModel)]="editedUser.phoneNumber"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal focus:border-teal dark:bg-gray-700 dark:text-white"
            >
          </div>

          <!-- User Roles -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roles</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="role-admin"
                  [checked]="hasRole('ADMIN')"
                  (change)="toggleRole('ADMIN', $event)"
                  class="h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
                >
                <label for="role-admin" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Admin
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="role-user"
                  [checked]="hasRole('USER')"
                  (change)="toggleRole('USER', $event)"
                  class="h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
                >
                <label for="role-user" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  User
                </label>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</label>
            <div class="flex items-center">
              <button
                (click)="editedUser.active = true"
                [class.bg-green-100]="editedUser.active"
                [class.text-green-800]="editedUser.active"
                [class.bg-gray-100]="!editedUser.active"
                [class.text-gray-800]="!editedUser.active"
                class="px-3 py-1 rounded-l-md border border-gray-300"
              >
                Active
              </button>
              <button
                (click)="editedUser.active = false"
                [class.bg-red-100]="!editedUser.active"
                [class.text-red-800]="!editedUser.active"
                [class.bg-gray-100]="editedUser.active"
                [class.text-gray-800]="editedUser.active"
                class="px-3 py-1 rounded-r-md border border-gray-300 border-l-0"
              >
                Inactive
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              (click)="onClose()"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
            >
              Cancel
            </button>
            <button
              (click)="onSave()"
              class="px-4 py-2 bg-teal hover:bg-teal/90 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal"
              [disabled]="loading"
            >
              <span *ngIf="!loading">Save Changes</span>
              <span *ngIf="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class EditUserModalComponent implements OnInit {
  @Input() isOpen = false
  @Input() user: User | null = null
  @Input() loading = false

  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<{ user: User; image?: File }>()

  editedUser: User = {
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    active: true,
    roles: [],
  }

  imagePreview: string | ArrayBuffer | null = null
  selectedImage: File | null = null

  ngOnInit(): void {
    this.resetForm()
  }

  ngOnChanges(): void {
    this.resetForm()
  }

  resetForm(): void {
    if (this.user) {
      this.editedUser = { ...this.user }
      this.imagePreview = null
      this.selectedImage = null
    }
  }

  onClose(): void {
    this.close.emit()
  }

  onSave(): void {
    this.save.emit({
      user: this.editedUser,
      image: this.selectedImage || undefined,
    })
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.selectedImage = file
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  hasRole(role: string): boolean {
    return this.editedUser.roles.includes(role)
  }

  toggleRole(role: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked

    if (checked && !this.hasRole(role)) {
      this.editedUser.roles = [...this.editedUser.roles, role]
    } else if (!checked && this.hasRole(role)) {
      this.editedUser.roles = this.editedUser.roles.filter((r) => r !== role)
    }
  }
}

