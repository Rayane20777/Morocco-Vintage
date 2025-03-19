import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { AddProductFormComponent } from "../components/add-product-form/add-product-form.component"
import { EditProductFormComponent } from "../components/edit-product-form/edit-product-form.component"
import { ModalComponent } from "../../../components/modal/modal.component"
import { Store } from "@ngrx/store"
import type { Observable } from "rxjs"
import { ProductActions } from "../../../store/products/product.actions"
import type { Product, ProductState } from "../../../store/products/product.types"

// Define ProductType type
type ProductType = "VINYL" | "ANTIQUE" | "EQUIPMENT" | "all"

// Define form event types
interface ProductFormData {
  name: string
  description: string
  price: number
  boughtPrice: number
  year: number
  status: string
  type: ProductType
  image?: File
  [key: string]: any // This allows string indexing
}

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    AddProductFormComponent,
    EditProductFormComponent,
    ModalComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Products</h1>
          <p class="text-gray-500 mt-1">Manage your inventory of vinyl records, antiques, and equipment</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button (click)="showAddForm()" class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      <!-- Add Product Modal -->
      <app-modal [isOpen]="showAddProductForm" (close)="closeAddForm()" title="Add New Product">
        <app-add-product-form (formSubmit)="onAddProduct($event)" (formCancel)="closeAddForm()"></app-add-product-form>
      </app-modal>

      <!-- Edit Product Modal -->
      <app-modal [isOpen]="showEditProductForm" (close)="closeEditForm()" title="Edit Product">
        <app-edit-product-form *ngIf="currentProduct" [product]="currentProduct" (formSubmit)="onEditProduct($event)" (formCancel)="closeEditForm()"></app-edit-product-form>
      </app-modal>

      <!-- Product Type Navigation -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <nav class="flex space-x-2 border-b">
          <button 
            (click)="setProductType('all')" 
            class="px-4 py-2 font-medium text-sm transition-colors relative"
            [class.text-teal]="selectedProductType === 'all'"
            [class.text-gray-600]="selectedProductType !== 'all'"
          >
            All Products
            <span 
              *ngIf="selectedProductType === 'all'" 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
            ></span>
          </button>
          <button 
            (click)="setProductType('VINYL')" 
            class="px-4 py-2 font-medium text-sm transition-colors relative"
            [class.text-teal]="selectedProductType === 'VINYL'"
            [class.text-gray-600]="selectedProductType !== 'VINYL'"
          >
            Vinyl Records
            <span 
              *ngIf="selectedProductType === 'VINYL'" 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
            ></span>
          </button>
          <button 
            (click)="setProductType('ANTIQUE')" 
            class="px-4 py-2 font-medium text-sm transition-colors relative"
            [class.text-teal]="selectedProductType === 'ANTIQUE'"
            [class.text-gray-600]="selectedProductType !== 'ANTIQUE'"
          >
            Antiques
            <span 
              *ngIf="selectedProductType === 'ANTIQUE'" 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
            ></span>
          </button>
          <button 
            (click)="setProductType('EQUIPMENT')" 
            class="px-4 py-2 font-medium text-sm transition-colors relative"
            [class.text-teal]="selectedProductType === 'EQUIPMENT'"
            [class.text-gray-600]="selectedProductType !== 'EQUIPMENT'"
          >
            Equipment
            <span 
              *ngIf="selectedProductType === 'EQUIPMENT'" 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
            ></span>
          </button>
        </nav>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="filters.search"
              placeholder="Search products..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              [(ngModel)]="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Rock">Rock</option>
              <option value="Jazz">Jazz</option>
              <option value="Pop">Pop</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Classical">Classical</option>
              <option value="Equipment">Equipment</option>
              <option value="Antique">Antique</option>
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              [(ngModel)]="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort"
              [(ngModel)]="filters.sort"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            (click)="applyFilters()"
            class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bought Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (product of filteredProducts; track product.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                        <div class="text-sm text-gray-500">{{ product.artists?.[0] }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.genres?.[0] || product.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{{ product.boughtPrice.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{{ product.price.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" [ngClass]="{'text-green-600': product.price - product.boughtPrice > 0, 'text-red-600': product.price - product.boughtPrice < 0}">
                    £{{ (product.price - product.boughtPrice).toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': product.status === 'Available',
                        'bg-red-100 text-red-800': product.status === 'Sold Out'
                      }"
                    >
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="editProduct(product)" class="text-teal hover:text-teal/80 mr-3">Edit</button>
                    <button (click)="deleteProduct(product.id)" class="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredProducts.length }}</span> of <span class="font-medium">{{ filteredProducts.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  filters = {
    search: "",
    category: "",
    status: "",
    sort: "name",
  }

  selectedProductType: ProductType = "all"

  products$: Observable<Product[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>

  showAddProductForm = false
  showEditProductForm = false
  currentProduct: Product | null = null

  products: Product[] = []
  filteredProducts: Product[] = []

  constructor(private store: Store<{ products: ProductState }>) {
    this.products$ = this.store.select((state) => state.products.products)
    this.loading$ = this.store.select((state) => state.products.loading)
    this.error$ = this.store.select((state) => state.products.error)

    // Subscribe to products$ to update local array
    this.products$.subscribe((products) => {
      this.products = products
      this.applyFilters()
    })
  }

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.store.dispatch(ProductActions["loadProducts"]({ productType: this.selectedProductType }))
  }

  showAddForm() {
    this.showAddProductForm = true
  }

  closeAddForm() {
    this.showAddProductForm = false
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product }
    this.showEditProductForm = true
  }

  closeEditForm() {
    this.showEditProductForm = false
    this.currentProduct = null
  }

  onAddProduct(formData: any) {
    // Cast the form data to ensure type compatibility
    const typedFormData: ProductFormData = {
      ...formData,
      type: formData.type as ProductType,
    }

    // Convert form data to FormData
    const data = this.prepareFormData(typedFormData)

    switch (this.selectedProductType) {
      case "VINYL":
        this.store.dispatch(ProductActions["createProduct"]({ product: data }))
        break
      case "ANTIQUE":
        // ... handle antique creation
        break
      case "EQUIPMENT":
        // ... handle equipment creation
        break
    }
    this.closeAddForm()
  }

  onEditProduct(formData: any) {
    if (!this.currentProduct) return

    // Cast the form data to ensure type compatibility
    const typedFormData: ProductFormData = {
      ...formData,
      type: formData.type as ProductType,
    }

    // Convert form data to FormData
    const data = this.prepareFormData(typedFormData)

    this.store.dispatch(
      ProductActions["updateProduct"]({
        id: this.currentProduct.id,
        product: data,
      }),
    )
    this.closeEditForm()
  }

  deleteProduct(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter((p) => p.id !== id)
      this.applyFilters()
    }
  }

  setProductType(type: ProductType) {
    this.selectedProductType = type
    this.loadProducts()
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const typeMatch = this.selectedProductType === "all" || product.type === this.selectedProductType
      const searchMatch =
        this.filters.search === "" ||
        product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        (product.artists &&
          product.artists.some((artist) => artist.toLowerCase().includes(this.filters.search.toLowerCase())))
      const statusMatch = this.filters.status === "" || product.status === this.filters.status

      return typeMatch && searchMatch && statusMatch
    })

    if (this.filters.sort === "name") {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
    } else if (this.filters.sort === "price") {
      this.filteredProducts.sort((a, b) => a.price - b.price)
    }
  }

  private prepareFormData(formData: ProductFormData): FormData {
    const data = new FormData()

    Object.keys(formData).forEach((key) => {
      const value = formData[key]
      if (value !== undefined) {
        if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value))
        } else if (value instanceof File) {
          data.append(key, value)
        } else {
          data.append(key, String(value))
        }
      }
    })

    return data
  }
}

