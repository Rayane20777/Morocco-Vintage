export enum OrderStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    DENIED = "DENIED",
    REFUNDED = "REFUNDED",
  }
  
  export enum PaymentType {
    CREDIT_CARD = "CREDIT_CARD",
    PAYPAL = "PAYPAL",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  }
  
  export interface OrderItem {
    id: string
    productId: string
    productName: string
    description: string
    price: number
    type: string
    image: string
    year: number
    status: string
    // Vinyl specific fields
    artists?: string[]
    genres?: string[]
    styles?: string[]
    format?: string[]
    // Antique specific fields
    origin?: string
    material?: string
    condition?: string
    // Music Equipment specific fields
    model?: string
    equipmentCondition?: string
  }
  
  export interface ShippingInfo {
    id: string
    address: string
    city: string
    postalCode: string
    status: string
    trackingNumber: string
  }
  
  export interface Order {
    id: string
    orderDate: Date
    orderStatus: OrderStatus
    totalAmount: number
    paymentType: PaymentType
    clientId: string
    clientName: string
    items: OrderItem[]
    shipping: ShippingInfo
  }
  
  export interface OrderState {
    orders: Order[]
    selectedOrder: Order | null
    loading: boolean
    error: string | null
    statusFilter: OrderStatus | null
  }
  
  export const initialOrderState: OrderState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    statusFilter: null,
  }
  
  