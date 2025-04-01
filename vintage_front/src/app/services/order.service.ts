import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable, throwError, of } from "rxjs"
import { catchError, delay, map } from "rxjs/operators"
import { environment } from "../../environments/environment"
import { Order, OrderStatus, PaymentType, OrderItem, ShippingInfo } from "../store/orders/order.types"
import { ApiService } from './api.service'

export interface OrderResponse {
  id: string
  clientId: string
  clientName: string
  orderDate: string
  orderStatus: string
  paymentType: string
  totalAmount: number
  items: {
    id: string
    productId: string
    productName: string
    description: string
    price: number
    type: string
    image: string
    year: number
    status: string
    artists?: string[]
    genres?: string[]
    styles?: string[]
    format?: string[]
    origin?: string
    material?: string
    condition?: string
    model?: string
    equipmentCondition?: string
  }[]
  shipping: {
    address: string
    city: string
    postalCode: string
    status: string
    trackingNumber: string
  }
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient, private apiService: ApiService) {}

  private mapOrderResponseToOrder(response: OrderResponse): Order {
    return {
      id: response.id,
      orderDate: new Date(response.orderDate),
      orderStatus: response.orderStatus as OrderStatus,
      totalAmount: response.totalAmount,
      paymentType: response.paymentType as PaymentType,
      clientId: response.clientId,
      clientName: response.clientName,
      items: response.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName || 'Unknown Product',
        description: item.description || '',
        price: item.price,
        type: item.type || 'UNKNOWN',
        image: item.image || '',
        year: item.year || new Date().getFullYear(),
        status: item.status || 'AVAILABLE',
        artists: item.artists,
        genres: item.genres,
        styles: item.styles,
        format: item.format,
        origin: item.origin,
        material: item.material,
        condition: item.condition,
        model: item.model,
        equipmentCondition: item.equipmentCondition
      } as OrderItem)),
      shipping: {
        id: response.id,
        address: response.shipping.address || '',
        city: response.shipping.city || '',
        postalCode: response.shipping.postalCode || '',
        status: response.shipping.status || 'PENDING',
        trackingNumber: response.shipping.trackingNumber || ''
      }
    };
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`).pipe(
      catchError((error) => {
        console.error("Error fetching orders:", error)
        return throwError(() => new Error(error.message || "Failed to fetch orders"))
      }),
    )
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders/status/${status}`).pipe(
      catchError((error) => {
        console.error(`Error fetching orders with status ${status}:`, error)
        return throwError(() => new Error(error.message || "Failed to fetch orders by status"))
      }),
    )
  }

  getOrdersByClient(clientId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders/client/${clientId}`).pipe(
      catchError((error) => {
        console.error(`Error fetching orders for client ${clientId}:`, error)
        return throwError(() => new Error(error.message || "Failed to fetch orders by client"))
      }),
    )
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.apiService.get<OrderResponse>(`/admin/orders/${orderId}`).pipe(
      map(response => this.mapOrderResponseToOrder(response))
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/admin/orders/${id}/status`, { status }).pipe(
      catchError((error) => {
        console.error(`Error updating order ${id} status:`, error)
        return throwError(() => new Error(error.message || "Failed to update order status"))
      }),
    )
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/orders/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting order ${id}:`, error)
        return throwError(() => new Error(error.message || "Failed to delete order"))
      }),
    )
  }

  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/orders/dashboard/metrics`).pipe(
      catchError((error) => {
        console.error("Error fetching dashboard metrics:", error)
        return throwError(() => new Error("Failed to fetch dashboard metrics"))
      }),
    )
  }

  getChartData(period: "weekly" | "monthly" | "yearly"): Observable<any> {
    // For development/testing, use mock data if needed
    const useMockData = false // Set to true to use mock data instead of API calls

    if (useMockData) {
      console.log("Using mock chart data")
      return of({
        period: period,
        labels:
          period === "weekly"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : period === "monthly"
              ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              : ["2020", "2021", "2022", "2023", "2024"],
        salesData:
          period === "weekly"
            ? [150, 220, 180, 250, 300, 280, 350]
            : period === "monthly"
              ? [1200, 1350, 1100, 1400, 1600, 1800, 2000, 1900, 1700, 1500, 1650, 1950]
              : [12000, 15000, 18000, 22000, 25000],
        userData:
          period === "weekly"
            ? [2, 1, 3, 0, 2, 1, 4]
            : period === "monthly"
              ? [8, 12, 10, 15, 18, 20, 22, 25, 23, 19, 21, 24]
              : [120, 180, 210, 250, 280],
      }).pipe(delay(500)) // Simulate network delay
    }

    return this.http
      .get(`${this.apiUrl}/admin/orders/dashboard/chart-data`, {
        params: { period },
      })
      .pipe(
        catchError((error) => {
          console.error("Error fetching chart data:", error)

          // Return mock data on error
          return of({
            period: period,
            labels:
              period === "weekly"
                ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                : period === "monthly"
                  ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                  : ["2020", "2021", "2022", "2023", "2024"],
            salesData:
              period === "weekly"
                ? [150, 220, 180, 250, 300, 280, 350]
                : period === "monthly"
                  ? [1200, 1350, 1100, 1400, 1600, 1800, 2000, 1900, 1700, 1500, 1650, 1950]
                  : [12000, 15000, 18000, 22000, 25000],
            userData:
              period === "weekly"
                ? [2, 1, 3, 0, 2, 1, 4]
                : period === "monthly"
                  ? [8, 12, 10, 15, 18, 20, 22, 25, 23, 19, 21, 24]
                  : [120, 180, 210, 250, 280],
          })
        }),
      )
  }

  getUserOrders(): Observable<Order[]> {
    return this.apiService.get<OrderResponse[]>('/user/orders').pipe(
      map(responses => responses.map(response => this.mapOrderResponseToOrder(response)))
    );
  }
}

