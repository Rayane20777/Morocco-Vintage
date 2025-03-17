import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterLink } from "@angular/router"

@Component({
  selector: "app-release-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-cream dark:bg-dark-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      @if (release) {
        <div class="max-w-7xl mx-auto">
          <nav class="mb-8 text-sm" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex">
              <li class="flex items-center">
                <a routerLink="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Home</a>
                <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li class="flex items-center">
                <a routerLink="/browse" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Browse</a>
                <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li>
                <span class="text-gray-700 dark:text-gray-200" aria-current="page">{{ release.title }}</span>
              </li>
            </ol>
          </nav>

          <div class="bg-white dark:bg-dark-card shadow-xl rounded-lg overflow-hidden">
            <div class="md:flex">
              <div class="md:flex-shrink-0">
                <img class="h-full w-full object-cover md:w-96" [src]="release.imageUrl" [alt]="release.title">
              </div>
              <div class="p-8 flex flex-col justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ release.title }}</h1>
                  <p class="mt-2 text-xl text-teal">{{ release.artist }}</p>
                  <div class="mt-4 flex items-center">
                    <div class="flex text-yellow-400">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <svg [class]="star <= release.rating ? 'w-5 h-5 fill-current' : 'w-5 h-5 text-gray-300 dark:text-gray-600'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      }
                    </div>
                    <p class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ release.rating }} out of 5 stars</p>
                  </div>
                  <p class="mt-4 text-gray-600 dark:text-gray-300">{{ release.description }}</p>
                </div>
                <div class="mt-8">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">£{{ release.price.toFixed(2) }}</div>
                  <button class="mt-4 w-full bg-teal hover:bg-teal/90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 dark:bg-dark-bg px-8 py-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Release Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Label:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.label }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Catalog Number:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.catalogNumber }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Format:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.format }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Country:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.country }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Released:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.releaseDate }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Genre:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.genre }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Media Condition:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.mediaCondition }}</span>
                </div>
                <div>
                  <span class="font-bold text-gray-700 dark:text-gray-300">Sleeve Condition:</span>
                  <span class="ml-2 text-gray-600 dark:text-gray-400">{{ release.sleeveCondition }}</span>
                </div>
              </div>
            </div>
            @if (release.trackList && release.trackList.length > 0) {
              <div class="px-8 py-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Track List</h2>
                <ul class="list-decimal list-inside">
                  @for (track of release.trackList; track track) {
                    <li class="text-gray-600 dark:text-gray-400">{{ track }}</li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal"></div>
        </div>
      }
    </div>
  `,
  styles: [
    `
    /* You can add any additional styles here */
  `,
  ],
})
export class ReleaseDetailComponent implements OnInit {
  release: any

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")
    // In a real application, you would fetch the release data from a service
    // For now, we'll just use mock data
    this.release = {
      id: 1,
      artist: "Pink Floyd",
      title: "Dark Side of the Moon",
      imageUrl:
        "https://images.theconversation.com/files/512871/original/file-20230301-26-ryosag.jpg?ixlib=rb-4.1.0&rect=97%2C79%2C5799%2C5817&q=45&auto=format&w=926&fit=clip",
      label: "Harvest",
      catalogNumber: "SHVL 804",
      format: "Vinyl, LP, Album",
      country: "UK",
      releaseDate: "March 1, 1973",
      genre: "Rock, Psychedelic Rock",
      mediaCondition: "Near Mint (NM or M-)",
      sleeveCondition: "Very Good Plus (VG+)",
      description:
        "Original UK pressing from 1973. The vinyl is in excellent condition with minimal surface noise. The sleeve shows some light wear on the edges but overall in great condition. This iconic album features classic tracks like 'Money', 'Time', and 'Us and Them'.",
      rating: 4.8,
      price: 149.99,
      trackList: [
        "Speak to Me",
        "Breathe",
        "On the Run",
        "Time",
        "The Great Gig in the Sky",
        "Money",
        "Us and Them",
        "Any Colour You Like",
        "Brain Damage",
        "Eclipse",
      ],
    }
  }
}

