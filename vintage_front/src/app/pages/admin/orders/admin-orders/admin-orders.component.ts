import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { OrderActions } from "../../../../store/orders/order.actions"
import {
  selectFilteredOrders,
  selectOrderLoading,
  selectOrderError,
  selectStatusFilter,
} from "../../../../store/orders/order.selectors"
import { type Order, OrderStatus } from "../../../../store/orders/order.types"

@Component({
  selector: "app-admin-orders",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Orders</h1>
          <p class="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Orders
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-1/3">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="searchTerm"
              (ngModelChange)="applySearch()"
              placeholder="Search by order ID or customer name..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div class="w-full md:w-1/3">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              id="status"
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterByStatus()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option [ngValue]="null">All Statuses</option>
              <option *ngFor="let status of orderStatuses" [ngValue]="status">{{ status }}</option>
            </select>
          </div>
          <div class="w-full md:w-1/3">
            <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="dateRange"
              [(ngModel)]="selectedDateRange"
              (ngModelChange)="applyDateFilter()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>

      <!-- Orders Table -->
      <div *ngIf="!(loading$ | async) && filteredOrders.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of filteredOrders">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.clientName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.orderDate | date:'MMM d, y' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.items.length }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{{ order.totalAmount.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [ngClass]="{
                      'bg-yellow-100 text-yellow-800': order.orderStatus === 'PENDING',
                      'bg-blue-100 text-blue-800': order.orderStatus === 'PROCESSING' || order.orderStatus === 'ACCEPTED',
                      'bg-indigo-100 text-indigo-800': order.orderStatus === 'SHIPPED',
                      'bg-green-100 text-green-800': order.orderStatus === 'DELIVERED',
                      'bg-red-100 text-red-800': order.orderStatus === 'CANCELLED' || order.orderStatus === 'DENIED',
                      'bg-gray-100 text-gray-800': order.orderStatus === 'REFUNDED'
                    }"
                  >
                    {{ order.orderStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.paymentType }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a [routerLink]="['/admin/orders', order.id]" class="text-teal hover:text-teal/80 mr-3">View</a>
                  <a [routerLink]="['/admin/orders', order.id, 'edit']" class="text-gray-600 hover:text-gray-800">Edit</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredOrders.length }}</span> of <span class="font-medium">{{ filteredOrders.length }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!(loading$ | async) && filteredOrders.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
        <p class="mt-2 text-gray-500">No orders match your current filters. Try adjusting your search criteria.</p>
      </div>
    </div>
  `,
})
export class AdminOrdersComponent implements OnInit {
  orders$: Observable<Order[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  statusFilter$: Observable<OrderStatus | null>

  filteredOrders: Order[] = []
  searchTerm = ""
  selectedStatus: OrderStatus | null = null
  selectedDateRange = "all"

  orderStatuses = Object.values(OrderStatus)

  constructor(private store: Store) {
    this.orders$ = this.store.select(selectFilteredOrders)
    this.loading$ = this.store.select(selectOrderLoading)
    this.error$ = this.store.select(selectOrderError)
    this.statusFilter$ = this.store.select(selectStatusFilter)
  }

  ngOnInit(): void {
    this.store.dispatch(OrderActions.loadOrders())

    this.orders$.subscribe((orders) => {
      this.filteredOrders = this.filterOrders(orders)
    })
  }

  filterByStatus(): void {
    this.store.dispatch(OrderActions.setStatusFilter({ status: this.selectedStatus }))
  }

  applySearch(): void {
    this.orders$.subscribe((orders) => {
      this.filteredOrders = this.filterOrders(orders)
    })
  }

  applyDateFilter(): void {
    this.orders$.subscribe((orders) => {
      this.filteredOrders = this.filterOrders(orders)
    })
  }

  private filterOrders(orders: Order[]): Order[] {
    let result = [...orders]

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase()
      result = result.filter(
        (order) => order.id.toLowerCase().includes(searchLower) || order.clientName.toLowerCase().includes(searchLower),
      )
    }

    // Apply date filter
    if (this.selectedDateRange !== "all") {
      const now = new Date()
      const startDate = new Date()

      switch (this.selectedDateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      result = result.filter((order) => new Date(order.orderDate) >= startDate)
    }

    return result
  }
}

