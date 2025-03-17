import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { FeaturedAlbumsComponent } from "../../components/featured-albums/featured-albums.component"
import { NewReleasesComponent } from "../../components/new-releases/new-releases.component"
import { NewsletterComponent } from "../../components/newsletter/newsletter.component"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, FeaturedAlbumsComponent, NewReleasesComponent, NewsletterComponent],
  template: `
    <div class="min-h-screen bg-cream">
      <!-- Hero Section with Parallax -->
      <section class="relative h-[80vh] bg-black overflow-hidden">
        <div class="absolute inset-0 opacity-60 bg-gradient-to-b from-black/80 to-black/40">
          <div class="absolute inset-0 parallax-bg"></div>
        </div>
        <div class="absolute inset-0 flex items-center">
          <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
              <h1 class="text-4xl md:text-6xl font-bold text-cream mb-4 animate-fade-in">
                Discover the Warmth of <span class="text-teal">Analog Sound</span>
              </h1>
              <p class="mt-4 text-lg md:text-xl text-cream/90 max-w-xl animate-fade-in-delay">
                Curated vinyl collections for the discerning music lover. From classics to contemporary releases.
              </p>
              <div class="mt-8 flex flex-wrap justify-center md:justify-start gap-4 animate-fade-in-delay-2">
                <a routerLink="/browse" class="bg-teal hover:bg-teal/90 text-white px-6 py-3 rounded-md font-medium transition-transform hover:scale-105">
                  Shop New Arrivals
                </a>
                <a routerLink="/browse" class="border border-cream text-cream hover:bg-cream/10 px-6 py-3 rounded-md font-medium transition-transform hover:scale-105">
                  Browse Collections
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Floating vinyl records decoration -->
        <div class="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-black/80 border-4 border-teal/30 animate-float"></div>
        <div class="absolute top-20 -right-10 w-32 h-32 rounded-full bg-black/80 border-4 border-gold/30 animate-float animation-delay-1000"></div>
        <div class="absolute bottom-40 right-20 w-24 h-24 rounded-full bg-black/80 border-4 border-tan/30 animate-float animation-delay-2000"></div>
      </section>

      <!-- Featured Categories -->
      <section class="py-16 bg-cream">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Browse by Genre</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (genre of genres; track genre) {
              <div class="group relative h-40 md:h-64 overflow-hidden rounded-lg shadow-md transform transition-transform hover:scale-105 hover:-rotate-1">
                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10"></div>
                <img
                  src="/assets/placeholder.svg"
                  [alt]="genre"
                  class="object-cover w-full h-full transition-transform group-hover:scale-110 duration-700"
                />
                <div class="absolute inset-0 z-20 flex items-center justify-center">
                  <span class="text-lg md:text-xl font-medium text-white group-hover:text-teal transition-colors">{{ genre }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Featured Albums -->
      <app-featured-albums></app-featured-albums>

      <!-- Promo Banner -->
      <section class="py-12 bg-teal relative overflow-hidden">
        <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-white">Limited Time Offer</h2>
              <p class="mt-2 text-white/90">Get 15% off on all pre-orders with code: <span class="font-mono bg-white/20 px-2 py-1 rounded">VINYLVAULT15</span></p>
            </div>
            <a routerLink="/browse" class="bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-md font-medium transition-transform hover:scale-105">Shop Pre-Orders</a>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="absolute top-0 left-0 w-20 h-20 rounded-full border-2 border-white"></div>
          <div class="absolute bottom-0 right-0 w-32 h-32 rounded-full border-2 border-white"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border-2 border-white"></div>
        </div>
      </section>

      <!-- New Releases -->
      <app-new-releases></app-new-releases>

      <!-- Equipment Section -->
      <section class="py-16 bg-cream">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="w-full md:w-1/2 relative h-80 md:h-[500px] rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 duration-500">
              <img src="/assets/placeholder.svg" alt="Turntable" class="object-cover w-full h-full transition-transform hover:scale-110 duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div class="p-6">
                  <h3 class="text-xl font-bold text-white">Premium Equipment</h3>
                  <p class="text-white/80">Elevate your listening experience</p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2">
              <h2 class="text-2xl md:text-3xl font-bold">Premium Turntables & Equipment</h2>
              <p class="mt-4 text-gray-700">
                Complete your vinyl experience with our selection of high-quality turntables, speakers, and
                accessories. We carry only the best brands to ensure your records sound their absolute best.
              </p>
              <ul class="mt-6 space-y-3">
                @for (item of equipmentItems; track item) {
                  <li class="flex items-center gap-2 group">
                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-teal/10 text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span>{{ item }}</span>
                  </li>
                }
              </ul>
              <a routerLink="/equipment" class="mt-6 inline-block bg-tan hover:bg-tan/90 text-white px-6 py-3 rounded-md font-medium transition-transform hover:scale-105">Shop Equipment</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter -->
      <app-newsletter></app-newsletter>
    </div>
  `,
  styles: [
    `
    .parallax-bg {
      background-image: url('/assets/placeholder.svg');
      background-size: cover;
      background-position: center;
      transform: translateZ(0);
      will-change: transform;
      height: 120%;
      width: 120%;
      top: -10%;
      left: -10%;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    
    .animate-fade-in-delay {
      animation: fadeIn 0.8s ease-out 0.3s forwards;
      opacity: 0;
    }
    
    .animate-fade-in-delay-2 {
      animation: fadeIn 0.8s ease-out 0.6s forwards;
      opacity: 0;
    }
    
    .animation-delay-1000 {
      animation-delay: 1s;
    }
    
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `,
  ],
})
export class HomeComponent {
  genres = ["Rock & Alternative", "Jazz & Blues", "Hip Hop & R&B", "Electronic"]
  equipmentItems = ["Turntables", "Speakers", "Amplifiers", "Accessories"]
}

