import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="sticky top-0 z-50 bg-cream border-b border-black/10">
      <div class="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <div class="flex items-center gap-2 md:gap-4">
          <button class="md:hidden">
            <span class="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <a routerLink="/" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span class="text-xl font-bold tracking-tight">Vintage Maroc</span>
          </a>
        </div>

        <nav class="hidden md:flex items-center gap-6">
          <a routerLink="/" class="text-sm font-medium hover:text-teal transition-colors">Home</a>
          <a routerLink="/browse" class="text-sm font-medium hover:text-teal transition-colors">Vinyls</a>
          <a routerLink="/equipment" class="text-sm font-medium hover:text-teal transition-colors">Equipment</a>
          <a routerLink="/antiques" class="text-sm font-medium hover:text-teal transition-colors">Antiques</a>
        </nav>

        <div class="flex items-center gap-2">
          @if (isAuthenticated$ | async) {
            <div class="relative">
              <button (click)="toggleProfileMenu()" class="hover:text-teal transition-colors">
                <span class="sr-only">Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              @if (showProfileMenu) {
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a routerLink="/profile/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</a>
                  <a routerLink="/profile/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <div class="border-t"></div>
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login">
              <span class="sr-only">Login</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </a>
          }
          <a routerLink="/cart" class="relative">
            <span class="sr-only">Cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  showProfileMenu = false;

  constructor(private store: Store) {}

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.showProfileMenu = false;
  }
}

