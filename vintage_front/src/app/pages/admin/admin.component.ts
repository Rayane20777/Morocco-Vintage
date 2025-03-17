import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside 
        class="bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out overflow-hidden"
        [class.w-64]="!sidebarCollapsed"
        [class.w-16]="sidebarCollapsed"
      >
        <div class="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div class="flex items-center gap-2" [class.justify-center]="sidebarCollapsed">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h1 *ngIf="!sidebarCollapsed" class="text-xl font-semibold text-gray-800 dark:text-white">Vinyl Vault</h1>
          </div>
          <button 
            (click)="toggleSidebar()" 
            class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            [class.rotate-180]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <nav class="mt-4">
          <div class="px-4 mb-3" *ngIf="!sidebarCollapsed">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Main</p>
          </div>
          <a 
            routerLink="./dashboard" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Dashboard</span>
          </a>
          
          <div class="px-4 mt-6 mb-3" *ngIf="!sidebarCollapsed">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store Management</p>
          </div>
          <a 
            routerLink="./products" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Products</span>
          </a>
          <a 
            routerLink="./orders" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Orders</span>
          </a>
          <a 
            routerLink="./customers" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Customers</span>
          </a>
          
          <div class="px-4 mt-6 mb-3" *ngIf="!sidebarCollapsed">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reports</p>
          </div>
          <a 
            routerLink="./analytics" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Analytics</span>
          </a>
          
          <div class="px-4 mt-6 mb-3" *ngIf="!sidebarCollapsed">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">System</p>
          </div>
          <a 
            routerLink="/admin/settings" 
            routerLinkActive="bg-teal/10 text-teal"
            [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            [class.justify-center]="sidebarCollapsed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="ml-3" *ngIf="!sidebarCollapsed">Settings</span>
          </a>
        </nav>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div class="flex items-center justify-between h-16 px-6">
            <div class="flex items-center">
              <button 
                (click)="toggleSidebar()" 
                class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Admin Dashboard</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()" 
                  class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <div class="h-8 w-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-medium">
                    A
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">Admin User</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  *ngIf="userMenuOpen" 
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700"
                >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                  <div class="border-t dark:border-gray-700"></div>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Sign out</a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Main content area -->
        <main class="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
    /* Custom scrollbar for webkit browsers */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    /* For Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #888 #f1f1f1;
    }
  `,
  ],
})
export class AdminComponent {
  sidebarCollapsed = false
  userMenuOpen = false

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen
  }
}

