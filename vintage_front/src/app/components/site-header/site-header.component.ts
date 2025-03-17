import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-site-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-cream border-b border-black/10">
      <div class="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <div class="flex items-center gap-2 md:gap-4">
          <button class="md:hidden" (click)="toggleMobileMenu()">
            <span class="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="relative h-10 w-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-teal group-hover:animate-spin-slow transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <div class="absolute inset-0 border-2 border-transparent rounded-full group-hover:border-teal/30 group-hover:scale-110 transition-all duration-500"></div>
            </div>
            <span class="text-xl font-bold tracking-tight">VINYL VAULT</span>
          </a>
        </div>

        <nav class="hidden md:flex items-center gap-6">
          <a routerLink="/" class="text-sm font-medium hover:text-teal transition-colors relative group">
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
          </a>
          <a routerLink="/browse" class="text-sm font-medium hover:text-teal transition-colors relative group">
            Vinyls
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
          </a>
          <a routerLink="/equipment" class="text-sm font-medium hover:text-teal transition-colors relative group">
            Equipment
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
          </a>
          <a routerLink="/antiques" routerLinkActive="bg-teal/10 text-teal" class="text-sm font-medium hover:text-teal transition-colors relative group">
            Antiques
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal group-hover:w-full transition-all duration-300"></span>
          </a>
        
        </nav>

        <div class="flex items-center gap-3">
          <button class="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <span class="sr-only">Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <a routerLink="/auth" class="p-1.5 rounded-full hover:bg-gray-200 transition-colors relative group">
            <span class="sr-only">Login/Register</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Login/Register</span>
          </a>
          <a routerLink="/profile" class="p-1.5 rounded-full hover:bg-gray-200 transition-colors relative group">
            <span class="sr-only">Profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Profile</span>
          </a>
          <button class="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <span class="sr-only">Wishlist</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <a routerLink="/cart" class="relative p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <span class="sr-only">Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal text-[10px] font-bold flex items-center justify-center text-white">
              3
            </span>
          </a>
        </div>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="showMobileMenu" class="md:hidden absolute top-16 left-0 right-0 bg-cream border-b border-black/10 shadow-lg z-50 transition-all duration-300">
        <nav class="container mx-auto px-4 py-4 flex flex-col gap-4">
          <a routerLink="/" class="text-sm font-medium hover:text-teal transition-colors">Home</a>
          <a routerLink="/browse" class="text-sm font-medium hover:text-teal transition-colors">Vinyls</a>
          <a routerLink="/equipment" class="text-sm font-medium hover:text-teal transition-colors">Equipment</a>
          <a routerLink="/antiques/1" class="text-sm font-medium hover:text-teal transition-colors">Antique Detail</a>
          <a routerLink="/cart" class="text-sm font-medium hover:text-teal transition-colors">Cart</a>
          <a routerLink="/auth" class="text-sm font-medium hover:text-teal transition-colors">Login/Register</a>
          <a routerLink="/profile" class="text-sm font-medium hover:text-teal transition-colors">Profile</a>
        </nav>
      </div>
    </header>
  `,
  styles: [],
})
export class SiteHeaderComponent {
  showMobileMenu = false

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu
  }
}

