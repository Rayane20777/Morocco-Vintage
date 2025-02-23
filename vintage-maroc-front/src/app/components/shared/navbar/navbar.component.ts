import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"
import { CartService } from '../../../services/cart.service'
import { map } from 'rxjs/operators'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  cartItemCount$ = this.cartService.getCartItems().pipe(
    map(items => items.length)
  )

  constructor(private cartService: CartService) {}
}

