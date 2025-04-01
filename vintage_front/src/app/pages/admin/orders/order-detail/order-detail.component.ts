import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, ActivatedRoute, Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { OrderActions } from "../../../../store/orders/order.actions"
import { selectSelectedOrder, selectOrderLoading, selectOrderError } from "../../../../store/orders/order.selectors"
import { Order } from "../../../../store/orders/order.types"
import { ApiService } from "../../../../services/api.service"

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
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
          <h1 class="text-2xl font-semibold">Order Details</h1>
        </div>
        <div class="flex gap-2">
          <a [routerLink]="['/admin/orders', orderId, 'edit']" class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md">
            Edit Order
          </a>
          <button (click)="deleteOrder()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
            Delete Order
          </button>
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

      <!-- Order Details -->
      <ng-container *ngIf="(order$ | async) as order">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Order Summary -->
          <div class="p-6 border-b">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 class="text-lg font-semibold">Order #{{ order.id }}</h2>
                <p class="text-gray-500">Placed on {{ order.orderDate | date:'medium' }}</p>
              </div>
              <div>
                <span
                  class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
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
              </div>
            </div>
          </div>

          <!-- Customer Information -->
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

          <!-- Shipping Information -->
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
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <p>{{ order.shipping.status }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tracking Number</p>
                <p>{{ order.shipping.trackingNumber || 'Not available' }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6 border-b">
            <h3 class="text-md font-semibold mb-4">Order Items</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let item of order.items">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-16 w-16">
                          <img [src]="getSafeImageUrl(item.image)" [alt]="item.productName" class="h-16 w-16 rounded object-cover">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ item.productName }}</div>
                          <div class="text-sm text-gray-500">{{ item.type }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ item.description }}</div>
                      <div class="text-sm text-gray-500">Year: {{ item.year }}</div>
                      <div class="text-sm text-gray-500">Status: {{ item.status }}</div>
                      <!-- Vinyl specific fields -->
                      <div *ngIf="item.type === 'VINYL'">
                        <div class="text-sm text-gray-500">Artists: {{ item.artists?.join(', ') }}</div>
                        <div class="text-sm text-gray-500">Genres: {{ item.genres?.join(', ') }}</div>
                        <div class="text-sm text-gray-500">Styles: {{ item.styles?.join(', ') }}</div>
                        <div class="text-sm text-gray-500">Format: {{ item.format?.join(', ') }}</div>
                      </div>
                      <!-- Antique specific fields -->
                      <div *ngIf="item.type === 'ANTIQUE'">
                        <div class="text-sm text-gray-500">Origin: {{ item.origin }}</div>
                        <div class="text-sm text-gray-500">Material: {{ item.material }}</div>
                        <div class="text-sm text-gray-500">Condition: {{ item.condition }}</div>
                      </div>
                      <!-- Music Equipment specific fields -->
                      <div *ngIf="item.type === 'MUSIC_EQUIPMENT'">
                        <div class="text-sm text-gray-500">Model: {{ item.model }}</div>
                        <div class="text-sm text-gray-500">Condition: {{ item.equipmentCondition }}</div>
                      </div>
                    </td>
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

          <!-- Payment Information -->
          <div class="p-6">
            <h3 class="text-md font-semibold mb-4">Payment Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Payment Type</p>
                <p>{{ order.paymentType }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Amount</p>
                <p class="font-semibold">£{{ order.totalAmount.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  order$: Observable<Order | null>
  loading$: Observable<boolean>
  error$: Observable<string | null>
  orderId = ""

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
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
      }
    })
  }

  goBack(): void {
    this.router.navigate(["/admin/orders"])
  }

  deleteOrder(): void {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      this.store.dispatch(OrderActions.deleteOrder({ id: this.orderId }))
    }
  }

  getSafeImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '/assets/placeholder.svg'
    return this.apiService.getProductImageUrl(imageUrl)
  }
}

