import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, ActivatedRoute, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { OrderActions } from "../../../../store/orders/order.actions"
import { selectSelectedOrder, selectOrderLoading, selectOrderError } from "../../../../store/orders/order.selectors"
import { Order, OrderStatus } from "../../../../store/orders/order.types"

@Component({
  selector: "app-order-edit",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header with back button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="goBack()" class="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-semibold">Edit Order</h1>
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

      <!-- Order Edit Form -->
      <ng-container *ngIf="(order$ | async) as order">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Order Summary -->
          <div class="p-6 border-b">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 class="text-lg font-semibold">Order #{{ order.id }}</h2>
                <p class="text-gray-500">Placed on {{ order.orderDate | date:'medium' }}</p>
              </div>
            </div>
          </div>

          <!-- Order Status -->
          <div class="p-6 border-b">
            <h3 class="text-md font-semibold mb-4">Order Status</h3>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="orderStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="orderStatus"
                  [(ngModel)]="selectedStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                >
                  <option *ngFor="let status of orderStatuses" [value]="status">{{ status }}</option>
                </select>
              </div>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Current Status: 
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ml-2"
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
                </p>
              </div>
            </div>
          </div>

          <!-- Customer Information (Read-only) -->
          <div class="p-6 border-b">
            <h3 class="text-md font-semibold mb-4">Customer Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Customer ID</p>
                <p>{{ order.clientId }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Customer Name</p>
                <p>{{ order.clientName }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Information (Read-only) -->
          <div class="p-6 border-b">
            <h3 class="text-md font-semibold mb-4">Shipping Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">Address</p>
                <p>{{ order.shipping.address }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">City</p>
                <p>{{ order.shipping.city }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Postal Code</p>
                <p>{{ order.shipping.postalCode }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items (Read-only) -->
          <div class="p-6 border-b">
            <h3 class="text-md font-semibold mb-4">Order Items</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let item of order.items">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.productId }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.productName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">£{{ item.price.toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Total:</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">£{{ order.totalAmount.toFixed(2) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="p-6 flex justify-end gap-4">
            <button
              type="button"
              (click)="goBack()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="updateOrderStatus()"
              class="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal/90"
              [disabled]="selectedStatus === order.orderStatus"
            >
              Update Order
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class OrderEditComponent implements OnInit {
  order$: Observable<Order | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  orderId = ""
  selectedStatus: OrderStatus = OrderStatus.PENDING
  orderStatuses = Object.values(OrderStatus)

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.order$ = this.store.select(selectSelectedOrder)
    this.loading$ = this.store.select(selectOrderLoading)
    this.error$ = this.store.select(selectOrderError)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id) {
        this.orderId = id
        this.store.dispatch(OrderActions.getOrder({ id }))

        // Set the selected status to the current order status once loaded
        this.order$.subscribe((order) => {
          if (order) {
            this.selectedStatus = order.orderStatus
          }
        })
      }
    })
  }

  goBack(): void {
    this.router.navigate(["/admin/orders", this.orderId])
  }

  updateOrderStatus(): void {
    this.store.dispatch(
      OrderActions.updateOrderStatus({
        id: this.orderId,
        status: this.selectedStatus,
      }),
    )

    // Subscribe to the success action and navigate only after it's complete
    this.store.select(selectOrderError).subscribe((error) => {
      if (!error) {
        this.router.navigate(["/admin/orders", this.orderId])
      }
    })
  }
}

