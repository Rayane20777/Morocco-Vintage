import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"
import { ApiService } from "../../services/api.service"
import { CartService } from "../../services/cart.service"
import { Antique } from "../../store/antiques/antique.types"

@Component({
  selector: "app-antique-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-cream py-8">
      <div class="container mx-auto px-4">
        <div class="mb-6">
          <a routerLink="/antiques" class="inline-flex items-center text-teal hover:text-teal/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Antiques
          </a>
        </div>
        
        @if (loading) {
          <div class="text-center py-12 bg-white rounded-lg shadow-sm">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal mx-auto mb-4"></div>
            <p class="text-gray-600">Loading antique details...</p>
          </div>
        } @else if (antique) {
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              <div class="space-y-4">
                <div class="relative rounded-lg overflow-hidden">
                  <img 
                    [src]="getSafeImageUrl(antique.imageUrl)" 
                    [alt]="antique.name"
                    class="w-full h-[400px] object-cover rounded-lg"
                    (error)="handleImageError($event)"
                  >
                  <div 
                    class="absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800': antique.status === 'AVAILABLE',
                      'bg-red-100 text-red-800': antique.status === 'SOLD',
                      'bg-yellow-100 text-yellow-800': antique.status === 'RESERVED'
                    }"
                  >
                    {{ antique.status }}
                  </div>
                </div>
              </div>
              
              <div class="space-y-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">{{ antique.name }}</h1>
                  <div class="flex items-center gap-2 mb-4">
                    <span 
                      class="inline-block px-3 py-1 text-sm font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': antique.status === 'AVAILABLE',
                        'bg-red-100 text-red-800': antique.status === 'SOLD',
                        'bg-yellow-100 text-yellow-800': antique.status === 'RESERVED'
                      }"
                    >
                      {{ antique.status }}
                    </span>
                    <span class="text-gray-500">•</span>
                    <span class="text-gray-500">{{ antique.category }}</span>
                  </div>
                </div>

                <div class="text-2xl font-bold text-teal">
                  £{{ antique.price.toFixed(2) }}
                </div>

                <div class="prose max-w-none">
                  <p class="text-gray-600">{{ antique.description }}</p>
                </div>

                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Category</h3>
                      <p class="mt-1">{{ antique.category }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Condition</h3>
                      <p class="mt-1">{{ antique.condition }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Year</h3>
                      <p class="mt-1">{{ antique.year }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Dimensions</h3>
                      <p class="mt-1">{{ antique.dimensions?.length || 0 }}cm × {{ antique.dimensions?.width || 0 }}cm × {{ antique.dimensions?.height || 0 }}cm</p>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Materials</h3>
                    <div class="mt-1 flex flex-wrap gap-2">
                      @for (material of antique.materials || []; track material) {
                        <span class="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {{ material }}
                        </span>
                      }
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex gap-4">
                  <button
                    (click)="addToCart(antique)"
                    [disabled]="antique.status !== 'AVAILABLE'"
                    class="flex-1 bg-teal text-white py-3 rounded-md font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {{ antique.status === 'AVAILABLE' ? 'Add to Cart' : 'Not Available' }}
                  </button>
                  
                  <button class="flex-1 border border-teal text-teal py-3 rounded-md font-medium hover:bg-teal/5 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-6 border-t bg-gray-50">
              <h2 class="text-lg font-semibold mb-4">Provenance & History</h2>
              <p class="text-gray-600">
                This exquisite piece has been carefully authenticated and comes with full documentation of its history and origin.
                Our expert curators have verified its authenticity and condition.
              </p>
            </div>
          </div>
          
          <div class="mt-12">
            <h2 class="text-xl font-bold mb-6 relative inline-block">
              You Might Also Like
              <span class="absolute -bottom-1 left-0 w-1/2 h-1 bg-teal"></span>
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <!-- Placeholder recommendations -->
              @for (i of dummyArray(4); track i) {
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-40 overflow-hidden">
                    <img src="/assets/placeholder.svg" alt="Recommendation" class="w-full h-full object-cover">
                  </div>
                  <div class="p-4">
                    <h3 class="font-medium truncate">Similar Antique</h3>
                    <p class="text-sm text-gray-600 truncate">{{ antique.category }}</p>
                    <div class="mt-2 flex justify-between items-center">
                      <span class="font-bold text-teal">£{{ (antique.price * 0.8).toFixed(2) }}</span>
                      <button class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 text-lg">Antique not found</p>
            <a routerLink="/antiques" class="mt-4 inline-block px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90">
              Browse Antiques
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class AntiqueDetailComponent implements OnInit {
  antique: Antique | null = null
  loading = true
  alternativeImageUrl = "https://cdn-p.smehost.net/sites/28d35d54a3c64e2b851790a18a1c4c18/wp-content/uploads/2017/04/19870831_bad_album.jpg"

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.apiService.getProducts("ANTIQUE").subscribe(
        (products) => {
          const antique = products.find((p) => p.id === id)
          if (antique) {
            this.antique = antique as unknown as Antique
          }
          this.loading = false
        },
        (error) => {
          console.error("Error fetching antique:", error)
          this.loading = false
        },
      )
    } else {
      this.loading = false
    }
  }

  getSafeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/placeholder.svg'
    return this.apiService.getProductImageUrl(imageUrl)
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement
    imgElement.src = this.alternativeImageUrl
  }

  // Helper method to create dummy arrays for iteration
  dummyArray(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((_, i) => i)
  }

  addToCart(antique: Antique): void {
    if (antique.status === "AVAILABLE") {
      this.cartService.addToCart(antique.id)
      alert("Antique added to your cart!")
    }
  }
}

