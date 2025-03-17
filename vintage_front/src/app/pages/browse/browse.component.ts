import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"

interface Filter {
  category: string[]
  price: { min: number; max: number }
  condition: string[]
}

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

      <div class="relative mb-6">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterRecords()"
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
                <h3 class="font-medium mb-2">Category</h3>
                @for (category of categories; track category) {
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      [value]="category"
                      (change)="updateFilter('category', category, $event)"
                      [checked]="filters.category.includes(category)"
                    >
                    <span>{{ category }}</span>
                  </label>
                }
              </div>
              <div>
                <h3 class="font-medium mb-2">Price Range</h3>
                <div class="flex items-center space-x-2">
                  <input
                    type="number"
                    [(ngModel)]="filters.price.min"
                    (ngModelChange)="filterRecords()"
                    placeholder="Min"
                    class="w-20 px-2 py-1 border rounded"
                  >
                  <span>-</span>
                  <input
                    type="number"
                    [(ngModel)]="filters.price.max"
                    (ngModelChange)="filterRecords()"
                    placeholder="Max"
                    class="w-20 px-2 py-1 border rounded"
                  >
                </div>
              </div>
              <div>
                <h3 class="font-medium mb-2">Condition</h3>
                @for (condition of conditions; track condition) {
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      [value]="condition"
                      (change)="updateFilter('condition', condition, $event)"
                      [checked]="filters.condition.includes(condition)"
                    >
                    <span>{{ condition }}</span>
                  </label>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="bg-white rounded-lg shadow-sm mb-4 p-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">Sort by:</span>
              <div class="flex gap-4">
                @for (option of sortOptions; track option) {
                  <a href="#" class="text-sm text-teal hover:underline">{{ option }}</a>
                }
              </div>
            </div>
            <span class="text-sm font-medium">Price</span>
          </div>

          <div class="space-y-4">
            @for (record of filteredRecords; track record.id) {
              <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="flex flex-col md:flex-row">
                  <div class="p-4 md:w-[180px] flex-shrink-0">
                    <div class="relative aspect-square md:h-[150px] md:w-[150px] mx-auto">
                      <img [src]="record.imageUrl" [alt]="record.artist + ' - ' + record.title" class="object-cover w-full h-full">
                    </div>
                    <div class="mt-2 text-xs text-gray-500 flex justify-between">
                      <div>
                        <span class="text-teal font-medium">{{ record.have }}</span> have
                      </div>
                      <div>
                        <span class="text-teal font-medium">{{ record.want }}</span> want
                      </div>
                    </div>
                  </div>

                  <div class="p-4 flex-1 border-t md:border-t-0 md:border-l border-gray-100">
                    <div class="mb-3">
                      <a [routerLink]="['/release', record.id]" class="text-lg font-medium text-teal hover:underline">
                        {{ record.artist }} - {{ record.title }}
                      </a>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-sm">
                      <div>
                        <span class="text-gray-500">Label:</span>
                        <a href="#" class="text-teal hover:underline">{{ record.label }}</a>
                      </div>
                      <div>
                        <span class="text-gray-500">Cat#:</span> <span>{{ record.catalogNumber }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Media:</span> <span>{{ record.mediaCondition }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Sleeve:</span> <span>{{ record.sleeveCondition }}</span>
                      </div>
                    </div>

                    <div class="text-sm text-gray-700 mb-3 line-clamp-2 md:line-clamp-3">{{ record.description }}</div>

                    <a [routerLink]="['/release', record.id]" class="text-sm text-teal hover:underline">
                      View Release Page
                    </a>
                  </div>

                  <div class="p-4 md:w-[220px] flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col">
                    <div class="mb-3 text-center">
                      <div class="text-xl font-bold">£{{ record.price.toFixed(2) }}</div>
                    </div>

                    <div class="mt-auto space-y-2">
                      <button class="w-full bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md">Add to Cart</button>
                      <a [routerLink]="['/release', record.id]" class="block w-full text-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md">View Details</a>
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
export class BrowseComponent {
  sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"]
  categories = ["Rock", "Jazz", "Hip Hop", "Electronic", "Classical"]
  conditions = ["Mint", "Near Mint", "Very Good", "Good", "Fair"]

  showFilters = false
  searchTerm = ""
  filters: Filter = {
    category: [],
    price: { min: 0, max: 1000 },
    condition: [],
  }

  vinylRecords = [
    {
      id: 1,
      artist: "Pink Floyd",
      title: "Dark Side of the Moon",
      imageUrl:
        "https://images.theconversation.com/files/512871/original/file-20230301-26-ryosag.jpg?ixlib=rb-4.1.0&rect=97%2C79%2C5799%2C5817&q=45&auto=format&w=926&fit=clip",
      label: "Harvest",
      catalogNumber: "SHVL 804",
      mediaCondition: "Near Mint (NM or M-)",
      sleeveCondition: "Very Good Plus (VG+)",
      description:
        "Original UK pressing from 1973. The vinyl is in excellent condition with minimal surface noise. The sleeve shows some light wear on the edges but overall in great condition.",
      have: 12453,
      want: 8765,
      rating: 4.8,
      ratingPercent: 96,
      ratings: 245,
      price: 149.99,
      category: "Rock",
      shipsFrom: "United Kingdom",
      shipping: 4.99,
      totalEuros: 154.98,
    },
    {
      id: 2,
      artist: "Miles Davis",
      title: "Kind of Blue",
      imageUrl:
        "https://cdn-p.smehost.net/sites/c5d2b1a28fd246bfafed3b8dbafc1352/wp-content/uploads/2021/05/cover-45.jpg",
      label: "Columbia",
      catalogNumber: "CS 8163",
      mediaCondition: "Mint (M)",
      sleeveCondition: "Mint (M)",
      description:
        "Original 1959 pressing in pristine condition. One of the most influential jazz albums ever recorded, featuring the legendary sextet with John Coltrane and Bill Evans.",
      have: 8562,
      want: 6543,
      rating: 4.9,
      ratingPercent: 98,
      ratings: 189,
      price: 199.99,
      category: "Jazz",
      shipsFrom: "United States",
      shipping: 5.99,
      totalEuros: 205.98,
    },
    {
      id: 3,
      artist: "The Beatles",
      title: "Abbey Road",
      imageUrl: "https://i.ebayimg.com/images/g/zZMAAOSw-2thXkWX/s-l1600.webp",
      label: "Apple",
      catalogNumber: "PCS 7088",
      mediaCondition: "Very Good Plus (VG+)",
      sleeveCondition: "Very Good (VG)",
      description:
        "Original UK pressing from 1969. The vinyl has some light surface marks but plays well. The sleeve has some ring wear and edge wear but is still presentable.",
      have: 15678,
      want: 9876,
      rating: 4.7,
      ratingPercent: 94,
      ratings: 312,
      price: 89.99,
      category: "Rock",
      shipsFrom: "United Kingdom",
      shipping: 4.99,
      totalEuros: 94.98,
    },
    {
      id: 4,
      artist: "Daft Punk",
      title: "Random Access Memories",
      imageUrl: "https://www.adamkois.com/wp-content/uploads/2014/01/tumblr_mn9t4yJJaw1qa1rvco1_1280.jpg",
      label: "Columbia",
      catalogNumber: "88883716861",
      mediaCondition: "Near Mint (NM or M-)",
      sleeveCondition: "Near Mint (NM or M-)",
      description:
        "Limited edition 180g pressing from 2013. The vinyl is in excellent condition with no surface noise. The sleeve is pristine with no wear.",
      have: 5432,
      want: 4321,
      rating: 4.6,
      ratingPercent: 92,
      ratings: 167,
      price: 79.99,
      category: "Electronic",
      shipsFrom: "France",
      shipping: 6.99,
      totalEuros: 86.98,
    },
  ]

  filteredRecords = [...this.vinylRecords]

  toggleFilters() {
    this.showFilters = !this.showFilters
  }

  updateFilter(type: keyof Filter, value: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked
    if (type === "category" || type === "condition") {
      if (isChecked) {
        this.filters[type].push(value)
      } else {
        this.filters[type] = this.filters[type].filter((item) => item !== value)
      }
    }
    // Note: We don't need to handle 'price' here as it's updated directly by ngModel
    this.filterRecords()
  }

  filterRecords() {
    this.filteredRecords = this.vinylRecords.filter((record) => {
      const matchesSearch =
        record.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        record.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
      const matchesCategory = this.filters.category.length === 0 || this.filters.category.includes(record.category)
      const matchesPrice = record.price >= this.filters.price.min && record.price <= this.filters.price.max
      const matchesCondition =
        this.filters.condition.length === 0 || this.filters.condition.includes(record.mediaCondition)

      return matchesSearch && matchesCategory && matchesPrice && matchesCondition
    })
  }
}

