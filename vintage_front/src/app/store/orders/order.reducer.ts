import { createReducer, on } from "@ngrx/store"
import { OrderActions } from "./order.actions"
import { initialOrderState } from "./order.types"

export const orderReducer = createReducer(
  initialOrderState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
    error: null,
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Orders By Status
  on(OrderActions.loadOrdersByStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.loadOrdersByStatusSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
    error: null,
  })),
  on(OrderActions.loadOrdersByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Orders By Client
  on(OrderActions.loadOrdersByClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.loadOrdersByClientSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
    error: null,
  })),
  on(OrderActions.loadOrdersByClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Order
  on(OrderActions.getOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.getOrderSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
    error: null,
  })),
  on(OrderActions.getOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Order Status
  on(OrderActions.updateOrderStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.updateOrderStatusSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map((o) => (o.id === order.id ? order : o)),
    selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    loading: false,
    error: null,
  })),
  on(OrderActions.updateOrderStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Order
  on(OrderActions.deleteOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
    ...state,
    orders: state.orders.filter((order) => order.id !== id),
    selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder,
    loading: false,
    error: null,
  })),
  on(OrderActions.deleteOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Set Status Filter
  on(OrderActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
  })),

  // Clear Selected Order
  on(OrderActions.clearSelectedOrder, (state) => ({
    ...state,
    selectedOrder: null,
  })),
)

