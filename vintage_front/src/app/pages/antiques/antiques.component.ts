import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { AntiqueService } from "../../services/antique.service"
import { Antique } from "../../store/antiques/antique.types"
import { CartService } from "../../services/cart.service"

@Component({
  selector: "app-antiques",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-cream py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Antiques Collection</h1>
        </div>

        <div class="mb-8 flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/3">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterAntiques()"
              placeholder="Search antiques..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div class="w-full md:w-1/3">
            <select
              [(ngModel)]="selectedCategory"
              (ngModelChange)="filterAntiques()"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option *ngFor="let category of uniqueCategories" [value]="category">{{ category }}</option>
            </select>
          </div>
          <div class="w-full md:w-1/3">
            <select
              [(ngModel)]="sortBy"
              (ngModelChange)="filterAntiques()"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="year">Sort by Year</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        @if (loading) {
          <div class="flex justify-center my-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (antique of filteredAntiques; track antique.id) {
              <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div class="relative">
                  <img 
                    [src]="antique.imageUrl" 
                    [alt]="antique.name"
                    class="w-full h-60 object-cover"
                  >
                  <div 
                    class="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded"
                    [ngClass]="{
                      'bg-green-100 text-green-800': antique.status === 'AVAILABLE',
                      'bg-red-100 text-red-800': antique.status === 'SOLD',
                      'bg-yellow-100 text-yellow-800': antique.status === 'RESERVED'
                    }"
                  >
                    {{ antique.status }}
                  </div>
                </div>
                <div class="p-4 flex-1 flex flex-col">
                  <h2 class="text-xl font-semibold mb-2 line-clamp-1">{{ antique.name }}</h2>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{{ antique.description }}</p>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ antique.category }}</span>
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ antique.year }}</span>
                  </div>
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-lg font-bold text-teal">£{{ antique.price.toFixed(2) }}</span>
                    <span class="text-sm text-gray-500">{{ antique.condition }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <a 
                      [routerLink]="['/antiques', antique.id]"
                      class="bg-teal text-white text-center py-2 rounded-md hover:bg-teal/90 transition-colors"
                    >
                      View Details
                    </a>
                    <button
                      *ngIf="antique.status === 'AVAILABLE'"
                      (click)="addToCart(antique)"
                      class="bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      *ngIf="antique.status !== 'AVAILABLE'"
                      disabled
                      class="bg-gray-100 text-gray-400 py-2 rounded-md cursor-not-allowed opacity-60"
                    >
                      Unavailable
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (filteredAntiques.length === 0) {
            <div class="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-600 text-lg">No antiques found. Try adjusting your search.</p>
              <button (click)="resetFilters()" class="mt-4 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90">
                Reset Filters
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    `,
  ],
})
export class AntiquesComponent implements OnInit {
  antiques: Antique[] = []
  filteredAntiques: Antique[] = []
  searchTerm = ""
  selectedCategory = ""
  sortBy = "name"
  loading = false
  alternativeImageUrl = "/assets/placeholder.svg"

  constructor(
    private antiqueService: AntiqueService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadAntiques()
  }

  get uniqueCategories(): string[] {
    return [...new Set(this.antiques.map((item) => item.category || ""))]
  }

  resetFilters(): void {
    this.searchTerm = ""
    this.selectedCategory = ""
    this.sortBy = "name"
    this.filterAntiques()
  }

  loadAntiques(): void {
    this.loading = true
    this.antiqueService.getAllAntiques().subscribe((antiques) => {
      this.antiques = antiques
      this.filteredAntiques = [...antiques]
      this.loading = false
    })
  }

  filterAntiques(): void {
    this.filteredAntiques = this.antiques.filter(
      (item) =>
        (item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.selectedCategory === "" || item.category === this.selectedCategory),
    )

    this.filteredAntiques.sort((a, b) => {
      if (this.sortBy === "name") return a.name.localeCompare(b.name)
      if (this.sortBy === "year") return b.year - a.year
      if (this.sortBy === "price") return a.price - b.price
      return 0
    })
  }

  addToCart(antique: Antique): void {
    this.cartService.addToCart(antique.id)
  }
}

