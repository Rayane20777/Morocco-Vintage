import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { VinylCardComponent } from "../vinyl-card/vinyl-card.component"
import { VinylRecord } from '../../models/vinyl.model'

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, VinylCardComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  records: VinylRecord[] = [
    {
      id: "1",
      title: "Sample Album",
      artist: "Sample Artist",
      imageUrl: 'https://placehold.co/400x400',
      have: 100,
      want: 50,
      rating: "4.5",
      label: "Sample Label",
      catalogNumber: "CAT001",
      mediaCondition: "Mint",
      sleeveCondition: "Near Mint",
      description: "Sample description",
      ratingPercent: 90,
      ratings: 200,
      shipsFrom: "UK",
      price: 29.99,
      shipping: 3.99,
      totalEuros: 33.98
    },
    {
      id: '2',
      title: 'Thriller',
      artist: 'Michael Jackson',
      label: 'Epic',
      catalogNumber: 'EPC 85930',
      mediaCondition: 'Near Mint (NM or M-)',
      sleeveCondition: 'Very Good Plus (VG+)',
      description: 'Classic album in excellent condition',
      price: 24.99,
      shipping: 3.99,
      totalEuros: 26.42,
      rating: "4.8",
      ratingPercent: 96.0,
      ratings: 3456,
      imageUrl: 'https://placehold.co/400x400',
      have: 2345,
      want: 4567,
      shipsFrom: 'United States'
    }
  ];

  sortOptions: string[] = ['Newest', 'Price: Low to High', 'Price: High to Low'];

  featuredProducts = [
    {
      name: 'Featured Product 1',
      description: 'Description 1',
      price: 99.99,
      image: 'https://placehold.co/400x400'
    },
    {
      name: 'Featured Product 2',
      description: 'Description 2',
      price: 149.99,
      image: 'https://placehold.co/400x400'
    }
  ];
}

