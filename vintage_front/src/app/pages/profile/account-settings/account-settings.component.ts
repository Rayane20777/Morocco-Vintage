import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-account-settings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold mb-6 dark:text-white">Account Settings</h2>
      
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal"
            placeholder="John Doe"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal"
            placeholder="john.doe@example.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            class="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal"
            placeholder="+44 123 456 7890"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            class="form-textarea block w-full rounded-md border-gray-300 shadow-sm focus:border-teal focus:ring-teal"
            rows="3"
            placeholder="123 Main St, London, UK"
          ></textarea>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-teal hover:bg-teal/90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class AccountSettingsComponent {}

