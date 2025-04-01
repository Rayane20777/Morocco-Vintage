import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, FormControl } from "@angular/forms"
import { CartService, CartItem, ShippingDetails, OrderSummary } from "../../services/cart.service"
import { Observable } from "rxjs"
import { take } from "rxjs/operators"
import { Product } from "../../store/products/product.types"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-cream py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">Your Cart</h1>

        @if ((cartItems$ | async)?.length === 0) {
          <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 class="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p class="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <a routerLink="/browse" class="bg-teal text-white px-6 py-3 rounded-md font-medium hover:bg-teal/90 transition-colors">
              Browse Products
            </a>
          </div>
        } @else {
          <!-- Search bar -->
          <div class="mb-6">
            <div class="relative">
              <input 
                type="text" 
                [formControl]="searchControl"
                placeholder="Search items in your cart..." 
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              @if (searchControl.value) {
                <button 
                  (click)="clearSearch()" 
                  class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-6 border-b flex justify-between items-center">
                  <h2 class="text-xl font-semibold">Items ({{ filteredItems.length }})</h2>
                  @if (searchControl.value && filteredItems.length !== (cartItems$ | async)?.length) {
                    <span class="text-sm text-gray-500">
                      Showing {{ filteredItems.length }} of {{ (cartItems$ | async)?.length }} items
                    </span>
                  }
                </div>
                
                @if (filteredItems.length === 0 && searchControl.value) {
                  <div class="p-8 text-center">
                    <p class="text-gray-500">No items match your search "{{ searchControl.value }}"</p>
                    <button 
                      (click)="clearSearch()" 
                      class="mt-2 text-teal hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                } @else {
                  <div class="divide-y">
                    @for (item of filteredItems; track item.id) {
                      <div class="p-6 flex flex-col md:flex-row gap-4" [class.opacity-60]="!isProductAvailable(item.product)">
                        <div class="w-full md:w-24 h-24 flex-shrink-0 relative">
                          <img 
                            [src]="getImageUrl(item.product)"
                            [alt]="item.product?.name ?? 'Product image'"
                            class="w-full h-full object-cover rounded"
                          >
                          @if (!isProductAvailable(item.product)) {
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                              <span class="text-white font-medium px-2 py-1 bg-red-500 rounded text-xs">SOLD OUT</span>
                            </div>
                          }
                        </div>
                        <div class="flex-grow">
                          <div class="flex justify-between mb-2">
                            <h3 class="font-semibold">{{ item.product?.name ?? 'Unnamed Product' }}</h3>
                            <span class="font-bold">£{{ (item.product?.price ?? 0).toFixed(2) }}</span>
                          </div>
                          <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ item.product?.description ?? 'No description available' }}</p>
                          <div class="flex justify-between items-center">
                            <div class="flex items-center">
                              @if (!isProductAvailable(item.product)) {
                                <span class="text-red-500 text-sm font-medium">This item is currently unavailable</span>
                              } @else {
                                <span class="text-green-600 text-sm font-medium">In stock</span>
                              }
                            </div>
                            <button 
                              (click)="removeFromCart(item.id)" 
                              class="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
            
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
                
                <!-- Simplified order summary without shipping fee -->
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-medium">£{{ getSubtotal().toFixed(2) }}</span>
                  </div>
                  
                  <div class="border-t pt-3 flex justify-between">
                    <span class="font-semibold">Total</span>
                    <span class="font-bold text-lg">£{{ getTotal().toFixed(2) }}</span>
                  </div>
                </div>
                
                @if (!areAllProductsAvailable()) {
                  <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                    <p class="text-sm">Some items in your cart are currently sold out. Please remove them before proceeding to checkout.</p>
                  </div>
                }
                
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-2">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        [checked]="includeShipping"
                        (change)="toggleShipping($event)"
                        class="mr-2 h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
                      >
                      <span>Deliver to my address</span>
                    </label>
                  </div>
                  
                  @if (includeShipping) {
                    <form [formGroup]="shippingForm" class="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input 
                          type="text" 
                          formControlName="address"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                          placeholder="Enter your address"
                        >
                        @if (shippingForm.get('address')?.invalid && shippingForm.get('address')?.touched) {
                          <p class="text-red-500 text-xs mt-1">Address is required</p>
                        }
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input 
                          type="text" 
                          formControlName="city"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                          placeholder="Enter your city"
                        >
                        @if (shippingForm.get('city')?.invalid && shippingForm.get('city')?.touched) {
                          <p class="text-red-500 text-xs mt-1">City is required</p>
                        }
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          formControlName="postalCode"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                          placeholder="Enter your postal code"
                        >
                        @if (shippingForm.get('postalCode')?.invalid && shippingForm.get('postalCode')?.touched) {
                          <p class="text-red-500 text-xs mt-1">Postal code is required</p>
                        }
                      </div>
                    </form>
                  } @else {
                    <div class="mt-2 text-sm text-gray-600">
                      You can pick up your order at our shop or pay cash on delivery.
                    </div>
                  }
                </div>
                
                <button 
                  (click)="checkout()" 
                  class="w-full bg-teal text-white py-3 rounded-md font-medium hover:bg-teal/90 transition-colors"
                  [disabled]="getSubtotal() === 0 || (includeShipping && !shippingForm.valid) || !areAllProductsAvailable()"
                  [ngClass]="{'opacity-50 cursor-not-allowed': getSubtotal() === 0 || (includeShipping && !shippingForm.valid) || !areAllProductsAvailable()}"
                >
                  Proceed to Checkout
                </button>
                
                @if (includeShipping && !shippingForm.valid) {
                  <p class="text-red-500 text-xs mt-2 text-center">Please fill in all shipping details</p>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    `,
  ],
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>
  orderSummary$: Observable<OrderSummary>
  shippingForm: FormGroup
  searchControl = new FormControl("")
  includeShipping = false
  filteredItems: CartItem[] = []

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
  ) {
    this.cartItems$ = this.cartService.getCartItems()
    this.orderSummary$ = this.cartService.getOrderSummary()

    this.shippingForm = this.fb.group({
      address: ["", Validators.required],
      city: ["", Validators.required],
      postalCode: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.cartService.refreshCartProducts()

    // Initialize shipping settings
    this.cartService
      .getCartSettings()
      .pipe(take(1))
      .subscribe((settings) => {
        this.includeShipping = settings.includeShipping
        if (settings.shippingDetails) {
          this.shippingForm.patchValue({
            address: settings.shippingDetails.address,
            city: settings.shippingDetails.city,
            postalCode: settings.shippingDetails.postalCode,
          })
        }
      })

    // Update shipping details when form changes
    this.shippingForm.valueChanges.subscribe((values) => {
      this.cartService.updateShippingDetails(values as ShippingDetails)
    })

    // Initialize filtered items
    this.cartItems$.subscribe((items) => {
      this.filteredItems = items
    })

    // Set up search filtering
    this.searchControl.valueChanges.subscribe((searchTerm) => {
      this.filterItems(searchTerm || "")
    })
  }

  filterItems(searchTerm: string): void {
    if (!searchTerm.trim()) {
      // If search is empty, show all items
      this.cartItems$.pipe(take(1)).subscribe((items) => {
        this.filteredItems = items
      })
      return
    }

    const term = searchTerm.toLowerCase().trim()
    this.cartItems$.pipe(take(1)).subscribe((items) => {
      this.filteredItems = items.filter(
        (item) =>
          item.product?.name?.toLowerCase().includes(term) ||
          item.product?.description?.toLowerCase().includes(term) ||
          item.product?.type?.toLowerCase().includes(term),
      )
    })
  }

  clearSearch(): void {
    this.searchControl.setValue("")
  }

  removeFromCart(id: string): void {
    this.cartService.removeFromCart(id)
    // Re-apply search filter after removing item
    this.filterItems(this.searchControl.value || "")
  }

  toggleShipping(event: Event): void {
    const includeShipping = (event.target as HTMLInputElement).checked
    this.includeShipping = includeShipping
    this.cartService.updateShippingOption(includeShipping)
  }

  checkout(): void {
    // Check if all products are available
    if (!this.areAllProductsAvailable()) {
      alert("Some items in your cart are currently sold out. Please remove them before proceeding to checkout.")
      return
    }

    // Check if shipping details are valid if shipping is included
    if (this.includeShipping && !this.shippingForm.valid) {
      alert("Please fill in all shipping details before proceeding to checkout.")
      return
    }

    // Get current user ID from auth service
    this.cartService.submitOrder('current-user-id').subscribe({
      next: (response) => {
        alert('Order placed successfully!')
        this.cartService.clearCart()
      },
      error: (error) => {
        console.error('Error placing order:', error)
        alert('Failed to place order. Please try again.')
      }
    })
  }

  isProductAvailable(product?: Product): boolean {
    if (!product) return false
    return product.status === "AVAILABLE" || product.status === "IN_STOCK" || product.status === "LIMITED"
  }

  areAllProductsAvailable(): boolean {
    return this.filteredItems.every((item) => this.isProductAvailable(item.product))
  }

  // Direct calculation methods that don't rely on observables
  getSubtotal(): number {
    let subtotal = 0
    this.cartService
      .getCartItems()
      .pipe(take(1))
      .subscribe((items) => {
        subtotal = items.reduce((sum, item) => {
          const price = item.product?.price || 0
          return sum + price
        }, 0)
      })
    return subtotal
  }

  getTotal(): number {
    return this.getSubtotal()
  }

  getImageUrl(product?: Product): string {
    if (!product?.imageId) {
      return '/assets/placeholder.svg';
    }
    return `${environment.apiUrl}/images/${product.imageId}`;
  }
}

