import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Customer {
  id: number
  name: string
  email: string
  orders: number
  spent: string
  lastOrder: string
  status: string
}

@Component({
  selector: "app-customers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Customers</h1>
          <p class="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <div class="mt-4 md:mt-0 flex gap-3">
          <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button class="bg-teal hover:bg-teal/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              [(ngModel)]="filters.search"
              placeholder="Search customers..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              [(ngModel)]="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort"
              [(ngModel)]="filters.sort"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="orders">Orders</option>
              <option value="spent">Total Spent</option>
              <option value="lastOrder">Last Order</option>
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

      <!-- Customers Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (customer of filteredCustomers; track customer.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500 font-medium">{{ customer.name.charAt(0) }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.orders }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.spent }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.lastOrder }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': customer.status === 'Active',
                        'bg-gray-100 text-gray-800': customer.status === 'Inactive'
                      }"
                    >
                      {{ customer.status }}
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ customers.length }}</span> results
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
export class CustomersComponent {
  filters = {
    search: "",
    status: "",
    sort: "name",
  }

  customers: Customer[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      orders: 5,
      spent: "£349.95",
      lastOrder: "Mar 15, 2023",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      orders: 3,
      spent: "£189.97",
      lastOrder: "Mar 16, 2023",
      status: "Active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      orders: 7,
      spent: "£599.93",
      lastOrder: "Mar 16, 2023",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      orders: 2,
      spent: "£129.98",
      lastOrder: "Mar 17, 2023",
      status: "Active",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      orders: 1,
      spent: "£79.99",
      lastOrder: "Mar 17, 2023",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Sarah Brown",
      email: "sarah.brown@example.com",
      orders: 4,
      spent: "£249.96",
      lastOrder: "Mar 18, 2023",
      status: "Active",
    },
    {
      id: 7,
      name: "David Miller",
      email: "david.miller@example.com",
      orders: 6,
      spent: "£419.94",
      lastOrder: "Mar 18, 2023",
      status: "Active",
    },
    {
      id: 8,
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      orders: 1,
      spent: "£59.99",
      lastOrder: "Mar 19, 2023",
      status: "Inactive",
    },
    {
      id: 9,
      name: "James Anderson",
      email: "james.anderson@example.com",
      orders: 8,
      spent: "£689.92",
      lastOrder: "Mar 19, 2023",
      status: "Active",
    },
    {
      id: 10,
      name: "Lisa Thomas",
      email: "lisa.thomas@example.com",
      orders: 3,
      spent: "£239.97",
      lastOrder: "Mar 20, 2023",
      status: "Active",
    },
  ]

  filteredCustomers: Customer[] = [...this.customers]

  applyFilters() {
    this.filteredCustomers = this.customers.filter((customer) => {
      // Search filter
      const searchMatch =
        this.filters.search === "" ||
        customer.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.filters.search.toLowerCase())

      // Status filter
      const statusMatch = this.filters.status === "" || customer.status === this.filters.status

      return searchMatch && statusMatch
    })

    // Sort
    if (this.filters.sort === "name") {
      this.filteredCustomers.sort((a, b) => a.name.localeCompare(b.name))
    } else if (this.filters.sort === "orders") {
      this.filteredCustomers.sort((a, b) => b.orders - a.orders)
    } else if (this.filters.sort === "spent") {
      this.filteredCustomers.sort((a, b) => {
        const aValue = Number.parseFloat(a.spent.replace("£", ""))
        const bValue = Number.parseFloat(b.spent.replace("£", ""))
        return bValue - aValue
      })
    } else if (this.filters.sort === "lastOrder") {
      this.filteredCustomers.sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime())
    }
  }
}

