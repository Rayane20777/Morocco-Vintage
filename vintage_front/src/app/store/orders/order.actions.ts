import { createActionGroup, props, emptyProps } from "@ngrx/store"
import { Order, OrderStatus } from "./order.types"

export const OrderActions = createActionGroup({
  source: "Orders",
  events: {
    // Load all orders
    "Load Orders": emptyProps(),
    "Load Orders Success": props<{ orders: Order[] }>(),
    "Load Orders Failure": props<{ error: string }>(),

    // Load orders by status
    "Load Orders By Status": props<{ status: OrderStatus }>(),
    "Load Orders By Status Success": props<{ orders: Order[] }>(),
    "Load Orders By Status Failure": props<{ error: string }>(),

    // Load orders by client
    "Load Orders By Client": props<{ clientId: string }>(),
    "Load Orders By Client Success": props<{ orders: Order[] }>(),
    "Load Orders By Client Failure": props<{ error: string }>(),

    // Get order by ID
    "Get Order": props<{ id: string }>(),
    "Get Order Success": props<{ order: Order }>(),
    "Get Order Failure": props<{ error: string }>(),

    // Update order status
    "Update Order Status": props<{ id: string; status: OrderStatus }>(),
    "Update Order Status Success": props<{ order: Order }>(),
    "Update Order Status Failure": props<{ error: string }>(),

    // Delete order
    "Delete Order": props<{ id: string }>(),
    "Delete Order Success": props<{ id: string }>(),
    "Delete Order Failure": props<{ error: string }>(),

    // Set status filter
    "Set Status Filter": props<{ status: OrderStatus | null }>(),

    // Clear selected order
    "Clear Selected Order": emptyProps(),
  },
})

