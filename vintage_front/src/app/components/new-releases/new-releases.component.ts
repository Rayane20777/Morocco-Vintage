import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-new-releases",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-16 bg-cream dark:bg-dark-bg transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold relative dark:text-white">
            New Releases
            <span class="absolute -bottom-2 left-0 w-16 h-1 bg-teal"></span>
          </h2>
          <a routerLink="/new-releases" class="text-teal hover:text-teal/80 font-medium flex items-center gap-1 group">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ng-container *ngFor="let album of newReleases">
            <div class="group">
              <div class="relative aspect-square overflow-hidden rounded-lg mb-3 shadow-md transform transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <img
                  [src]="album.image"
                  [alt]="album.title + ' by ' + album.artist"
                  class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <ng-container *ngIf="album.isNewRelease">
                  <span class="absolute top-3 left-3 bg-gold text-black px-2 py-1 rounded-md text-xs font-bold z-20 shadow-md">New Release</span>
                </ng-container>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 class="font-medium text-white truncate">{{ album.title }}</h3>
                  <p class="text-white/80 text-sm">{{ album.artist }}</p>
                </div>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button class="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </button>
                </div>
                <button class="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white transform scale-75 group-hover:scale-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div class="dark:text-white">
                <h3 class="font-medium truncate">{{ album.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ album.artist }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="font-bold dark:text-white">{{ album.price.toFixed(2) }}</span>
                  <button class="bg-teal hover:bg-teal/90 text-white px-3 py-1 rounded-md text-sm transition-transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class NewReleasesComponent {
  newReleases = [
    {
      id: 1,
      title: "Happier Than Ever",
      artist: "Billie Eilish",
      price: 32.99,
      image: "/assets/placeholder.svg",
      isNewRelease: true,
    },
    {
      id: 2,
      title: "30",
      artist: "Adele",
      price: 29.99,
      image: "/assets/placeholder.svg",
      isNewRelease: true,
    },
    {
      id: 3,
      title: "SOUR",
      artist: "Olivia Rodrigo",
      price: 27.99,
      image: "/assets/placeholder.svg",
      isNewRelease: true,
    },
    {
      id: 4,
      title: "Planet Her",
      artist: "Doja Cat",
      price: 28.99,
      image: "/assets/placeholder.svg",
      isNewRelease: true,
    },
  ]
}

