import { Component, OnInit } from "@angular/core"
import { RouterOutlet, Router, NavigationEnd } from "@angular/router"
import { CommonModule } from "@angular/common"
import { SiteHeaderComponent } from "./components/site-header/site-header.component"
import { SiteFooterComponent } from "./components/site-footer/site-footer.component"
import { filter, tap } from "rxjs/operators"
import { HeaderComponent } from "./components/header/header.component"
import { Store } from "@ngrx/store"
import { selectIsAuthenticated } from "./store/auth/auth.selectors"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SiteHeaderComponent, SiteFooterComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-cream flex flex-col" [class.admin-layout]="isAdminRoute">
      <ng-container *ngIf="!isAdminRoute">
        <app-header *ngIf="isAuthenticated$ | async"></app-header>
        <app-site-header *ngIf="!(isAuthenticated$ | async)"></app-site-header>
        <main class="flex-grow">
          <router-outlet></router-outlet>
        </main>
        <app-site-footer></app-site-footer>
      </ng-container>
      
      <ng-container *ngIf="isAdminRoute">
        <router-outlet></router-outlet>
      </ng-container>
    </div>
  `,
  styles: [
    `
    .admin-layout {
      background-color: #f3f4f6;
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  title = "Vinyl Vault"
  isAdminRoute = false
  isAuthenticated$ = this.store
    .select(selectIsAuthenticated)
    .pipe(tap((isAuth) => console.log("App component - isAuthenticated:", isAuth)))

  constructor(
    private router: Router,
    private store: Store,
  ) {
    // Subscribe to router events to detect when we're on admin routes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: any) => console.log("Navigation event:", event.url)),
      )
      .subscribe((event: NavigationEnd) => {
        this.isAdminRoute = event.url.startsWith("/admin")
        console.log("Is admin route:", this.isAdminRoute)
      })
  }

  ngOnInit() {
    console.log("App component initialized")

    // Log authentication state changes
    this.isAuthenticated$.subscribe((isAuth) => {
      console.log("Authentication state changed:", isAuth)
    })
  }
}

