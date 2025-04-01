export type ProductType = "VINYL" | "ANTIQUE" | "MUSIC_EQUIPMENT"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  boughtPrice: number
  status: string
  type: ProductType
  year: number
  imageUrl?: string
  image?: string
  imageId?: string

  // Vinyl specific fields
  artists?: string[]
  genres?: string[]
  styles?: string[]
  format?: string[]
  discogsId?: number
  instanceId?: number
  dateAdded?: Date
  thumbImageUrl?: string
  coverImageUrl?: string
  active?: boolean

  // Additional vinyl fields
  label?: string
  catalogNumber?: string
  country?: string
  mediaCondition?: string
  sleeveCondition?: string
  trackList?: string[]
  condition?: string
  rating?: number

  // Equipment specific fields
  model?: string
  equipmentCondition?: string
  material?: string
  origin?: string

  // Antique specific fields
  typeId?: string
}

export interface ProductState {
  products: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
  selectedProductType: ProductType
  filteredProducts: Product[]
  filters: ProductFilters
}

export interface ProductFilters {
  category: string[]
  price: { min: number; max: number }
  condition: string[]
  genre?: string[]
  style?: string[]
  searchTerm?: string
}

// Fix the ProductFormData interface to include boughtPrice and add index signature
export interface ProductFormData {
  name: string
  description: string
  price: number
  boughtPrice: number
  year: number
  status: string
  type: ProductType
  image?: File
  [key: string]: any // Add index signature to allow string indexing
}

