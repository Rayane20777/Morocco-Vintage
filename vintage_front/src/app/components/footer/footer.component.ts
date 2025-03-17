import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-black text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span class="text-lg font-bold">VINYL VAULT</span>
            </div>
            <p class="text-gray-400 text-sm">Your destination for premium vinyl records and audio equipment.</p>
          </div>

          <div>
            <h3 class="font-medium mb-4">Shop</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a routerLink="/browse" class="hover:text-teal transition-colors">New Arrivals</a></li>
              <li><a routerLink="/browse" class="hover:text-teal transition-colors">Best Sellers</a></li>
              <li><a routerLink="/browse" class="hover:text-teal transition-colors">Pre-Orders</a></li>
              <li><a routerLink="/browse" class="hover:text-teal transition-colors">Used Vinyl</a></li>
              <li><a routerLink="/equipment" class="hover:text-teal transition-colors">Equipment</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium mb-4">Help</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-teal transition-colors">FAQs</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Shipping</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Returns</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Track Order</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium mb-4">Connect</h3>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-teal transition-colors">Instagram</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Twitter</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Facebook</a></li>
              <li><a href="#" class="hover:text-teal transition-colors">Spotify</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">© {{ currentYear }} Vinyl Vault. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-sm text-gray-400 hover:text-teal transition-colors">Privacy Policy</a>
            <a href="#" class="text-sm text-gray-400 hover:text-teal transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {
  currentYear = new Date().getFullYear()
}

