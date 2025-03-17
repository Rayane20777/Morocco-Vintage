import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"

interface CartItem {
  id: number
  title: string
  artist: string
  price: number
  format: string
  condition: string
  image: string
}

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-cream">
      <div class="container mx-auto px-4 py-8 md:py-12">
        <h1 class="text-2xl md:text-3xl font-bold mb-6 relative inline-block">
          Your Cart
          <span class="absolute -bottom-1 left-0 w-1/2 h-1 bg-teal"></span>
        </h1>

        @if (cartItems.length > 0) {
          <div class="grid md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div class="p-4 border-b flex justify-between items-center">
                  <h2 class="font-semibold text-lg">Cart Items ({{ cartItems.length }})</h2>
                  <div class="relative w-48">
                    <input
                      type="text"
                      [(ngModel)]="searchTerm"
                      (ngModelChange)="filterItems()"
                      placeholder="Search items..."
                      class="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                @for (item of filteredItems; track item.id) {
                  <div class="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <div class="flex items-start gap-4">
                      <div class="relative group">
                        <div class="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-md shadow-sm">
                          <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover">
                        </div>
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center">
                          <a [routerLink]="['/release', item.id]" class="opacity-0 group-hover:opacity-100 bg-white text-black text-xs px-2 py-1 rounded transform scale-90 group-hover:scale-100 transition-all duration-300">
                            Quick View
                          </a>
                        </div>
                      </div>
                      
                      <div class="flex-grow">
                        <div class="flex justify-between">
                          <div>
                            <h3 class="font-medium">{{ item.title }}</h3>
                            <p class="text-gray-600 text-sm">{{ item.artist }}</p>
                            <div class="mt-1 space-y-1">
                              <p class="text-xs text-gray-500">{{ item.format }}</p>
                              <p class="text-xs text-gray-500">Condition: {{ item.condition }}</p>
                            </div>
                          </div>
                          <div class="text-right">
                            <p class="font-medium">£{{ item.price.toFixed(2) }}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        (click)="removeItem(item.id)" 
                        class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
              
              <div class="flex justify-between items-center">
                <a routerLink="/browse" class="inline-flex items-center text-teal hover:text-teal/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </a>
                <button 
                  (click)="clearCart()" 
                  class="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>

            <div class="md:col-span-1">
              <div class="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
                <div class="p-4 border-b">
                  <h2 class="font-semibold text-lg">Order Summary</h2>
                </div>
                
                <div class="p-4 space-y-4">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal ({{ cartItems.length }} items)</span>
                    <span class="font-medium">£{{ subtotal.toFixed(2) }}</span>
                  </div>
                  
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Shipping</span>
                    <span class="font-medium">£{{ shipping.toFixed(2) }}</span>
                  </div>
                  
                  <div class="pt-4 border-t">
                    <div class="flex justify-between">
                      <span class="font-semibold">Total</span>
                      <span class="font-bold text-lg">£{{ total.toFixed(2) }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Including VAT</p>
                  </div>
                  
                  <button class="w-full bg-teal hover:bg-teal/90 text-white px-4 py-3 rounded-md font-medium transition-transform hover:scale-105">
                    Proceed to Checkout
                  </button>
                </div>
                
                <div class="p-4 bg-teal/5 border-t">
                  <div class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p class="text-xs text-gray-600">
                      Your payment information is always secure. We use industry standard encryption to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="w-24 h-24 mx-auto mb-6 bg-teal/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p class="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any vinyl to your cart yet. Explore our collection and find your next favorite record!
            </p>
            <a 
              routerLink="/browse" 
              class="inline-flex items-center bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Browse Collection
            </a>
            
            <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 border rounded-lg">
                <h3 class="font-medium mb-2">New Arrivals</h3>
                <p class="text-sm text-gray-600 mb-3">Check out our latest vinyl additions</p>
                <a routerLink="/browse" class="text-sm text-teal hover:underline">View New Arrivals</a>
              </div>
              <div class="p-4 border rounded-lg">
                <h3 class="font-medium mb-2">Best Sellers</h3>
                <p class="text-sm text-gray-600 mb-3">Our most popular records this month</p>
                <a routerLink="/browse" class="text-sm text-teal hover:underline">View Best Sellers</a>
              </div>
              <div class="p-4 border rounded-lg">
                <h3 class="font-medium mb-2">Pre-Orders</h3>
                <p class="text-sm text-gray-600 mb-3">Reserve upcoming releases today</p>
                <a routerLink="/browse" class="text-sm text-teal hover:underline">View Pre-Orders</a>
              </div>
              <div class="p-4 border rounded-lg">
                <h3 class="font-medium mb-2">Equipment</h3>
                <p class="text-sm text-gray-600 mb-3">Turntables, speakers, and accessories</p>
                <a routerLink="/equipment" class="text-sm text-teal hover:underline">Shop Equipment</a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      title: "Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 29.99,
      format: "Vinyl, LP, Album, Remastered",
      condition: "New",
      image: "/assets/placeholder.svg",
    },
    {
      id: 2,
      title: "Rumours",
      artist: "Fleetwood Mac",
      price: 27.99,
      format: "Vinyl, LP, Album, Reissue",
      condition: "New",
      image: "/assets/placeholder.svg",
    },
    {
      id: 3,
      title: "Thriller",
      artist: "Michael Jackson",
      price: 24.99,
      format: "Vinyl, LP, Album, Special Edition",
      condition: "New",
      image: "/assets/placeholder.svg",
    },
  ]

  filteredItems: CartItem[] = [...this.cartItems]
  searchTerm = ""

  get subtotal(): number {
    return this.filteredItems.reduce((sum, item) => sum + item.price, 0)
  }

  shipping = 5.99

  get total(): number {
    return this.subtotal + this.shipping
  }

  removeItem(id: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== id)
    this.filterItems()
  }

  clearCart(): void {
    if (confirm("Are you sure you want to clear your cart?")) {
      this.cartItems = []
      this.filterItems()
    }
  }

  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.cartItems]
    } else {
      const searchTermLower = this.searchTerm.toLowerCase()
      this.filteredItems = this.cartItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTermLower) || item.artist.toLowerCase().includes(searchTermLower),
      )
    }
  }
}

