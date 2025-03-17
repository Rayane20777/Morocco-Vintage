import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"

interface Equipment {
  id: number
  model: string
  equipmentCondition: string
  material: string
  origin: string
  name: string
  description: string
  price: number
  year: number
  status: string
  image: string
}

@Component({
  selector: "app-equipment",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Music Equipment</h1>
      
      <div class="mb-8 flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-1/4">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterEquipment()"
            placeholder="Search equipment..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
          />
        </div>
        <div class="w-full md:w-1/4">
          <select
            [(ngModel)]="selectedCondition"
            (ngModelChange)="filterEquipment()"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="">All Conditions</option>
            <option *ngFor="let condition of uniqueConditions" [value]="condition">{{ condition }}</option>
          </select>
        </div>
        <div class="w-full md:w-1/4">
          <select
            [(ngModel)]="selectedOrigin"
            (ngModelChange)="filterEquipment()"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="">All Origins</option>
            <option *ngFor="let origin of uniqueOrigins" [value]="origin">{{ origin }}</option>
          </select>
        </div>
        <div class="w-full md:w-1/4">
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
        <div *ngFor="let item of filteredEquipment" class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img [src]="'/assets/' + item.image" [alt]="item.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
            <p class="text-gray-600 mb-2">{{ item.model }} | {{ item.year }}</p>
            <p class="text-gray-700 mb-2 line-clamp-2">{{ item.description }}</p>
            <p class="text-sm text-gray-600 mb-2">{{ item.material }}</p>
            <p class="text-sm text-gray-600 mb-2">Origin: {{ item.origin }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-lg font-bold text-teal">{{ item.price.toFixed(2) }}</span>
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
      </div>

      <div *ngIf="filteredEquipment.length === 0" class="text-center py-8">
        <p class="text-xl text-gray-600">No equipment found matching your criteria.</p>
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
export class EquipmentComponent {
  equipment: Equipment[] = [
    {
      id: 1,
      model: "Stratocaster",
      equipmentCondition: "REFURBISHED",
      material: "Maple and Alder",
      origin: "USA",
      name: "Vintage Guitar",
      description: "Beautiful vintage electric guitar with classic tone and playability.",
      price: 1299.99,
      year: 1975,
      status: "AVAILABLE",
      image: "67bdfd95a153021fccf2df8e.jpg",
    },
    {
      id: 2,
      model: "Jazz Bass",
      equipmentCondition: "USED",
      material: "Ash and Rosewood",
      origin: "Japan",
      name: "Vintage Bass Guitar",
      description: "Smooth playing vintage bass with rich, warm tone.",
      price: 1099.99,
      year: 1982,
      status: "LIMITED",
      image: "vintage-bass.jpg",
    },
    {
      id: 3,
      model: "Les Paul",
      equipmentCondition: "NEW",
      material: "Mahogany and Maple",
      origin: "USA",
      name: "Classic Electric Guitar",
      description: "Iconic electric guitar known for its sustain and rich tone.",
      price: 2499.99,
      year: 2023,
      status: "AVAILABLE",
      image: "les-paul.jpg",
    },
    {
      id: 4,
      model: "Tube Amplifier",
      equipmentCondition: "VINTAGE",
      material: "Steel and Wood",
      origin: "UK",
      name: "Classic Tube Amp",
      description: "Vintage tube amplifier with warm, rich sound.",
      price: 899.99,
      year: 1965,
      status: "SOLD OUT",
      image: "tube-amp.jpg",
    },
    {
      id: 5,
      model: "Dynamic Microphone",
      equipmentCondition: "NEW",
      material: "Metal",
      origin: "Germany",
      name: "Professional Vocal Mic",
      description: "High-quality dynamic microphone for studio and live performances.",
      price: 249.99,
      year: 2023,
      status: "AVAILABLE",
      image: "dynamic-mic.jpg",
    },
  ]

  filteredEquipment: Equipment[] = this.equipment
  searchTerm = ""
  selectedCondition = ""
  selectedOrigin = ""
  sortBy = "name"

  get uniqueConditions(): string[] {
    return [...new Set(this.equipment.map((item) => item.equipmentCondition))]
  }

  get uniqueOrigins(): string[] {
    return [...new Set(this.equipment.map((item) => item.origin))]
  }

  filterEquipment() {
    this.filteredEquipment = this.equipment.filter(
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
  }
}

