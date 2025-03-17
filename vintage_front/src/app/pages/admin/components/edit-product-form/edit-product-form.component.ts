import { Component, Input, Output, EventEmitter, type OnInit } from "@angular/core"
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
  selector: "app-edit-product-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./edit-product-form.component.html",
  styleUrls: ["./edit-product-form.component.css"],
})
export class EditProductFormComponent implements OnInit {
  @Input() product!: Product
  @Output() formSubmit = new EventEmitter<Product>()
  @Output() formCancel = new EventEmitter<void>()

  editedProduct!: Product

  // Input fields for array values
  artistsInput = ""
  genresInput = ""
  stylesInput = ""
  formatInput = ""

  // Image handling
  imagePreview: string | ArrayBuffer | null = null
  imageFile: File | null = null

  ngOnInit() {
    this.editedProduct = { ...this.product }

    // Initialize array input fields if product is vinyl
    if (this.editedProduct.type === "VINYL") {
      this.artistsInput = this.editedProduct.artists?.join(", ") || ""
      this.genresInput = this.editedProduct.genres?.join(", ") || ""
      this.stylesInput = this.editedProduct.styles?.join(", ") || ""
      this.formatInput = this.editedProduct.format?.join(", ") || ""
    }

    // Initialize image preview if product has an image
    if (this.editedProduct.imageUrl) {
      this.imagePreview = this.editedProduct.imageUrl
    }
  }

  setProductType(type: string) {
    this.editedProduct.type = type
    this.onTypeChange()
  }

  onTypeChange() {
    // Reset type-specific fields when type changes
    if (this.editedProduct.type === "VINYL") {
      this.editedProduct.artists = []
      this.editedProduct.genres = []
      this.editedProduct.styles = []
      this.editedProduct.format = []
      this.editedProduct.discogsId = undefined

      // Clear equipment and antique fields
      this.editedProduct.model = undefined
      this.editedProduct.equipmentCondition = undefined
      this.editedProduct.material = undefined
      this.editedProduct.origin = undefined
      this.editedProduct.typeId = undefined
      this.editedProduct.condition = undefined

      // Reset input fields
      this.artistsInput = ""
      this.genresInput = ""
      this.stylesInput = ""
      this.formatInput = ""
    } else if (this.editedProduct.type === "EQUIPMENT") {
      this.editedProduct.model = ""
      this.editedProduct.equipmentCondition = "GOOD"
      this.editedProduct.material = ""
      this.editedProduct.origin = ""

      // Clear vinyl and antique fields
      this.editedProduct.artists = undefined
      this.editedProduct.genres = undefined
      this.editedProduct.styles = undefined
      this.editedProduct.format = undefined
      this.editedProduct.discogsId = undefined
      this.editedProduct.typeId = undefined
      this.editedProduct.condition = undefined
    } else if (this.editedProduct.type === "ANTIQUE") {
      this.editedProduct.typeId = "CLOCK"
      this.editedProduct.origin = ""
      this.editedProduct.material = ""
      this.editedProduct.condition = "Good"

      // Clear vinyl and equipment fields
      this.editedProduct.artists = undefined
      this.editedProduct.genres = undefined
      this.editedProduct.styles = undefined
      this.editedProduct.format = undefined
      this.editedProduct.discogsId = undefined
      this.editedProduct.model = undefined
      this.editedProduct.equipmentCondition = undefined
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
    return this.editedProduct.price - this.editedProduct.boughtPrice
  }

  calculateProfitPercentage(): number {
    if (this.editedProduct.boughtPrice === 0) return 0
    const percentage =
      ((this.editedProduct.price - this.editedProduct.boughtPrice) / this.editedProduct.boughtPrice) * 100
    return Math.round(percentage)
  }

  onSubmit() {
    // Process array inputs before submitting
    if (this.editedProduct.type === "VINYL") {
      this.editedProduct.artists = this.artistsInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.editedProduct.genres = this.genresInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.editedProduct.styles = this.stylesInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
      this.editedProduct.format = this.formatInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
    }

    // In a real application, you would upload the image to a server
    // and get back a URL to store in the product object
    if (this.imageFile) {
      // For demo purposes, we'll just use the preview as the URL
      this.editedProduct.imageUrl = this.imagePreview as string
    }

    this.formSubmit.emit(this.editedProduct)
  }

  cancel() {
    this.formCancel.emit()
  }
}

