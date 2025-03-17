import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-newsletter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-16 bg-tan dark:bg-black relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white">Stay in the Groove</h2>
          <p class="mt-4 text-white/90">
            Subscribe to our newsletter for exclusive deals, new releases, and vinyl collecting tips.
          </p>
          <form (ngSubmit)="onSubmit()" class="mt-8 flex flex-col sm:flex-row gap-3">
            <div class="relative flex-grow">
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                class="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-teal px-4 py-3 rounded-md w-full pr-10"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/50 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <button 
              type="submit" 
              class="bg-gold hover:bg-gold/90 text-black whitespace-nowrap px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
              [class.animate-pulse]="isSubmitting"
            >
              {{ isSubmitting ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </form>
          <p class="mt-4 text-sm text-white/70">
            By subscribing, you agree to receive marketing emails from us. No spam, just vinyl love.
          </p>
          
          <div *ngIf="showSuccess" class="mt-6 p-3 bg-teal/20 text-white rounded-md animate-fade-in">
            Thanks for subscribing! Check your email to confirm your subscription.
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10">
        <div class="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white"></div>
        <div class="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-white"></div>
        <div class="absolute top-1/2 left-1/4 w-20 h-20 rounded-full border-2 border-white"></div>
      </div>
    </section>
  `,
  styles: [
    `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `,
  ],
})
export class NewsletterComponent {
  email = ""
  isSubmitting = false
  showSuccess = false

  onSubmit() {
    if (!this.email) return

    this.isSubmitting = true
    console.log("Subscribed with email:", this.email)

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false
      this.showSuccess = true
      this.email = ""

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccess = false
      }, 5000)
    }, 1500)
  }
}

