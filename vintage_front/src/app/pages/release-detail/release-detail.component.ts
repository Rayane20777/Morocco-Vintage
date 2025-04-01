import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { ApiService } from "../../services/api.service"
import { CartService } from "../../services/cart.service"
import { Product } from "../../store/products/product.types"
import { Store } from "@ngrx/store"
import { ProductActions } from "../../store/products/product.actions"
import { Router } from "@angular/router"

@Component({
  selector: "app-release-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-cream">
      <div class="container mx-auto px-4 py-8 md:py-12">
        @if (loading) {
          <div class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
          </div>
        } @else if (error) {
          <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <h2 class="text-lg font-semibold mb-2">Error Loading Product</h2>
            <p>{{ error }}</p>
            <a routerLink="/browse" class="inline-flex items-center mt-4 text-teal hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Browse
            </a>
          </div>
        } @else {
          <div class="mb-6">
            <a routerLink="/browse" class="inline-flex items-center text-teal hover:text-teal/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Browse
            </a>
          </div>
          
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="md:flex">
              <div class="md:w-1/3 h-80 md:h-auto overflow-hidden relative group">
                <img 
                  class="h-full w-full object-cover md:w-96" 
                  [src]="getSafeImageUrl(release.imageUrl)" 
                  [alt]="release.name"
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
                    <h1 class="text-2xl md:text-3xl font-bold mb-1">{{ release.name }}</h1>
                    <p class="text-lg text-gray-700 mb-2">
                      {{ getArtists() }}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                      @for (genre of release.genres || []; track genre) {
                        <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{{ genre }}</span>
                      }
                      @for (style of release.styles || []; track style) {
                        <span class="bg-teal/10 text-teal text-xs px-2 py-1 rounded">{{ style }}</span>
                      }
                    </div>
                  </div>
                  <div class="text-right mt-2 md:mt-0">
                    <div class="text-2xl font-bold text-teal">£{{ release.price.toFixed(2) }}</div>
                    <div class="text-sm text-gray-500">{{ release.status }}</div>
                  </div>
                </div>
                
                <div class="border-t border-b py-4 mb-6">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div class="text-gray-500">Format</div>
                      <div>{{ getFormat() }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Release Year</div>
                      <div>{{ release.year }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Condition</div>
                      <div>{{ release.condition || 'New' }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Label</div>
                      <div>{{ release.label || 'Unknown' }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-6">
                  <h2 class="text-lg font-semibold mb-2">Description</h2>
                  <p class="text-gray-700">{{ release.description }}</p>
                </div>
                
                <div class="flex flex-wrap gap-4">
                  <button 
                    (click)="addToCart()" 
                    class="bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-md font-medium transition-transform hover:scale-105 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  
                  <button class="border border-teal text-teal hover:bg-teal/5 px-6 py-3 rounded-md font-medium transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
            
            @if (release.trackList && release.trackList.length > 0) {
              <div class="p-6 border-t">
                <h2 class="text-lg font-semibold mb-4">Track List</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  @for (track of release.trackList; track track; let i = $index) {
                    <div class="flex items-center p-2 hover:bg-gray-50 rounded">
                      <div class="w-8 text-center text-gray-500">{{ i + 1 }}</div>
                      <div class="flex-grow">{{ track }}</div>
                    </div>
                  }
                </div>
              </div>
            }
            
            <div class="p-6 border-t bg-gray-50">
              <h2 class="text-lg font-semibold mb-4">Product Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                @if (release.catalogNumber) {
                  <div>
                    <span class="text-gray-500">Catalog Number:</span> {{ release.catalogNumber }}
                  </div>
                }
                @if (release.country) {
                  <div>
                    <span class="text-gray-500">Country:</span> {{ release.country }}
                  </div>
                }
                @if (release.discogsId) {
                  <div>
                    <span class="text-gray-500">Discogs ID:</span> {{ release.discogsId }}
                  </div>
                }
                @if (release.mediaCondition) {
                  <div>
                    <span class="text-gray-500">Media Condition:</span> {{ release.mediaCondition }}
                  </div>
                }
                @if (release.sleeveCondition) {
                  <div>
                    <span class="text-gray-500">Sleeve Condition:</span> {{ release.sleeveCondition }}
                  </div>
                }
                @if (release.label) {
                  <div>
                    <span class="text-gray-500">Label:</span> {{ release.label }}
                  </div>
                }
                <div>
                  <span class="text-gray-500">Date Added:</span> {{ release.dateAdded ? (release.dateAdded | date:'mediumDate') : 'Unknown' }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-12">
            <h2 class="text-xl font-bold mb-6 relative inline-block">
              You Might Also Like
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
                    <h3 class="font-medium truncate">Recommended Album</h3>
                    <p class="text-sm text-gray-600 truncate">Similar Artist</p>
                    <div class="mt-2 flex justify-between items-center">
                      <span class="font-bold text-teal">£24.99</span>
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
export class ReleaseDetailComponent implements OnInit {
  release: Product = {
    id: "",
    name: "",
    description: "",
    price: 0,
    boughtPrice: 0,
    status: "",
    type: "VINYL",
    year: 0,
  }

  loading = true
  error: string | null = null
  alternativeImageUrl =
    "https://cdn-p.smehost.net/sites/28d35d54a3c64e2b851790a18a1c4c18/wp-content/uploads/2017/04/19870831_bad_album.jpg"

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
  ) {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.store.dispatch(ProductActions.loadProducts({ productType: "VINYL" }))
      }
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.fetchReleaseDetails(id)
      } else {
        this.error = "No product ID provided"
        this.loading = false
      }
    })
  }

  fetchReleaseDetails(id: string): void {
    this.loading = true
    this.apiService.getVinylById(id).subscribe({
      next: (product) => {
        this.release = product
        this.loading = false
      },
      error: (err) => {
        console.error("Error fetching release details:", err)
        this.error = "Failed to load product details. Please try again later."
        this.loading = false
      },
    })
  }

  getArtists(): string {
    if (this.release.artists && this.release.artists.length > 0) {
      return this.release.artists.join(", ")
    }
    return "Various Artists"
  }

  getFormat(): string {
    if (this.release.format && this.release.format.length > 0) {
      return this.release.format.join(", ")
    }
    return "Vinyl"
  }

  getSafeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/placeholder.svg'
    return this.apiService.getProductImageUrl(imageUrl)
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.src = this.alternativeImageUrl
  }

  addToCart(): void {
    this.cartService.addToCart(this.release.id)
    alert("Product added to cart!")
  }
}

