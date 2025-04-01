import { createSelector, createFeatureSelector } from "@ngrx/store"
import { OrderState } from "./order.types"

export const selectOrderState = createFeatureSelector<OrderState>("orders")

export const selectOrders = createSelector(selectOrderState, (state: OrderState) => state.orders)

export const selectSelectedOrder = createSelector(selectOrderState, (state: OrderState) => state.selectedOrder)

export const selectOrderLoading = createSelector(selectOrderState, (state: OrderState) => state.loading)

export const selectOrderError = createSelector(selectOrderState, (state: OrderState) => state.error)

export const selectStatusFilter = createSelector(selectOrderState, (state: OrderState) => state.statusFilter)

export const selectFilteredOrders = createSelector(selectOrders, selectStatusFilter, (orders, statusFilter) => {
  if (!statusFilter) {
    return orders
  }
  return orders.filter((order) => order.orderStatus === statusFilter)
})

