import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-account-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="space-y-2">
        <label for="name">
          Name
          <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          [(ngModel)]="name"
          required
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="space-y-2">
        <label for="email">
          Email
          <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          [(ngModel)]="email"
          required
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="space-y-2">
        <label for="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          [(ngModel)]="bio"
          rows="4"
          class="w-full p-2 border rounded"
        ></textarea>
      </div>
      <button type="submit" class="bg-teal text-white p-2 rounded hover:bg-teal/90">
        Update account
      </button>
    </form>
  `,
  styles: [],
})
export class AccountFormComponent {
  name = ""
  email = ""
  bio = ""

  onSubmit() {
    console.log("Form submitted", { name: this.name, email: this.email, bio: this.bio })
    // Here you would typically send this data to your backend
  }
}

