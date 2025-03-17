import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"

interface Antique {
  id: number
  name: string
  type: string
  year: number
  price: number
  image: string
  description: string
}

@Component({
  selector: "app-antiques",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Antiques Collection</h1>
      
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
            [(ngModel)]="selectedType"
            (ngModelChange)="filterAntiques()"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="">All Types</option>
            <option *ngFor="let type of uniqueTypes" [value]="type">{{ type }}</option>
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let antique of filteredAntiques" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img [src]="antique.image" [alt]="antique.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ antique.name }}</h2>
            <p class="text-gray-600 mb-2">{{ antique.type }} | {{ antique.year }}</p>
            <p class="text-gray-700 mb-4 line-clamp-2">{{ antique.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-teal\">{{ antique.price.toFixed(2) }}</span>
              <a [routerLink]="['/antiques', antique.id]" class="bg-teal text-white px-4 py-2 rounded hover:bg-teal/90 transition-colors">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredAntiques.length === 0" class="text-center py-8">
        <p class="text-xl text-gray-600">No antiques found matching your criteria.</p>
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
export class AntiquesComponent {
  antiques: Antique[] = [
    {
      id: 1,
      name: "Vintage Clock",
      type: "Clock",
      year: 1920,
      price: 299.99,
      image: "https://www.pelhamlibrary.org/wp-content/uploads/Antiques-in-Bundaberg.jpg",
      description: "Beautiful antique wall clock from 1920 with intricate carvings and a pendulum mechanism.",
    },
    {
      id: 2,
      name: "Art Deco Lamp",
      type: "Lighting",
      year: 1935,
      price: 450.0,
      image: "/assets/placeholder.svg",
      description: "Elegant Art Deco table lamp with a geometric design and original glass shade.",
    },
    {
      id: 3,
      name: "Victorian Writing Desk",
      type: "Furniture",
      year: 1880,
      price: 1200.0,
      image: "/assets/placeholder.svg",
      description: "Beautifully preserved Victorian-era writing desk with inlaid wood and original brass hardware.",
    },
    {
      id: 4,
      name: "Tiffany-style Stained Glass Window",
      type: "Decor",
      year: 1910,
      price: 3500.0,
      image: "/assets/placeholder.svg",
      description: "Stunning Tiffany-style stained glass window featuring a nature scene with vibrant colors.",
    },
    {
      id: 5,
      name: "Art Nouveau Vase",
      type: "Pottery",
      year: 1900,
      price: 750.0,
      image: "/assets/placeholder.svg",
      description: "Exquisite Art Nouveau vase with flowing lines and floral motifs, signed by the artist.",
    },
  ]

  filteredAntiques: Antique[] = this.antiques
  searchTerm = ""
  selectedType = ""
  sortBy = "name"

  get uniqueTypes(): string[] {
    return [...new Set(this.antiques.map((antique) => antique.type))]
  }

  filterAntiques() {
    this.filteredAntiques = this.antiques.filter(
      (antique) =>
        antique.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedType === "" || antique.type === this.selectedType),
    )

    this.filteredAntiques.sort((a, b) => {
      if (this.sortBy === "name") return a.name.localeCompare(b.name)
      if (this.sortBy === "year") return a.year - b.year
      if (this.sortBy === "price") return a.price - b.price
      return 0
    })
  }
}

