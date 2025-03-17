import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

interface OrderItem {
  id: number
  title: string
  artist: string
  price: number
  quantity: number
  image: string
}

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-6 dark:text-white">Order History</h2>
      
      @if (orders.length > 0) {
        <div class="space-y-6">
          @for (order of orders; track order.id) {
            <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="bg-gray-50 dark:bg-dark-bg p-4 flex flex-col md:flex-row justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Order #{{ order.id }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Placed on {{ order.date }}</p>
                </div>
                <div class="mt-2 md:mt-0">
                  <span 
                    class="inline-flex px-2 py-1 text-xs rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': order.status === 'Delivered',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': order.status === 'Shipped',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': order.status === 'Processing',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': order.status === 'Cancelled'
                    }"
                  >
                    {{ order.status }}
                  </span>
                  <span class="ml-2 font-medium dark:text-white">Total: £{{ order.total.toFixed(2) }}</span>
                </div>
              </div>
              
              <div class="p-4">
                @for (item of order.items; track item.id) {
                  <div class="flex items-start py-3 border-b dark:border-gray-700 last:border-0">
                    <div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover">
                    </div>
                    <div class="ml-4 flex-grow">
                      <h3 class="font-medium dark:text-white">{{ item.title }}</h3>
                      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ item.artist }}</p>
                      <div class="mt-1 flex justify-between">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Qty: {{ item.quantity }}</p>
                        <p class="font-medium dark:text-white">£{{ item.price.toFixed(2) }}</p>
                      </div>
                    </div>
                  </div>
                }
              </div>
              
              <div class="bg-gray-50 dark:bg-dark-bg p-4 flex justify-between items-center">
                <a routerLink="/order/{{ order.id }}" class="text-teal hover:underline text-sm">View Order Details</a>
                @if (order.status === 'Delivered') {
                  <button class="bg-teal hover:bg-teal/90 text-white px-3 py-1 rounded-md text-sm">
                    Write a Review
                  </button>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12 border border-dashed dark:border-gray-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-4 text-lg font-medium dark:text-white">No orders yet</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">When you place an order, it will appear here.</p>
          <a routerLink="/browse" class="mt-4 inline-block bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md">
            Start Shopping
          </a>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class OrdersComponent {
  orders: Order[] = [
    {
      id: "ORD-2023-1234",
      date: "March 15, 2023",
      status: "Delivered",
      total: 78.97,
      items: [
        {
          id: 1,
          title: "Dark Side of the Moon",
          artist: "Pink Floyd",
          price: 29.99,
          quantity: 1,
          image: "/assets/placeholder.svg",
        },
        {
          id: 2,
          title: "Rumours",
          artist: "Fleetwood Mac",
          price: 27.99,
          quantity: 1,
          image: "/assets/placeholder.svg",
        },
      ],
    },
    {
      id: "ORD-2023-0987",
      date: "February 28, 2023",
      status: "Shipped",
      total: 54.98,
      items: [
        {
          id: 3,
          title: "Abbey Road",
          artist: "The Beatles",
          price: 32.99,
          quantity: 1,
          image: "/assets/placeholder.svg",
        },
        {
          id: 4,
          title: "Record Cleaning Kit",
          artist: "Accessories",
          price: 21.99,
          quantity: 1,
          image: "/assets/placeholder.svg",
        },
      ],
    },
  ]
}

