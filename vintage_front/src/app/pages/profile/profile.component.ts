import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router"
import { UserService, UserProfile } from "../../services/user.service"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>
      
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="w-full md:w-64">
          <!-- User Profile Card -->
          <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 text-center mb-6">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <img
                [src]="userService.getProfileImageUrl(currentUser?.imageId || '')"
                alt="Profile"
                class="w-full h-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                onerror="this.src='assets/images/default-avatar.png'"
              >
            </div>
            <h2 class="text-xl font-semibold mb-2 dark:text-white">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ currentUser?.email }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ currentUser?.username }}</p>
          </div>

          <!-- Navigation -->
          <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
            <nav class="space-y-2">
              <a
                routerLink="orders"
                routerLinkActive="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                class="block px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Orders
              </a>
              <a
                routerLink="settings"
                routerLinkActive="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                class="block px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Settings
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  currentUser: UserProfile | null = null;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.currentUser = profile;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }
}

