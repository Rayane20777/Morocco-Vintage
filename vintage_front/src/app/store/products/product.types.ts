export type ProductType = "VINYL" | "ANTIQUE" | "EQUIPMENT"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  boughtPrice: number
  status: string
  type: ProductType
  year: number
  image?: string

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

export interface ProductState {
  products: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
}

// Fix the ProductFormData interface to include boughtPrice and add index signature
export interface ProductFormData {
  name: string
  description: string
  price: number
  boughtPrice: number // Changed from bought_price to boughtPrice for consistency
  year: number
  status: string
  type: ProductType
  image?: File
  [key: string]: any // Add index signature to allow string indexing
}

