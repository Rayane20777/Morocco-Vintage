import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Genre {
  id: number
  name: string
  selected: boolean
}

@Component({
  selector: "app-preferences",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-6 dark:text-white">Preferences</h2>
      
      <form (ngSubmit)="savePreferences()" class="space-y-8">
        <!-- Notification Preferences -->
        <div>
          <h3 class="text-lg font-medium mb-4 dark:text-white">Notification Preferences</h3>
          <div class="space-y-3">
            @for (notification of notificationPreferences; track notification.id) {
              <div class="flex items-center">
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input 
                      type="checkbox" 
                      class="sr-only" 
                      [(ngModel)]="notification.enabled" 
                      [name]="'notification_' + notification.id"
                    >
                    <div class="block bg-gray-200 dark:bg-gray-700 w-12 h-6 rounded-full"></div>
                    <div 
                      class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"
                      [ngClass]="{'transform translate-x-6 bg-teal': notification.enabled}"
                    ></div>
                  </div>
                  <div class="ml-3 text-gray-700 dark:text-gray-300">{{ notification.label }}</div>
                </label>
              </div>
            }
          </div>
        </div>
        
        <!-- Music Preferences -->
        <div>
          <h3 class="text-lg font-medium mb-4 dark:text-white">Music Preferences</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select your favorite genres to receive personalized recommendations
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            @for (genre of musicGenres; track genre.id) {
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  [id]="'genre_' + genre.id" 
                  [(ngModel)]="genre.selected" 
                  [name]="'genre_' + genre.id"
                  class="h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
                >
                <label [for]="'genre_' + genre.id" class="ml-2 block text-gray-700 dark:text-gray-300">
                  {{ genre.name }}
                </label>
              </div>
            }
          </div>
        </div>
        
        <!-- Display Preferences -->
        <div>
          <h3 class="text-lg font-medium mb-4 dark:text-white">Display Preferences</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Currency
              </label>
              <select 
                [(ngModel)]="displayPreferences.currency" 
                name="currency"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal focus:border-teal rounded-md dark:bg-dark-bg dark:border-gray-600 dark:text-white"
              >
                <option value="GBP">British Pound (£)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="JPY">Japanese Yen (¥)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Records per page
              </label>
              <select 
                [(ngModel)]="displayPreferences.recordsPerPage" 
                name="recordsPerPage"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal focus:border-teal rounded-md dark:bg-dark-bg dark:border-gray-600 dark:text-white"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Privacy Settings -->
        <div>
          <h3 class="text-lg font-medium mb-4 dark:text-white">Privacy Settings</h3>
          
          <div class="space-y-3">
            @for (setting of privacySettings; track setting.id) {
              <div class="flex items-center">
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input 
                      type="checkbox" 
                      class="sr-only" 
                      [(ngModel)]="setting.enabled" 
                      [name]="'privacy_' + setting.id"
                    >
                    <div class="block bg-gray-200 dark:bg-gray-700 w-12 h-6 rounded-full"></div>
                    <div 
                      class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"
                      [ngClass]="{'transform translate-x-6 bg-teal': setting.enabled}"
                    ></div>
                  </div>
                  <div class="ml-3 text-gray-700 dark:text-gray-300">{{ setting.label }}</div>
                </label>
              </div>
            }
          </div>
        </div>
        
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-teal hover:bg-teal/90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            [disabled]="isSaving"
          >
            <div class="flex items-center justify-center">
              <svg *ngIf="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Preferences' }}
            </div>
          </button>
        </div>
      </form>
      
      @if (showSuccess) {
        <div class="mt-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md animate-fade-in">
          Your preferences have been saved successfully!
        </div>
      }
    </div>
  `,
  styles: [
    `
    .dot {
      transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    `,
  ],
})
export class PreferencesComponent {
  isSaving = false
  showSuccess = false

  notificationPreferences = [
    { id: 1, label: "Email notifications for new releases", enabled: true },
    { id: 2, label: "Order status updates", enabled: true },
    { id: 3, label: "Price drop alerts for wishlist items", enabled: false },
    { id: 4, label: "Newsletter and promotional emails", enabled: false },
    { id: 5, label: "Artist tour announcements", enabled: true },
  ]

  musicGenres: Genre[] = [
    { id: 1, name: "Rock", selected: true },
    { id: 2, name: "Jazz", selected: false },
    { id: 3, name: "Classical", selected: false },
    { id: 4, name: "Hip Hop", selected: true },
    { id: 5, name: "Electronic", selected: false },
    { id: 6, name: "Blues", selected: false },
    { id: 7, name: "R&B", selected: true },
    { id: 8, name: "Country", selected: false },
    { id: 9, name: "Folk", selected: false },
  ]

  displayPreferences = {
    currency: "GBP",
    recordsPerPage: "24",
  }

  privacySettings = [
    { id: 1, label: "Share my collection with other users", enabled: true },
    { id: 2, label: "Allow recommendations based on my browsing history", enabled: true },
    { id: 3, label: "Show my profile in public search results", enabled: false },
  ]

  savePreferences() {
    this.isSaving = true

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false
      this.showSuccess = true

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccess = false
      }, 5000)
    }, 1500)

    console.log("Saving preferences:", {
      notifications: this.notificationPreferences,
      genres: this.musicGenres.filter((g) => g.selected).map((g) => g.name),
      display: this.displayPreferences,
      privacy: this.privacySettings,
    })
  }
}

