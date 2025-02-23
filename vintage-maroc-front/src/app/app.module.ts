import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./components/home/home.component"
import { AboutComponent } from "./components/about/about.component"
import { AuthModule } from "./components/auth/auth.module"
import { MainModule } from "./components/main/main.module"
import { SharedModule } from "./components/shared/shared.module"
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { VinylCardComponent } from './components/vinyl-card/vinyl-card.component'
import { CartService } from './services/cart.service'
import { HttpClientModule } from '@angular/common/http'
import { NavbarComponent } from './components/shared/navbar/navbar.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, AboutComponent, VinylCardComponent],
  imports: [],
  providers: [CartService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

