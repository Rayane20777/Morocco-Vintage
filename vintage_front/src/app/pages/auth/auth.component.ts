import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, RouterOutlet } from "@angular/router"

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-300">
      <div class="container mx-auto px-4 py-12">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [],
})
export class AuthComponent {}

