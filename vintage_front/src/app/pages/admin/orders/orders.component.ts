import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Order {
  id: string
  customer: string
  date: string
  items: number
  total: string
  status: string
  paymentStatus: string
}

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="filters.search"
              placeholder="Search orders..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              id="status"
              [(ngModel)]="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label for="payment" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              id="payment"
              [(ngModel)]="filters.paymentStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="date"
              [(ngModel)]="filters.dateRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            (click)="applyFilters()"
            class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
              @for (order of filteredOrders; track order.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.items }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.total }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': order.status === 'Processing',
                        'bg-blue-100 text-blue-800': order.status === 'Shipped',
                        'bg-green-100 text-green-800': order.status === 'Delivered',
                        'bg-red-100 text-red-800': order.status === 'Cancelled'
                      }"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': order.paymentStatus === 'Paid',
                        'bg-yellow-100 text-yellow-800': order.paymentStatus === 'Pending',
                        'bg-red-100 text-red-800': order.paymentStatus === 'Failed',
                        'bg-gray-100 text-gray-800': order.paymentStatus === 'Refunded'
                      }"
                    >
                      {{ order.paymentStatus }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-teal hover:text-teal/80 mr-3">View</button>
                    <button class="text-gray-600 hover:text-gray-800">Edit</button>
                  </td>
                </tr>
              }
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ orders.length }}</span> results
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
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-teal text-sm font-medium text-white">
                  2
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
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
    </div>
  `,
})
export class OrdersComponent {
  filters = {
    search: "",
    status: "",
    paymentStatus: "",
    dateRange: "",
  }

  orders: Order[] = [
    {
      id: "ORD-2023-1234",
      customer: "John Doe",
      date: "Mar 15, 2023",
      items: 2,
      total: "£149.99",
      status: "Delivered",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1235",
      customer: "Jane Smith",
      date: "Mar 16, 2023",
      items: 1,
      total: "£89.99",
      status: "Processing",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1236",
      customer: "Robert Johnson",
      date: "Mar 16, 2023",
      items: 3,
      total: "£199.99",
      status: "Shipped",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1237",
      customer: "Emily Davis",
      date: "Mar 17, 2023",
      items: 2,
      total: "£129.99",
      status: "Processing",
      paymentStatus: "Pending",
    },
    {
      id: "ORD-2023-1238",
      customer: "Michael Wilson",
      date: "Mar 17, 2023",
      items: 1,
      total: "£79.99",
      status: "Cancelled",
      paymentStatus: "Refunded",
    },
    {
      id: "ORD-2023-1239",
      customer: "Sarah Brown",
      date: "Mar 18, 2023",
      items: 4,
      total: "£249.99",
      status: "Delivered",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1240",
      customer: "David Miller",
      date: "Mar 18, 2023",
      items: 2,
      total: "£119.99",
      status: "Shipped",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1241",
      customer: "Jennifer Taylor",
      date: "Mar 19, 2023",
      items: 1,
      total: "£59.99",
      status: "Processing",
      paymentStatus: "Failed",
    },
    {
      id: "ORD-2023-1242",
      customer: "James Anderson",
      date: "Mar 19, 2023",
      items: 3,
      total: "£189.99",
      status: "Delivered",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-2023-1243",
      customer: "Lisa Thomas",
      date: "Mar 20, 2023",
      items: 2,
      total: "£139.99",
      status: "Shipped",
      paymentStatus: "Paid",
    },
  ]

  filteredOrders: Order[] = [...this.orders]

  applyFilters() {
    this.filteredOrders = this.orders.filter((order) => {
      // Search filter
      const searchMatch =
        this.filters.search === "" ||
        order.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        order.customer.toLowerCase().includes(this.filters.search.toLowerCase())

      // Status filter
      const statusMatch = this.filters.status === "" || order.status === this.filters.status

      // Payment status filter
      const paymentMatch = this.filters.paymentStatus === "" || order.paymentStatus === this.filters.paymentStatus

      // Date range filter - simplified for demo
      const dateMatch = this.filters.dateRange === "" || true // In a real app, we would check the date range

      return searchMatch && statusMatch && paymentMatch && dateMatch
    })
  }
}

