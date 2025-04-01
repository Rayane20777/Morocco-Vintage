import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, forkJoin, of, throwError } from "rxjs"
import { map, catchError } from "rxjs/operators"
import { Product } from "../store/products/product.types"
import { ApiService } from "./api.service"

export interface CartItem {
  id: string
  product?: Product
}

export interface ShippingDetails {
  address: string
  city: string
  postalCode: string
}

export interface CartSettings {
  includeShipping: boolean
  shippingDetails?: ShippingDetails
}

// Detailed order summary interface
export interface OrderSummary {
  subtotal: number
  total: number
  items: {
    id: string
    name: string
    price: number
    total: number
  }[]
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartKey = "vinyl_shop_cart"
  private cartSettingsKey = "vinyl_shop_cart_settings"
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([])
  private cartSettingsSubject = new BehaviorSubject<CartSettings>({
    includeShipping: true,
    shippingDetails: {
      address: "",
      city: "",
      postalCode: "",
    },
  })

  cartItems$ = this.cartItemsSubject.asObservable()
  cartSettings$ = this.cartSettingsSubject.asObservable()

  constructor(private apiService: ApiService) {
    this.loadCart()
    this.loadCartSettings()
  }

  private loadCart(): void {
    const storedCart = localStorage.getItem(this.cartKey)
    let cartItems: CartItem[] = []

    if (storedCart) {
      try {
        // Parse stored cart
        const parsedCart = JSON.parse(storedCart)

        if (Array.isArray(parsedCart)) {
          cartItems = parsedCart.map((item) => {
            // Remove quantity property if it exists
            const { quantity, ...rest } = item
            return rest
          })
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }

    this.cartItemsSubject.next(cartItems)

    // Load product details for each cart item
    if (cartItems.length > 0) {
      this.refreshCartProducts()
    }
  }

  private loadCartSettings(): void {
    const storedSettings = localStorage.getItem(this.cartSettingsKey)
    const defaultSettings: CartSettings = {
      includeShipping: true,
      shippingDetails: {
        address: "",
        city: "",
        postalCode: "",
      },
    }

    let settings: CartSettings
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings)
      settings = {
        ...defaultSettings,
        ...parsedSettings,
        shippingDetails: {
          ...defaultSettings.shippingDetails,
          ...(parsedSettings.shippingDetails || {}),
        },
      }
    } else {
      settings = defaultSettings
    }

    this.cartSettingsSubject.next(settings)
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items))
    this.cartItemsSubject.next(items)
  }

  private saveCartSettings(settings: CartSettings): void {
    localStorage.setItem(this.cartSettingsKey, JSON.stringify(settings))
    this.cartSettingsSubject.next(settings)
  }

  refreshCartProducts(): void {
    const currentItems = this.cartItemsSubject.value

    if (currentItems.length === 0) {
      return
    }

    // Create an array of observables for each product fetch
    const productRequests = currentItems.map((item) =>
      this.fetchProductById(item.id).pipe(
        catchError((error) => {
          console.error(`Error fetching product ${item.id}:`, error)
          // Return a placeholder product if fetch fails
          return of({
            id: item.id,
            name: "Product Unavailable",
            description: "This product could not be loaded",
            price: 0,
            boughtPrice: 0,
            status: "UNAVAILABLE",
            type: "VINYL",
            year: new Date().getFullYear(),
            imageUrl: "/assets/placeholder.svg",
          } as Product)
        }),
      ),
    )

    // If there are no products to fetch, return
    if (productRequests.length === 0) {
      return
    }

    // Fetch all products in parallel
    forkJoin(productRequests)
      .pipe(
        map((products) => {
          // Merge product details with cart items
          return currentItems.map((item, index) => ({
            ...item,
            product: products[index],
          }))
        }),
        catchError((error) => {
          console.error("Error fetching cart products:", error)
          return of(currentItems)
        }),
      )
      .subscribe((updatedItems) => {
        this.cartItemsSubject.next(updatedItems)
      })
  }

  // Helper method to fetch a product by ID based on its type
  private fetchProductById(id: string): Observable<Product> {
    // First try to fetch as vinyl
    return this.apiService.getVinylById(id).pipe(
      catchError(() => {
        // If not a vinyl, try as equipment
        return this.apiService.getEquipmentById(id).pipe(
          catchError(() => {
            // If not equipment, try as antique
            // Since there's no direct getAntiqueById method, we'll fetch all antiques and filter
            return this.apiService.getProducts("ANTIQUE").pipe(
              map((antiques) => {
                const antique = antiques.find((a) => a.id === id)
                if (antique) {
                  return antique
                }
                throw new Error(`Antique with ID ${id} not found`)
              }),
              catchError(() => {
                // If not found in any category, throw an error
                return throwError(() => new Error(`Product with ID ${id} not found`))
              }),
            )
          }),
        )
      }),
    )
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$
  }

  getCartSettings(): Observable<CartSettings> {
    return this.cartSettings$
  }

  updateShippingOption(includeShipping: boolean): void {
    const currentSettings = this.cartSettingsSubject.value
    const updatedSettings = {
      ...currentSettings,
      includeShipping,
    }
    this.saveCartSettings(updatedSettings)
  }

  updateShippingDetails(shippingDetails: ShippingDetails): void {
    const currentSettings = this.cartSettingsSubject.value
    const updatedSettings = {
      ...currentSettings,
      shippingDetails,
    }
    this.saveCartSettings(updatedSettings)
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(map((items) => items.length))
  }

  // Get detailed order summary with item breakdown
  getOrderSummary(): Observable<OrderSummary> {
    return this.cartItems$.pipe(
      map((items) => {
        // Calculate item totals and create detailed breakdown
        const itemDetails = items.map((item) => {
          const price = item.product?.price || 0

          return {
            id: item.id,
            name: item.product?.name || "Unknown Product",
            price: price,
            total: price,
          }
        })

        // Calculate subtotal (sum of all item prices)
        const subtotal = itemDetails.reduce((sum, item) => sum + item.price, 0)

        // Calculate final total
        const total = subtotal

        return {
          subtotal,
          total,
          items: itemDetails,
        }
      }),
      catchError((error) => {
        console.error("Error calculating order summary:", error)
        return of({
          subtotal: 0,
          total: 0,
          items: [],
        })
      }),
    )
  }

  // Simplified cart total for backward compatibility
  getCartTotal(): Observable<{ subtotal: number; total: number }> {
    return this.getOrderSummary().pipe(
      map((summary) => ({
        subtotal: summary.subtotal,
        total: summary.total,
      })),
    )
  }

  addToCart(productId: string): void {
    const currentItems = this.cartItemsSubject.value

    // Check if product already exists in cart
    const existingItemIndex = currentItems.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      // Product already in cart, do nothing
      return
    } else {
      // Add new item
      const updatedItems = [...currentItems, { id: productId }]
      this.saveCart(updatedItems)

      // Fetch product details for the new item
      this.fetchProductById(productId)
        .pipe(
          catchError((error) => {
            console.error(`Error fetching product ${productId}:`, error)
            return of(null)
          }),
        )
        .subscribe((product) => {
          if (product) {
            const items = this.cartItemsSubject.value
            const itemIndex = items.findIndex((item) => item.id === productId)

            if (itemIndex >= 0) {
              const updatedItems = [...items]
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                product,
              }
              this.cartItemsSubject.next(updatedItems)
            }
          }
        })
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItemsSubject.value
    const updatedItems = currentItems.filter((item) => item.id !== productId)
    this.saveCart(updatedItems)
  }

  clearCart(): void {
    this.saveCart([])
  }

  validateShippingDetails(): boolean {
    const settings = this.cartSettingsSubject.value

    if (!settings.includeShipping) {
      return true // No shipping, no validation needed
    }

    const shippingDetails = settings.shippingDetails

    if (!shippingDetails) {
      return false
    }

    return !!(shippingDetails.address && shippingDetails.city && shippingDetails.postalCode)
  }

  isProductAvailable(product?: Product): boolean {
    if (!product) return false
    return product.status === "AVAILABLE" || product.status === "IN_STOCK" || product.status === "LIMITED"
  }

  submitOrder(clientId: string): Observable<any> {
    const currentItems = this.cartItemsSubject.value;
    const currentSettings = this.cartSettingsSubject.value;

    if (!currentSettings.includeShipping && !currentSettings.shippingDetails) {
      return throwError(() => new Error('Shipping details are required'));
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Authentication required'));
    }

    const orderRequest = {
      paymentType: currentSettings.includeShipping ? 'CASH_ON_DELIVERY' : 'PICK_UP',
      shipping: {
        address: currentSettings.shippingDetails?.address || '',
        city: currentSettings.shippingDetails?.city || '',
        postalCode: currentSettings.shippingDetails?.postalCode || ''
      },
      items: currentItems.map(item => ({
        productId: item.id
      }))
    };

    // Add authorization header
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('Submitting order:', orderRequest); // Debug log
    return this.apiService.post<any>('/user/orders', orderRequest, headers);
  }
}

