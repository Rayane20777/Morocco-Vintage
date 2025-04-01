import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, of, throwError } from "rxjs"
import { map, catchError, tap } from "rxjs/operators"
import { Product, ProductType } from "../store/products/product.types"
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  getAllVinyls(): Observable<Product[]> {
    console.log("Fetching all vinyls from API")
    return this.http.get<any[]>(`${this.apiUrl}/vinyls`).pipe(
      tap((response) => {
        console.log("Raw API response for vinyls:", JSON.stringify(response, null, 2))
        console.log("First vinyl item:", response[0])
      }),
      map((response) => this.mapResponseToProducts(response)),
      catchError((error) => {
        console.error("Error fetching vinyls:", error)
        return of([])
      }),
    )
  }

  getVinylById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/vinyls/${id}`).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error(`Error fetching vinyl with id ${id}:`, error)
        throw error
      }),
    )
  }

  getVinylImage(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/vinyls/${id}/image`, { responseType: "blob" }).pipe(
      catchError((error) => {
        console.error(`Error fetching vinyl image for id ${id}:`, error)
        throw error
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

  getEquipmentById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/music-equipment/${id}`).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error(`Error fetching equipment with id ${id}:`, error)
        throw error
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
      console.log("Processing item:", JSON.stringify(item, null, 2))
      console.log("Item imageId:", item.imageId)
      console.log("Item image:", item.image)

      // Convert price strings to numbers, handling both backend formats
      const price =
        typeof item.price === "string" ? Number.parseFloat(item.price) : typeof item.price === "number" ? item.price : 0

      const boughtPrice =
        typeof item.bought_price === "string"
          ? Number.parseFloat(item.bought_price)
          : typeof item.bought_price === "number"
            ? item.bought_price
            : 0

      // Fix: Clean up array fields to handle malformed data
      const artists = this.cleanupArrayField(item.artists)
      const genres = this.cleanupArrayField(item.genres)
      const styles = this.cleanupArrayField(item.styles)
      const format = this.cleanupArrayField(item.format)

      // Get the image ID from either imageId or image field
      const imageId = item.imageId || item.image

      // Ensure all required properties are present with default values if needed
      const product = {
        id: item.id || "",
        name: item.name || "Unnamed Product",
        description: item.description || "",
        price: price,
        boughtPrice: boughtPrice,
        status: item.status || "AVAILABLE",
        type: item.type || "VINYL",
        year: typeof item.year === "number" ? item.year : new Date().getFullYear(),
        // Include optional properties if they exist
        artists: artists,
        genres: genres,
        styles: styles,
        format: format,
        discogsId: item.discogsId,
        instanceId: item.instanceId,
        dateAdded: item.dateAdded ? new Date(item.dateAdded) : undefined,
        thumbImageUrl: item.thumbImageUrl,
        coverImageUrl: item.coverImageUrl,
        active: item.active,
        model: item.model,
        equipmentCondition: item.equipmentCondition,
        material: item.material,
        origin: item.origin,
        typeId: item.typeId,
        condition: item.condition,
        // Add image URL if available
        imageUrl: imageId ? imageId : '/assets/placeholder.svg',
        imageId: imageId,
        image: item.image
      }

      console.log("Mapped product:", JSON.stringify(product, null, 2))
      return product
    })
  }

  // Helper method to clean up malformed array data
  private cleanupArrayField(field: any): string[] {
    if (!field) {
      return []
    }

    // If it's already an array, return it directly
    if (Array.isArray(field)) {
      return field
    }

    // If it's a string, try to parse it
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field)
        if (Array.isArray(parsed)) {
          return parsed
        }
        return [parsed]
      } catch (e) {
        // If parsing fails, treat it as a comma-separated string
        return field.split(",").map((item) => item.trim()).filter((item) => item !== "")
      }
    }

    // Default fallback
    return []
  }

  createVinyl(product: FormData): Observable<Product> {
    // Fix: Ensure array fields are properly formatted before sending to API
    this.prepareArrayFieldsForSubmission(product)

    // Log the FormData contents for debugging
    console.log('FormData contents:')
    console.log('imageFile:', product.get('imageFile'))
    console.log('name:', product.get('name'))
    console.log('type:', product.get('type'))

    return this.http.post<Product>(`${this.apiUrl}/admin/vinyls`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error creating vinyl:", error)
        throw error
      }),
    )
  }

  updateVinyl(id: string, product: FormData): Observable<Product> {
    // Fix: Ensure array fields are properly formatted before sending to API
    this.prepareArrayFieldsForSubmission(product)

    return this.http.put<Product>(`${this.apiUrl}/admin/vinyls/${id}`, product).pipe(
      map((response) => this.mapResponseToProducts([response])[0]),
      catchError((error) => {
        console.error("Error updating vinyl:", error)
        throw error
      }),
    )
  }

  // Helper method to prepare array fields for API submission
  private prepareArrayFieldsForSubmission(formData: FormData): void {
    // Check if this is a vinyl product
    if (formData.get("type") === "VINYL") {
      // For each array field, ensure it's properly formatted
      ;["artists", "genres", "styles", "format"].forEach((field) => {
        const value = formData.get(field)
        if (value) {
          // If it's already a string, try to parse it
          if (typeof value === "string") {
            try {
              // Try to parse it first to ensure it's valid JSON
              const parsed = JSON.parse(value)
              // If it's an array, use it directly
              if (Array.isArray(parsed)) {
                // Set each array item as a separate form field
                parsed.forEach((item, index) => {
                  formData.set(`${field}[${index}]`, item)
                })
              } else {
                // If it's not an array, convert it to one
                formData.set(`${field}[0]`, parsed)
              }
            } catch (e) {
              // If parsing fails, treat it as a comma-separated string
              const arrayValue = value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== "")
              // Set each array item as a separate form field
              arrayValue.forEach((item, index) => {
                formData.set(`${field}[${index}]`, item)
              })
            }
          }
        }
      })
    }
  }

  deleteVinyl(id: string): Observable<void> {
    console.log("Attempting to delete vinyl:", id)

    if (!this.ensureAuthenticated()) {
      console.error("Authentication check failed")
      return throwError(() => new Error("Authentication required"))
    }

    const token = localStorage.getItem("token")
    console.log("Using token for delete request:", token) // Debug log

    // Add explicit headers
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    return this.http.delete<void>(`${this.apiUrl}/admin/vinyls/${id}`, { headers }).pipe(
      tap(() => console.log("Delete vinyl request successful")),
      catchError((error) => {
        console.error("Error deleting vinyl:", error)
        if (error.status === 401) {
          console.error("Unauthorized - Token details:", {
            exists: !!token,
            length: token?.length,
            firstChars: token?.substring(0, 10) + "...",
          })
          localStorage.clear()
          // You might want to dispatch a logout action here
          return throwError(() => new Error("Authentication failed - Please log in again"))
        }
        return throwError(() => error)
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
    if (!this.ensureAuthenticated()) {
      return throwError(() => new Error("Authentication required"))
    }

    return this.http.delete<void>(`${this.apiUrl}/admin/antiques/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting antique:", error)
        if (error.status === 401) {
          console.error("Unauthorized - Please log in again")
        }
        throw error
      }),
    )
  }

  // Add method to check auth status
  private ensureAuthenticated(): boolean {
    const token = localStorage.getItem("token")
    console.log("Current token:", token) // Debug log

    if (!token) {
      console.error("No authentication token found")
      return false
    }

    // Improved token validation
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        console.error("Invalid token structure")
        localStorage.clear() // Clear invalid token
        return false
      }
      return true
    } catch (e) {
      console.error("Token validation failed:", e)
      localStorage.clear() // Clear invalid token
      return false
    }
  }

  // Update admin endpoints to check auth first
  createEquipment(product: FormData): Observable<Product> {
    if (!this.ensureAuthenticated()) {
      return throwError(() => new Error("Authentication required"))
    }

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
    if (!this.ensureAuthenticated()) {
      return throwError(() => new Error("Authentication required"))
    }

    return this.http.delete<void>(`${this.apiUrl}/admin/music-equipment/${id}`).pipe(
      catchError((error) => {
        console.error("Error deleting equipment:", error)
        if (error.status === 401) {
          console.error("Unauthorized - Please log in again")
        }
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

  deleteProduct(id: string, productType: string): Observable<void> {
    console.log(`Deleting product: ${id}, type: ${productType}`)

    if (!this.ensureAuthenticated()) {
      console.error("Authentication check failed in deleteProduct")
      return throwError(() => new Error("Authentication required"))
    }

    const token = localStorage.getItem("token")
    console.log("Token present for delete operation:", !!token) // Debug log

    switch (productType) {
      case "VINYL":
        return this.deleteVinyl(id).pipe(
          catchError((error) => {
            console.error(`Error deleting ${productType}:`, error)
            return throwError(() => error)
          }),
        )
      case "ANTIQUE":
        return this.deleteAntique(id)
      case "MUSIC_EQUIPMENT":
        return this.deleteEquipment(id)
      default:
        console.error(`Invalid product type: ${productType}`)
        return throwError(() => new Error(`Invalid product type: ${productType}`))
    }
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any, headers?: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  put<T>(endpoint: string, data: any, headers?: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  getProductImageUrl(imageId: string): string {
    if (!imageId) return '/assets/placeholder.svg'
    return `${this.apiUrl}/images/${imageId}`
  }
}

