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
import { ProductType } from "../../../store/products/product.types"
import { selectSelectedProductType } from "../../../store/products/product.selectors"

// Define ProductType type

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
  artists?: string[]
  genres?: string[]
  styles?: string[]
  format?: string[]
  discogsId?: number
  typeId?: string
  condition?: string
  material?: string
  origin?: string
  model?: string
  equipmentCondition?: string
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
            (click)="setProductType('MUSIC_EQUIPMENT')" 
            class="px-4 py-2 font-medium text-sm transition-colors relative"
            [class.text-teal]="selectedProductType === 'MUSIC_EQUIPMENT'"
            [class.text-gray-600]="selectedProductType !== 'MUSIC_EQUIPMENT'"
          >
            Equipment
            <span 
              *ngIf="selectedProductType === 'MUSIC_EQUIPMENT'" 
              class="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
            ></span>
          </button>
        </nav>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="relative flex-grow">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <!-- Common columns for all types -->
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bought Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

                <!-- Vinyl specific columns -->
                @if (selectedProductType === 'VINYL') {
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artists</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Styles</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                }

                <!-- Antique specific columns -->
                @if (selectedProductType === 'ANTIQUE') {
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                }

                <!-- Equipment specific columns -->
                @if (selectedProductType === 'MUSIC_EQUIPMENT') {
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                }

                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (product of filteredProducts; track product.id) {
                <tr>
                  <!-- Common columns for all types -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                        @if (product.imageUrl) {
                          <img [src]="product.imageUrl" [alt]="product.name" class="h-10 w-10 object-cover rounded-md">
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        }
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ product.name || 'Unnamed Product' }}</div>
                        <div class="text-sm text-gray-500">{{ product.description || 'No description' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.type || 'Unknown Type' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{{ product.boughtPrice?.toFixed(2) || '0.00' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{{ product.price?.toFixed(2) || '0.00' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm" [ngClass]="{'text-green-600': (product.price - product.boughtPrice) > 0, 'text-red-600': (product.price - product.boughtPrice) < 0}">
                    £{{ ((product.price || 0) - (product.boughtPrice || 0)).toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': product.status === 'AVAILABLE',
                        'bg-red-100 text-red-800': product.status === 'SOLD OUT',
                        'bg-yellow-100 text-yellow-800': product.status !== 'AVAILABLE' && product.status !== 'SOLD OUT'
                      }"
                    >
                      {{ product.status || 'Unknown' }}
                    </span>
                  </td>

                  <!-- Vinyl specific columns -->
                  @if (selectedProductType === 'VINYL') {
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.artists?.join(', ') || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.genres?.join(', ') || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.styles?.join(', ') || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.format?.join(', ') || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.year || 'N/A' }}</td>
                  }

                  <!-- Antique specific columns -->
                  @if (selectedProductType === 'ANTIQUE') {
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.typeId || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.condition || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.material || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.origin || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.year || 'N/A' }}</td>
                  }

                  <!-- Equipment specific columns -->
                  @if (selectedProductType === 'MUSIC_EQUIPMENT') {
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.model || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.equipmentCondition || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.year || 'N/A' }}</td>
                  }

                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="editProduct(product)" class="text-teal hover:text-teal/80 mr-3">Edit</button>
                    <button (click)="deleteProduct(product.id)" class="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              }
              @if (filteredProducts.length === 0) {
                <tr>
                  <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                    No products found. Try adjusting your filters or add new products.
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
  searchTerm = ""

  selectedProductType$: Observable<ProductType>
  selectedProductType: ProductType = 'VINYL'

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
    this.selectedProductType$ = this.store.select(selectSelectedProductType)

    // Subscribe to products$ to update local array
    this.products$.subscribe((products) => {
      this.products = products
      this.applyFilters()
    })

    // Subscribe to selectedProductType$ to update local value
    this.selectedProductType$.subscribe((type) => {
      this.selectedProductType = type
      this.applyFilters()
    })
  }

  ngOnInit() {
    this.loadProducts()

    // Add logging to debug the products data
    this.products$.subscribe((products) => {
      console.log("Products received in component:", products)
      this.products = products
      this.applyFilters()
    })
  }

  loadProducts() {
    // Load products with the selected type
    this.store.dispatch(
      ProductActions.loadProducts({
        productType: this.selectedProductType
      })
    )
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

    // Get the token for authentication
    const token = localStorage.getItem("token") || ""

    switch (this.selectedProductType) {
      case "VINYL":
        this.store.dispatch(ProductActions.createProduct({ product: data }))
        break
      case "ANTIQUE":
        this.store.dispatch(ProductActions.createProduct({ product: data }))
        break
      case "MUSIC_EQUIPMENT":
        this.store.dispatch(ProductActions.createProduct({ product: data }))
        break
      default:
        console.error("Invalid product type:", this.selectedProductType)
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
      this.store.dispatch(ProductActions.deleteProduct({ id, productType: this.selectedProductType }))
    }
  }

  setProductType(type: string) {
    this.selectedProductType = type as ProductType;
    this.store.dispatch(ProductActions.setProductType({ productType: type as ProductType }));
    this.loadProducts();
  }

  applyFilters() {
    console.log("Applying search to products:", this.products)
    console.log("Current search term:", this.searchTerm)
    console.log("Selected product type:", this.selectedProductType)

    if (!this.products || this.products.length === 0) {
      this.filteredProducts = []
      return
    }

    // Filter by product type
    let typeFilteredProducts = this.products.filter((product) => {
      // For debugging
      console.log("Product being filtered:", {
        id: product.id,
        name: product.name,
        type: product.type,
        selectedType: this.selectedProductType,
        equipmentFields: {
          model: product.model,
          equipmentCondition: product.equipmentCondition,
          material: product.material,
          origin: product.origin
        }
      });

      // For music equipment, check both type and fields
      if (this.selectedProductType === 'MUSIC_EQUIPMENT') {
        const isMusicEquipment = product.type === 'MUSIC_EQUIPMENT' || 
          (product.model && product.equipmentCondition);
        console.log("Is music equipment?", isMusicEquipment);
        return isMusicEquipment;
      }

      // For other types, check type-specific fields
      if (this.selectedProductType === 'ANTIQUE' && 
          (product.typeId || product.condition || (product.material && product.origin))) {
        return true;
      }
      if (this.selectedProductType === 'VINYL' && 
          (product.artists || product.genres || product.styles || product.format)) {
        return true;
      }

      // Fallback to type field if no type-specific fields match
      return product.type === this.selectedProductType;
    });

    // Then apply search filter only if there's a search term
    if (this.searchTerm && this.searchTerm.trim() !== "") {
      this.filteredProducts = typeFilteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (product.artists &&
            product.artists.some((artist) => artist.toLowerCase().includes(this.searchTerm.toLowerCase()))),
      )
    } else {
      this.filteredProducts = typeFilteredProducts
    }

    console.log("Type filtered products:", typeFilteredProducts.length)
    console.log("Final filtered products:", this.filteredProducts.length)
    console.log("Final filtered products:", this.filteredProducts)
  }

  private prepareFormData(formData: ProductFormData): FormData {
    const data = new FormData()

    // Add common fields
    data.append('name', formData.name)
    data.append('description', formData.description)
    data.append('price', formData.price.toString())
    data.append('bought_price', formData.boughtPrice.toString())
    data.append('year', formData.year.toString())
    data.append('status', formData.status)
    data.append('type', formData.type)

    // Add type-specific fields
    if (formData.type === 'VINYL') {
      if (formData.artists) data.append('artists', JSON.stringify(formData.artists))
      if (formData.genres) data.append('genres', JSON.stringify(formData.genres))
      if (formData.styles) data.append('styles', JSON.stringify(formData.styles))
      if (formData.format) data.append('format', JSON.stringify(formData.format))
      if (formData.discogsId) data.append('discogsId', formData.discogsId.toString())
    } else if (formData.type === 'ANTIQUE') {
      if (formData.typeId) data.append('typeId', formData.typeId)
      if (formData.condition) data.append('condition', formData.condition)
      if (formData.material) data.append('material', formData.material)
      if (formData.origin) data.append('origin', formData.origin)
    } else if (formData.type === 'MUSIC_EQUIPMENT') {
      if (formData.model) data.append('model', formData.model)
      if (formData.equipmentCondition) data.append('equipmentCondition', formData.equipmentCondition)
      if (formData.material) data.append('material', formData.material)
      if (formData.origin) data.append('origin', formData.origin)
    }

    // Add image if present
    if (formData.image) {
      data.append('image', formData.image)
    }

    return data
  }
}

