import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Store } from "@ngrx/store"
import { Observable } from "rxjs"
import { UserActions } from "../../../store/users/user.actions"
import { selectUsers, selectUserLoading, selectUserError } from "../../../store/users/user.selectors"
import { User } from "../../../store/users/user.types"

@Component({
  selector: "app-customers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Users</h1>
          <p class="text-gray-500 mt-1">Manage your user accounts</p>
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
            Add User
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
              placeholder="Search users..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              [(ngModel)]="filters.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              [(ngModel)]="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>

      <!-- Users Table -->
      <div *ngIf="!(loading$ | async) && filteredUsers.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of filteredUsers">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-gray-500 font-medium">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-gray-500">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.phoneNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let role of user.roles"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-purple-100 text-purple-800': role === 'ADMIN',
                        'bg-blue-100 text-blue-800': role === 'USER'
                      }"
                    >
                      {{ role }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800': user.active,
                      'bg-gray-100 text-gray-800': !user.active
                    }"
                  >
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-teal hover:text-teal/80 mr-3">View</button>
                  <button class="text-gray-600 hover:text-gray-800 mr-3">Edit</button>
                  <button 
                    (click)="toggleUserStatus(user)" 
                    [class.text-red-600]="user.active"
                    [class.text-green-600]="!user.active"
                    class="hover:text-opacity-80"
                  >
                    {{ user.active ? 'Deactivate' : 'Activate' }}
                  </button>
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredUsers.length }}</span> of <span class="font-medium">{{ filteredUsers.length }}</span> results
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!(loading$ | async) && filteredUsers.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No users found</h3>
        <p class="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    </div>
  `,
})
export class CustomersComponent implements OnInit {
  users$: Observable<User[]>
  loading$: Observable<boolean>
  error$: Observable<string | null>

  users: User[] = []
  filteredUsers: User[] = []

  filters = {
    search: "",
    role: "",
    status: "",
  }

  constructor(private store: Store) {
    this.users$ = this.store.select(selectUsers)
    this.loading$ = this.store.select(selectUserLoading)
    this.error$ = this.store.select(selectUserError)
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers())

    this.users$.subscribe((users) => {
      this.users = users
      this.applyFilters()
    })
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      // Search filter
      const searchMatch =
        this.filters.search === "" ||
        user.username.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filters.search.toLowerCase())

      // Role filter
      const roleMatch = this.filters.role === "" || user.roles.includes(this.filters.role)

      // Status filter
      const statusMatch =
        this.filters.status === "" ||
        (this.filters.status === "active" && user.active) ||
        (this.filters.status === "inactive" && !user.active)

      return searchMatch && roleMatch && statusMatch
    })
  }

  toggleUserStatus(user: User): void {
    this.store.dispatch(
      UserActions.updateUserStatus({
        id: user.id,
        active: !user.active,
      }),
    )
  }
}

