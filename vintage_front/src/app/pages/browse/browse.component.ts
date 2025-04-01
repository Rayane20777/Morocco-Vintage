import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { ProductActions } from "../../store/products/product.actions"
import {
  selectFilteredVinyls,
  selectProductLoading,
  selectProductError,
  selectGenres,
  selectStyles,
} from "../../store/products/product.selectors"
import { Subject } from "rxjs"
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators"
import { Product, ProductFilters } from "../../store/products/product.types"
import { DomSanitizer } from "@angular/platform-browser"
import { environment } from "../../../environments/environment"
import { UserService } from "../../services/user.service"

@Component({
  selector: "app-browse",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl md:text-3xl font-bold">Browse Vinyl Records</h1>
        <div class="flex items-center gap-2">
          <button (click)="toggleFilters()" class="md:hidden flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
      </div>

      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p>{{ error }}</p>
      </div>

      <div class="relative mb-6">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange($event)"
          placeholder="Search for artists, albums, or genres..."
          class="w-full pl-10 pr-4 py-2 border rounded-md"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <div [class.hidden]="!showFilters" class="md:block w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-4 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 class="font-semibold mb-4">Filters</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium mb-2">Price Range</h3>
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    [(ngModel)]="filters.price.min"
                    (ngModelChange)="applyFilters()"
                    placeholder="Min"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.price.max"
                    (ngModelChange)="applyFilters()"
                    placeholder="Max"
                    class="w-20 px-2 py-1 border rounded"
                  >
                </div>
              </div>
              <div>
                <h3 class="font-medium mb-2">Genres</h3>
                <div class="max-h-40 overflow-y-auto">
                  @for (genre of availableGenres; track genre) {
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        [value]="genre"
                        (change)="updateGenreFilter(genre, $event)"
                        [checked]="isGenreSelected(genre)"
                      >
                      <span>{{ genre }}</span>
                    </label>
                  }
                </div>
              </div>
              <div>
                <h3 class="font-medium mb-2">Styles</h3>
                <div class="max-h-40 overflow-y-auto">
                  @for (style of availableStyles; track style) {
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        [value]="style"
                        (change)="updateStyleFilter(style, $event)"
                        [checked]="isStyleSelected(style)"
                      >
                      <span>{{ style }}</span>
                    </label>
                  }
                </div>
              </div>
              <button 
                (click)="resetFilters()" 
                class="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="bg-white rounded-lg shadow-sm mb-4 p-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">Sort by:</span>
              <div class="flex gap-4">
                @for (option of sortOptions; track option) {
                  <a href="#" (click)="sortRecords(option, $event)" class="text-sm" [class.text-teal]="currentSort === option" [class.font-medium]="currentSort === option" [class.hover:underline]="true">{{ option }}</a>
                }
              </div>
            </div>
            <span class="text-sm font-medium">{{ filteredVinyls.length }} Records</span>
          </div>

          <div *ngIf="filteredVinyls.length === 0 && !loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <p class="text-gray-500">No records found matching your criteria.</p>
          </div>

          <div class="space-y-4">
            @for (record of filteredVinyls; track record.id) {
              <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="flex flex-col md:flex-row">
                  <div class="p-4 md:w-[180px] flex-shrink-0">
                    <div class="relative aspect-square md:h-[150px] md:w-[150px] mx-auto">
                      <img [src]="getSafeImageUrl(record)" alt="https://static.fnac-static.com/multimedia/Images/FD/Comete/119799/CCP_IMG_1200x800/1557956.jpg" class="object-cover w-full h-full">
                      <div *ngIf="record.price" class="absolute top-0 right-0 bg-teal text-white px-2 py-1 text-sm font-bold rounded-bl">
                        £{{ record.price.toFixed(2) }}
                      </div>
                    </div>
                  </div>

                  <div class="p-4 flex-1 border-t md:border-t-0 md:border-l border-gray-100">
                    <div class="mb-3">
                      <a [routerLink]="['/release', record.id]" class="text-lg font-medium text-teal hover:underline">
                        {{ getArtistTitle(record) }}
                      </a>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-sm">
                      <div *ngIf="record.year">
                        <span class="text-gray-500">Year:</span> <span>{{ record.year }}</span>
                      </div>
                      <div *ngIf="record.genres && record.genres.length">
                        <span class="text-gray-500">Genres:</span>
                        <span>{{ record.genres.join(', ') }}</span>
                      </div>
                      <div *ngIf="record.format && record.format.length">
                        <span class="text-gray-500">Format:</span> <span>{{ record.format.join(', ') }}</span>
                      </div>
                      <div *ngIf="record.condition">
                        <span class="text-gray-500">Condition:</span> <span>{{ record.condition }}</span>
                      </div>
                    </div>

                    <div class="text-sm text-gray-700 mb-3 line-clamp-2 md:line-clamp-3">{{ record.description }}</div>

                    <a [routerLink]="['/release', record.id]" class="text-sm text-teal hover:underline">
                      View Release Page
                    </a>
                  </div>

                  <div class="p-4 md:w-[220px] flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
                    <div class="mb-3 text-center">
                      <div class="text-xl font-bold">
                        {{ record.price ? ('£' + record.price.toFixed(2)) : 'Price unavailable' }}
                      </div>
                    </div>

                    <div class="mt-auto space-y-2">
                      <a [routerLink]="['/release', record.id]" class="block w-full text-center bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md">View Details</a>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class BrowseComponent implements OnInit, OnDestroy {
  sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"]
  currentSort = "Relevance"

  showFilters = false
  searchTerm = ""

  filters: ProductFilters = {
    category: [],
    price: { min: 0, max: 1000 },
    condition: [],
    genre: [],
    style: [],
    searchTerm: "",
  }

  filteredVinyls: Product[] = []
  loading = false
  error: string | null = null
  availableGenres: string[] = []
  availableStyles: string[] = []

  private searchTerms = new Subject<string>()
  private destroy$ = new Subject<void>()

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Load vinyls when component initializes
    this.loading = true
    this.store.dispatch(ProductActions.loadVinyls())

    // Subscribe to filtered vinyls from the store
    this.store
      .select(selectFilteredVinyls)
      .pipe(takeUntil(this.destroy$))
      .subscribe((vinyls) => {
        this.filteredVinyls = vinyls
        // Apply current sort
        this.applySorting(this.currentSort)
      })

    // Subscribe to loading state
    this.store
      .select(selectProductLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading
      })

    // Subscribe to error state
    this.store
      .select(selectProductError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error
      })

    // Subscribe to available genres
    this.store
      .select(selectGenres)
      .pipe(takeUntil(this.destroy$))
      .subscribe((genres) => {
        this.availableGenres = genres
      })

    // Subscribe to available styles
    this.store
      .select(selectStyles)
      .pipe(takeUntil(this.destroy$))
      .subscribe((styles) => {
        this.availableStyles = styles
      })

    // Setup debounced search
    this.searchTerms.pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.filters = {
        ...this.filters,
        searchTerm: term,
      }
      this.applyFilters()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }

  // Fixed filter methods that create new objects instead of modifying existing ones
  updateGenreFilter(genre: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked
    const currentGenres = Array.isArray(this.filters.genre) ? [...this.filters.genre] : []

    if (isChecked) {
      this.filters = {
        ...this.filters,
        genre: [...currentGenres, genre],
      }
    } else {
      this.filters = {
        ...this.filters,
        genre: currentGenres.filter((item) => item !== genre),
      }
    }

    this.applyFilters()
  }

  updateStyleFilter(style: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked
    const currentStyles = Array.isArray(this.filters.style) ? [...this.filters.style] : []

    if (isChecked) {
      this.filters = {
        ...this.filters,
        style: [...currentStyles, style],
      }
    } else {
      this.filters = {
        ...this.filters,
        style: currentStyles.filter((item) => item !== style),
      }
    }

    this.applyFilters()
  }

  // Helper methods to check if items are selected
  isGenreSelected(genre: string): boolean {
    return this.filters.genre ? this.filters.genre.includes(genre) : false
  }

  isStyleSelected(style: string): boolean {
    return this.filters.style ? this.filters.style.includes(style) : false
  }

  onSearchChange(term: string): void {
    this.searchTerms.next(term)
  }

  applyFilters(): void {
    this.store.dispatch(ProductActions.applyFilters({ filters: this.filters }))
  }

  resetFilters(): void {
    this.searchTerm = ""
    this.store.dispatch(ProductActions.resetFilters())
  }

  getArtistTitle(record: Product): string {
    if (record.artists && record.artists.length > 0) {
      return `${record.artists.join(", ")} - ${record.name}`
    }
    return record.name
  }

  // Safe image URL handling
  getSafeImageUrl(record: Product): any {
    console.log("Getting safe image URL for record:", JSON.stringify(record, null, 2))
    console.log("Record imageId:", record.imageId)
    console.log("Record image:", record.image)
    console.log("Record imageUrl:", record.imageUrl)

    if (!record.imageId) {
      console.log("No imageId found, using placeholder")
      return "/assets/placeholder.svg"
    }

    // Construct the URL with the correct API path
    const imageUrl = `${environment.apiUrl}/images/${record.imageId}`
    console.log("Generated image URL:", imageUrl)
    
    // Sanitize the URL for security
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl)
  }

  // Sorting functionality
  sortRecords(option: string, event?: Event): void {
    if (event) {
      event.preventDefault()
    }

    this.currentSort = option
    this.applySorting(option)
  }

  private applySorting(option: string): void {
    switch (option) {
      case "Price: Low to High":
        this.filteredVinyls = [...this.filteredVinyls].sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "Price: High to Low":
        this.filteredVinyls = [...this.filteredVinyls].sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "Newest":
        this.filteredVinyls = [...this.filteredVinyls].sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
          return dateB - dateA
        })
        break
      case "Relevance":
      default:
        // No sorting needed, the default order from the API is used
        break
    }
  }
}

