import { Component, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Product {
  id: number
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

@Component({
  selector: "app-add-product-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add-product-form.component.html",
  styleUrls: ["./add-product-form.component.css"],
})
export class AddProductFormComponent {
  @Output() formSubmit = new EventEmitter<Product>()
  @Output() formCancel = new EventEmitter<void>()

  product: Product = {
    id: 0,
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
    } else if (this.product.type === "EQUIPMENT") {
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
      this.product.artists = this.artistsInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.product.genres = this.genresInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.product.styles = this.stylesInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.product.format = this.formatInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
    }

    // In a real application, you would upload the image to a server
    // and get back a URL to store in the product object
    if (this.imagePreview) {
      // For demo purposes, we'll just use the preview as the URL
      this.product.imageUrl = this.imagePreview as string
    }

    this.formSubmit.emit(this.product)
  }

  cancel() {
    this.formCancel.emit()
  }
}

