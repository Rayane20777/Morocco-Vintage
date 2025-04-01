import { Component, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Product {
  id: string
  name: string
  description: string
  price: number
  boughtPrice: number
  status: string
  type: string
  year: number
  imageUrl?: string

  // Vinyl specific fields
  artists?: string[]
  genres?: string[]
  styles?: string[]
  format?: string[]
  discogsId?: number

  // Equipment specific fields
  model?: string
  equipmentCondition?: string
  material?: string
  origin?: string

  // Antique specific fields
  typeId?: string
  condition?: string
}

// Also update the ProductFormData interface to match
interface ProductFormData {
  id: string
  name: string
  description: string
  price: number
  boughtPrice: number
  status: string
  type: string
  year: number
  imageUrl?: string
  // ... other form fields
}

@Component({
  selector: "app-add-product-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add-product-form.component.html",
  styleUrls: ["./add-product-form.component.css"],
})
export class AddProductFormComponent {
  @Output() formSubmit = new EventEmitter<FormData>()
  @Output() formCancel = new EventEmitter<void>()

  product: Product = {
    id: "0",
    name: "",
    description: "",
    price: 0,
    boughtPrice: 0,
    status: "AVAILABLE",
    type: "VINYL",
    year: new Date().getFullYear(),
  }

  // Input fields for array values
  artistsInput = ""
  genresInput = ""
  stylesInput = ""
  formatInput = ""

  // Image handling
  imagePreview: string | ArrayBuffer | null = null
  imageFile: File | null = null

  setProductType(type: string) {
    this.product.type = type
    this.onTypeChange()
  }

  onTypeChange() {
    // Reset type-specific fields when type changes
    if (this.product.type === "VINYL") {
      this.product.artists = []
      this.product.genres = []
      this.product.styles = []
      this.product.format = []
      this.product.discogsId = undefined

      // Clear equipment and antique fields
      this.product.model = undefined
      this.product.equipmentCondition = undefined
      this.product.material = undefined
      this.product.origin = undefined
      this.product.typeId = undefined
      this.product.condition = undefined
    } else if (this.product.type === "MUSIC_EQUIPMENT") {
      this.product.model = ""
      this.product.equipmentCondition = "GOOD"
      this.product.material = ""
      this.product.origin = ""

      // Clear vinyl and antique fields
      this.product.artists = undefined
      this.product.genres = undefined
      this.product.styles = undefined
      this.product.format = undefined
      this.product.discogsId = undefined
      this.product.typeId = undefined
      this.product.condition = undefined
    } else if (this.product.type === "ANTIQUE") {
      this.product.typeId = "CLOCK"
      this.product.origin = ""
      this.product.material = ""
      this.product.condition = "Good"

      // Clear vinyl and equipment fields
      this.product.artists = undefined
      this.product.genres = undefined
      this.product.styles = undefined
      this.product.format = undefined
      this.product.discogsId = undefined
      this.product.model = undefined
      this.product.equipmentCondition = undefined
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.imageFile = file
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  calculateProfit(): number {
    return this.product.price - this.product.boughtPrice
  }

  calculateProfitPercentage(): number {
    if (this.product.boughtPrice === 0) return 0
    const percentage = ((this.product.price - this.product.boughtPrice) / this.product.boughtPrice) * 100
    return Math.round(percentage)
  }

  onSubmit() {
    // Process array inputs before submitting
    if (this.product.type === "VINYL") {
      // Fix: Properly parse arrays without extra quotes
      this.product.artists = this.parseArrayInput(this.artistsInput)
      this.product.genres = this.parseArrayInput(this.genresInput)
      this.product.styles = this.parseArrayInput(this.stylesInput)
      this.product.format = this.parseArrayInput(this.formatInput)
    }

    // Create a FormData object with the product data
    const formData = new FormData()
    formData.append('name', this.product.name)
    formData.append('description', this.product.description)
    formData.append('price', this.product.price.toString())
    formData.append('boughtPrice', this.product.boughtPrice.toString())
    formData.append('year', this.product.year.toString())
    formData.append('status', this.product.status)
    formData.append('type', this.product.type)

    // Add type-specific fields
    if (this.product.type === "VINYL") {
      if (this.product.artists) formData.append('artists', JSON.stringify(this.product.artists))
      if (this.product.genres) formData.append('genres', JSON.stringify(this.product.genres))
      if (this.product.styles) formData.append('styles', JSON.stringify(this.product.styles))
      if (this.product.format) formData.append('format', JSON.stringify(this.product.format))
      if (this.product.discogsId) formData.append('discogsId', this.product.discogsId.toString())
    }

    // Add image if present
    if (this.imageFile) {
      formData.append('image', this.imageFile)
    }

    this.formSubmit.emit(formData)
  }

  // Helper method to properly parse comma-separated values into an array
  private parseArrayInput(input: string): string[] {
    if (!input || input.trim() === "") {
      return []
    }

    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
  }

  cancel() {
    this.formCancel.emit()
  }
}

