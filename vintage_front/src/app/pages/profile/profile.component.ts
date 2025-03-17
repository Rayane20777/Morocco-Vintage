import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 dark:text-white">My Profile</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Left Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white dark:bg-dark-card rounded-lg p-6 text-center mb-6">
            <div class="w-24 h-24 bg-[#E5F7F7] rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold mb-2 dark:text-white">John Doe</h2>
            <p class="text-gray-600 dark:text-gray-400">john.doeexample.com</p>
          </div>

          <nav class="bg-white dark:bg-dark-card rounded-lg p-4">
            <ul class="space-y-2">
              <li>
                <a routerLink="overview" routerLinkActive="bg-teal/10 text-teal" class="block px-4 py-2 rounded-md hover:bg-teal/5 transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a routerLink="orders" routerLinkActive="bg-teal/10 text-teal" class="block px-4 py-2 rounded-md hover:bg-teal/5 transition-colors">
                  Orders
                </a>
              </li>
              <li>
                <a routerLink="settings" routerLinkActive="bg-teal/10 text-teal" class="block px-4 py-2 rounded-md hover:bg-teal/5 transition-colors">
                  Settings
                </a>
              </li>
              <li>
                <a routerLink="preferences" routerLinkActive="bg-teal/10 text-teal" class="block px-4 py-2 rounded-md hover:bg-teal/5 transition-colors">
                  Preferences
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-3">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent {}

