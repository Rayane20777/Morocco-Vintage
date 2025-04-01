export interface Antique {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  condition: string
  year: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  materials: string[]
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED'
  createdAt: string
  updatedAt: string
} 