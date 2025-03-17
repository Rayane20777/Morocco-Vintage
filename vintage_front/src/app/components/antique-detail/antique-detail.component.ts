import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-antique-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <nav class="mb-8 text-sm" aria-label="Breadcrumb">
          <ol class="list-none p-0 inline-flex">
            <li class="flex items-center">
              <a routerLink="/" class="text-gray-500 hover:text-gray-700">Home</a>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li class="flex items-center">
              <a routerLink="/antiques" class="text-gray-500 hover:text-gray-700">Antiques</a>
              <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li>
              <span class="text-gray-700" aria-current="page">{{ antique.name }}</span>
            </li>
          </ol>
        </nav>

        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
          <div class="md:flex">
            <div class="md:flex-shrink-0">
              <img class="h-96 w-full object-cover md:w-96" [src]="antique.productImage" [alt]="antique.name">
            </div>
            <div class="p-8 flex flex-col justify-between">
              <div>
                <div class="uppercase tracking-wide text-sm text-teal font-semibold">{{ antique.type }}</div>
                <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ antique.name }}</h1>
                <p class="mt-4 text-gray-600">{{ antique.description }}</p>
                
                <div class="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <h2 class="text-sm font-medium text-gray-500">Origin</h2>
                    <p class="mt-1 text-sm text-gray-900">{{ antique.origin }}</p>
                  </div>
                  <div>
                    <h2 class="text-sm font-medium text-gray-500">Year</h2>
                    <p class="mt-1 text-sm text-gray-900">{{ antique.year }}</p>
                  </div>
                  <div>
                    <h2 class="text-sm font-medium text-gray-500">Material</h2>
                    <p class="mt-1 text-sm text-gray-900">{{ antique.material }}</p>
                  </div>
                  <div>
                    <h2 class="text-sm font-medium text-gray-500">Condition</h2>
                    <p class="mt-1 text-sm text-gray-900">{{ antique.condition }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-8">
                <div class="flex items-center justify-between">
                  <span class="text-3xl font-bold text-gray-900\">{{ antique.price }}</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" [ngClass]="{
                    'bg-green-100 text-green-800': antique.status === 'AVAILABLE',
                    'bg-red-100 text-red-800': antique.status !== 'AVAILABLE'
                  }">
                    {{ antique.status }}
                  </span>
                </div>
                <button class="mt-4 w-full bg-teal hover:bg-teal/90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105" [disabled]="antique.status !== 'AVAILABLE'">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-8 py-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
            <p class="text-gray-600">
              This beautiful {{ antique.name }} is a rare find from {{ antique.origin }}. Crafted in {{ antique.year }}, 
              it showcases the exquisite craftsmanship of its time. Made from {{ antique.material }}, this piece is in 
              {{ antique.condition.toLowerCase() }} condition, making it a valuable addition to any antique collection.
            </p>
            <p class="mt-4 text-gray-600">
              Added to our collection on {{ formatDate(antique.dateAdded) }}, this {{ antique.type.toLowerCase() }} 
              piece brings a touch of history and elegance to any space.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AntiqueDetailComponent {
  antique = {
    origin: "France",
    material: "Wood and Brass",
    condition: "Good",
    type: "ANTIQUE",
    name: "Vintage Clock",
    description:
      "Beautiful antique wall clock with intricate carvings and a pendulum mechanism. This piece showcases the craftsmanship of early 20th century French clockmakers.",
    price: "299.99",
    year: 1920,
    status: "AVAILABLE",
    productImage: "/assets/placeholder.svg", // Replace with actual image path
    active: true,
    dateAdded: new Date("2025-02-24T15:06:07.891+00:00"),
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }
}

