import { Component, OnInit } from "@angular/core"
import { RouterOutlet, Router, NavigationEnd } from "@angular/router"
import { CommonModule } from "@angular/common"
import { SiteHeaderComponent } from "./components/site-header/site-header.component"
import { SiteFooterComponent } from "./components/site-footer/site-footer.component"
import { filter } from "rxjs/operators"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <div class="min-h-screen bg-cream flex flex-col" [class.admin-layout]="isAdminRoute">
      <ng-container *ngIf="!isAdminRoute">
        <app-site-header></app-site-header>
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

  constructor(private router: Router) {
    // Subscribe to router events to detect when we're on admin routes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith("/admin")
    })
  }

  ngOnInit() {
    // Remove any dark mode related logic
  }
}

