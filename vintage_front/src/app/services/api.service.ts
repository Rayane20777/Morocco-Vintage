import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import { Product, ProductType } from "../store/products/product.types"

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = "http://localhost:8081/api" // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getAllVinyls(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vinyls`).pipe(
      map((response) => this.mapResponseToProducts(response)),
      catchError((error) => {
        console.error("Error fetching vinyls:", error)
        return of([])
      }),
    )
  }

  getAllAntiques(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/antiques`).pipe(
      map((response) => this.mapResponseToProducts(response)),
      catchError((error) => {
        console.error("Error fetching antiques:", error)
        return of([])
      }),
    )
  }

  getAllEquipment(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/music-equipment`).pipe(
      map((response) => this.mapResponseToProducts(response)),
      catchError((error) => {
        console.error("Error fetching equipment:", error)
        return of([])
      }),
    )
  }

  // Helper method to ensure consistent mapping from API response to Product objects
  private mapResponseToProducts(response: any[]): Product[] {
    if (!Array.isArray(response)) {
      console.error("Expected array response but got:", response)
      return []
    }

    return response.map((item) => {
      // Convert price strings to numbers, handling both backend formats
      const price =
        typeof item.price === "string" ? Number.parseFloat(item.price) : typeof item.price === "number" ? item.price : 0

      const boughtPrice =
        typeof item.bought_price === "string"
          ? Number.parseFloat(item.bought_price)
          : typeof item.bought_price === "number"
            ? item.bought_price
            : 0

      // Ensure all required properties are present with default values if needed
      return {
        id: item.id || "",
        name: item.name || "Unnamed Product",
        description: item.description || "",
        price: price,
        boughtPrice: boughtPrice,
        status: item.status || "AVAILABLE",
        type: item.type || "VINYL",
        year: typeof item.year === "number" ? item.year : new Date().getFullYear(),
        // Include optional properties if they exist
        artists: Array.isArray(item.artists) ? item.artists : [],
        genres: Array.isArray(item.genres) ? item.genres : [],
        styles: Array.isArray(item.styles) ? item.styles : [],
        format: Array.isArray(item.format) ? item.format : [],
        discogsId: item.discogsId,
        model: item.model,
        equipmentCondition: item.equipmentCondition,
        material: item.material,
        origin: item.origin,
        typeId: item.typeId,
        condition: item.condition,
        // Add image URL if available
        imageUrl: item.imageUrl || item.image || "/assets/placeholder.svg",
      }
    })
  }

  createVinyl(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/vinyls`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error creating vinyl:", error)
        throw error
      }),
    )
  }

  updateVinyl(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/vinyls/${id}`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error updating vinyl:", error)
        throw error
      }),
    )
  }

  deleteVinyl(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/vinyls/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting vinyl:", error)
        throw error
      }),
    )
  }

  createAntique(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/antiques`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error creating antique:", error)
        throw error
      }),
    )
  }

  updateAntique(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/antiques/${id}`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error updating antique:", error)
        throw error
      }),
    )
  }

  deleteAntique(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/antiques/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting antique:", error)
        throw error
      }),
    )
  }

  createEquipment(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/music-equipment`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error creating equipment:", error)
        throw error
      }),
    )
  }

  updateEquipment(id: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/music-equipment/${id}`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error updating equipment:", error)
        throw error
      }),
    )
  }

  deleteEquipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/music-equipment/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting equipment:", error)
        throw error
      }),
    )
  }

  getProducts(productType: string): Observable<Product[]> {
    // Determine the correct endpoint based on product type
    let endpoint
    switch (productType) {
      case "VINYL":
        endpoint = `${this.apiUrl}/vinyls`
        break
      case "ANTIQUE":
        endpoint = `${this.apiUrl}/antiques`
        break
      case "MUSIC_EQUIPMENT":
        endpoint = `${this.apiUrl}/music-equipment`
        break
      default:
        endpoint = `${this.apiUrl}/products`
    }

    return this.http.get<Product[]>(endpoint).pipe(
      map((response) => this.mapResponseToProducts(response)),
      catchError((error) => {
        console.error(`Error fetching ${productType} products:`, error)
        return of(this.getMockProducts(productType))
      }),
    )
  }

  // Add mock data for development
  private getMockProducts(type: string): Product[] {
    return [
      {
        id: "1",
        name: "Sample Product",
        description: "This is a sample product for development",
        price: 29.99,
        boughtPrice: 15.0,
        status: "AVAILABLE",
        type: type as ProductType,
        year: 2023,
        imageUrl: "/assets/placeholder.svg",
      },
    ]
  }

  createProduct(product: FormData): Observable<Product> {
    const productType = product.get("type") as string

    switch (productType) {
      case "VINYL":
        return this.createVinyl(product)
      case "ANTIQUE":
        return this.createAntique(product)
      case "MUSIC_EQUIPMENT":
        return this.createEquipment(product)
      default:
        throw new Error(`Invalid product type: ${productType}`)
    }
  }

  updateProduct(id: string, product: FormData): Observable<Product> {
    const productType = product.get("type") as string

    switch (productType) {
      case "VINYL":
        return this.updateVinyl(id, product)
      case "ANTIQUE":
        return this.updateAntique(id, product)
      case "MUSIC_EQUIPMENT":
        return this.updateEquipment(id, product)
      default:
        throw new Error(`Invalid product type: ${productType}`)
    }
  }

  deleteProduct(id: string, token?: string): Observable<void> {
    // Since we don't have the product type in the delete action,
    // we'll need to get it from the store or pass it as a parameter
    // For now, we'll throw an error to indicate this needs to be handled
    throw new Error("Product type must be specified for deletion")
  }
}

