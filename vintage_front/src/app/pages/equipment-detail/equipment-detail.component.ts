import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { filter, take } from "rxjs/operators"
import { Router } from "@angular/router"

import { ProductActions } from "../../store/products/product.actions"
import { selectProductLoading, selectSelectedProduct, selectProductError } from "../../store/products/product.selectors"
import { Product } from "../../store/products/product.types"
import { CartService } from "../../services/cart.service"
import { ApiService } from "../../services/api.service"

@Component({
  selector: "app-equipment-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-cream">
      <div class="container mx-auto px-4 py-8 md:py-12">
        @if (loading$ | async) {
          <div class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
          </div>
        } @else if (error$ | async) {
          <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <h2 class="text-lg font-semibold mb-2">Error Loading Product</h2>
            <p>{{ error$ | async }}</p>
            <a routerLink="/equipment" class="inline-flex items-center mt-4 text-teal hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Equipment
            </a>
          </div>
        } @else {
          <div class="mb-6">
            <a routerLink="/equipment" class="inline-flex items-center text-teal hover:text-teal/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Equipment
            </a>
          </div>
          
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="md:flex">
              <div class="md:w-1/3 h-80 md:h-auto overflow-hidden relative group">
                <img 
                  class="h-full w-full object-cover md:w-96" 
                  [src]="getSafeImageUrl((equipment$ | async)?.imageUrl)" 
                  [alt]="(equipment$ | async)?.name"
                  (error)="handleImageError($event)">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <div class="bg-white text-black text-xs px-3 py-2 rounded shadow-lg">
                      Click to enlarge
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-6 md:w-2/3">
                <div class="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h1 class="text-2xl md:text-3xl font-bold mb-1">{{ (equipment$ | async)?.name }}</h1>
                    <p class="text-lg text-gray-700 mb-2">
                      {{ (equipment$ | async)?.model }}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{{ (equipment$ | async)?.equipmentCondition }}</span>
                      <span class="bg-teal/10 text-teal text-xs px-2 py-1 rounded">{{ (equipment$ | async)?.origin }}</span>
                    </div>
                  </div>
                  <div class="text-right mt-2 md:mt-0">
                    <div class="text-2xl font-bold text-teal">£{{ (equipment$ | async)?.price?.toFixed(2) || '0.00' }}</div>
                    <div 
                      class="text-sm px-2 py-1 rounded-full text-center"
                      [ngClass]="{
                        'bg-green-100 text-green-800': isAvailable((equipment$ | async)?.status),
                        'bg-red-100 text-red-800': !isAvailable((equipment$ | async)?.status)
                      }"
                    >
                      {{ (equipment$ | async)?.status }}
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-b py-4 mb-6">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div class="text-gray-500">Model</div>
                      <div>{{ (equipment$ | async)?.model }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Year</div>
                      <div>{{ (equipment$ | async)?.year }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Condition</div>
                      <div>{{ (equipment$ | async)?.equipmentCondition }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Origin</div>
                      <div>{{ (equipment$ | async)?.origin }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-6">
                  <h2 class="text-lg font-semibold mb-2">Description</h2>
                  <p class="text-gray-700">{{ (equipment$ | async)?.description }}</p>
                </div>
                
                <div class="mb-4">
                  <h2 class="text-lg font-semibold mb-2">Materials</h2>
                  <p class="text-gray-700">{{ (equipment$ | async)?.material }}</p>
                </div>
                
                <div class="flex flex-wrap gap-4">
                  <button 
                    (click)="addToCart()" 
                    class="bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-md font-medium transition-transform hover:scale-105 flex items-center"
                    [disabled]="!isAvailable((equipment$ | async)?.status)"
                    [ngClass]="{'opacity-50 cursor-not-allowed': !isAvailable((equipment$ | async)?.status)}"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {{ isAvailable((equipment$ | async)?.status) ? 'Add to Cart' : 'Sold Out' }}
                  </button>
                  
                  <button class="border border-teal text-teal hover:bg-teal/5 px-6 py-3 rounded-md font-medium transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Wishlist
                  </button>
                </div>
                
                @if (!isAvailable((equipment$ | async)?.status)) {
                  <div class="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                    <p class="text-sm">This item is currently sold out. You can add it to your wishlist to be notified when it becomes available.</p>
                  </div>
                }
              </div>
            </div>
            
            <div class="p-6 border-t bg-gray-50">
              <h2 class="text-lg font-semibold mb-4">Product Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Model:</span> {{ (equipment$ | async)?.model }}
                </div>
                <div>
                  <span class="text-gray-500">Year:</span> {{ (equipment$ | async)?.year }}
                </div>
                <div>
                  <span class="text-gray-500">Condition:</span> {{ (equipment$ | async)?.equipmentCondition }}
                </div>
                <div>
                  <span class="text-gray-500">Material:</span> {{ (equipment$ | async)?.material }}
                </div>
                <div>
                  <span class="text-gray-500">Origin:</span> {{ (equipment$ | async)?.origin }}
                </div>
                <div>
                  <span class="text-gray-500">Date Added:</span> {{ (equipment$ | async)?.dateAdded ? ((equipment$ | async)?.dateAdded | date:'mediumDate') : 'Unknown' }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-12">
            <h2 class="text-xl font-bold mb-6 relative inline-block">
              Similar Equipment
              <span class="absolute -bottom-1 left-0 w-1/2 h-1 bg-teal"></span>
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <!-- Placeholder recommendations -->
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-40 overflow-hidden">
                    <img src="/assets/placeholder.svg" alt="Recommendation" class="w-full h-full object-cover">
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium truncate">Similar Equipment</h3>
                    <p class="text-sm text-gray-600 truncate">{{ ['Vintage', 'Classic', 'Modern', 'Professional'][i-1] }}</p>
                    <div class="mt-2 flex justify-between items-center">
                      <span class="font-bold text-teal">£{{ (199.99 * i).toFixed(2) }}</span>
                      <button class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class EquipmentDetailComponent implements OnInit {
  equipment$: Observable<Product | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  alternativeImageUrl = "/assets/placeholder.svg"

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {
    this.equipment$ = this.store.select(selectSelectedProduct)
    this.loading$ = this.store.select(selectProductLoading)
    this.error$ = this.store.select(selectProductError)

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.store.dispatch(ProductActions.loadProducts({ productType: "MUSIC_EQUIPMENT" }))
      }
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.store.dispatch(ProductActions.loadEquipmentById({ id }))
      }
    })
  }

  getSafeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/placeholder.svg'
    return this.apiService.getProductImageUrl(imageUrl)
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.src = this.alternativeImageUrl
  }

  isAvailable(status?: string): boolean {
    return status === "AVAILABLE" || status === "IN_STOCK" || status === "LIMITED"
  }

  addToCart(): void {
    this.equipment$
      .pipe(
        filter((equipment) => !!equipment),
        take(1),
      )
      .subscribe((equipment) => {
        if (equipment && this.isAvailable(equipment.status)) {
          this.cartService.addToCart(equipment.id)
          alert("Equipment added to cart!")
        } else {
          alert("Sorry, this item is not available for purchase.")
        }
      })
  }
}

