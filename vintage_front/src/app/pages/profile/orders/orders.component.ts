import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { OrderService } from "../../../services/order.service"
import { Order } from "../../../store/orders/order.types"

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-6 dark:text-white">My Orders</h2>

      @if (isLoading) {
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
      } @else if (error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
      } @else if (orders.length === 0) {
        <div class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">Start shopping to see your orders here</p>
        </div>
      } @else {
        <div class="space-y-6">
          @for (order of orders; track order.id) {
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-medium dark:text-white">Order #{{ order.id }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ order.orderDate | date:'medium' }}
                  </p>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="{
                      'bg-yellow-100 text-yellow-800': order.orderStatus === 'PENDING',
                      'bg-green-100 text-green-800': order.orderStatus === 'ACCEPTED',
                      'bg-red-100 text-red-800': order.orderStatus === 'DENIED',
                      'bg-gray-100 text-gray-800': order.orderStatus === 'CANCELLED'
                    }">
                    {{ order.orderStatus }}
                  </span>
                  <p class="text-lg font-semibold text-teal mt-1">
                    {{ order.totalAmount | currency:'USD' }}
                  </p>
                </div>
              </div>

              <div class="space-y-2">
                @for (item of order.items; track item.id) {
                  <div class="flex justify-between items-center text-sm">
                    <span class="text-gray-600 dark:text-gray-300">{{ item.productName }}</span>
                    <span class="text-gray-900 dark:text-white">{{ item.price | currency:'USD' }}</span>
                  </div>
                }
              </div>

              @if (order.shipping) {
                <div class="mt-4 pt-4 border-t">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Shipping Details</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ order.shipping.address }}<br>
                    {{ order.shipping.city }}, {{ order.shipping.postalCode }}
                  </p>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.isLoading = true;
    this.error = null;

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', error);
      }
    });
  }
}

