import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { Router } from "@angular/router"

import { ProductActions } from "../../store/products/product.actions"
import { selectProductLoading, selectProducts, selectProductError } from "../../store/products/product.selectors"
import { Product } from "../../store/products/product.types"
import { ApiService } from "../../services/api.service"

@Component({
  selector: "app-equipment",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Music Equipment</h1>
      
      @if (loading$ | async) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
      } @else if (error$ | async) {
        <div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h2 class="text-lg font-semibold mb-2">Error Loading Equipment</h2>
          <p>{{ error$ | async }}</p>
        </div>
      } @else {
        <div class="mb-8 flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/3">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterEquipment()"
              placeholder="Search equipment..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div class="w-full md:w-1/3">
            <select
              [(ngModel)]="selectedCondition"
              (ngModelChange)="filterEquipment()"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Conditions</option>
              <option *ngFor="let condition of uniqueConditions" [value]="condition">{{ condition }}</option>
            </select>
          </div>
          <div class="w-full md:w-1/3">
            <select
              [(ngModel)]="sortBy"
              (ngModelChange)="filterEquipment()"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="year">Sort by Year</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of filteredEquipment; track item.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <img [src]="getSafeImageUrl(item.imageUrl)" [alt]="item.name" class="w-full h-48 object-cover">
              <div class="p-4">
                <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
                <p class="text-gray-600 mb-2">{{ item.model }} | {{ item.year }}</p>
                <p class="text-gray-700 mb-2 line-clamp-2">{{ item.description }}</p>
                <p class="text-sm text-gray-600 mb-2">{{ item.material }}</p>
                <p class="text-sm text-gray-600 mb-2">Origin: {{ item.origin }}</p>
                <div class="flex justify-between items-center mt-4">
                  <span class="text-lg font-bold text-teal">£{{ item.price?.toFixed(2) || '0.00' }}</span>
                  <span class="px-2 py-1 text-xs font-semibold rounded" [ngClass]="{
                    'bg-green-100 text-green-800': item.status === 'AVAILABLE',
                    'bg-yellow-100 text-yellow-800': item.status === 'LIMITED',
                    'bg-red-100 text-red-800': item.status === 'SOLD OUT'
                  }">{{ item.status }}</span>
                </div>
                <div class="mt-4">
                  <a [routerLink]="['/equipment', item.id]" class="block w-full bg-teal text-white text-center px-4 py-2 rounded hover:bg-teal/90 transition-colors">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          }
        </div>

        @if (filteredEquipment.length === 0) {
          <div class="text-center py-8">
            <p class="text-xl text-gray-600">No equipment found matching your criteria.</p>
          </div>
        }
      }
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
export class EquipmentComponent implements OnInit {
  equipment$: Observable<Product[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  filteredEquipment: Product[] = []
  searchTerm = ""
  selectedCondition = ""
  selectedOrigin = ""
  sortBy = "name"
  alternativeImageUrl = "/assets/placeholder.svg"

  constructor(
    private store: Store,
    private router: Router,
    private apiService: ApiService
  ) {
    this.equipment$ = this.store.select(selectProducts)
    this.loading$ = this.store.select(selectProductLoading)
    this.error$ = this.store.select(selectProductError)
  }

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadEquipment())
    this.equipment$.subscribe(equipment => {
      this.filteredEquipment = equipment
      this.filterEquipment()
    })
  }

  get uniqueConditions(): string[] {
    return [...new Set(this.filteredEquipment.map((item) => item.equipmentCondition || ''))]
  }

  get uniqueOrigins(): string[] {
    return [...new Set(this.filteredEquipment.map((item) => item.origin || ''))]
  }

  getSafeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/placeholder.svg'
    return this.apiService.getProductImageUrl(imageUrl)
  }

  filterEquipment() {
    this.equipment$.subscribe(equipment => {
      this.filteredEquipment = equipment.filter(
        (item) =>
          (item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
          (this.selectedCondition === "" || item.equipmentCondition === this.selectedCondition) &&
          (this.selectedOrigin === "" || item.origin === this.selectedOrigin),
      )

      this.filteredEquipment.sort((a, b) => {
        if (this.sortBy === "name") return a.name.localeCompare(b.name)
        if (this.sortBy === "year") return b.year - a.year
        if (this.sortBy === "price") return a.price - b.price
        return 0
      })
    })
  }
}

