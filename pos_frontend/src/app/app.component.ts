import { Component, signal } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from "./side-bar/side-bar.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule, SideBarComponent, ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pos-frontend';

 // Dropdown open/close signals
  userMenuOpen = signal(false);
  contactMenuOpen = signal(false);
  productMenuOpen = signal(false);
  purchaseMenuOpen = signal(false);
  sellMenuOpen = signal(false);
  stockMenuOpen = signal(false);
  stockAdjMenuOpen = signal(false);
  reportsMenuOpen = signal(false);
  businessMenuOpen = signal(false);

  toggle(menu: string) {
    switch (menu) {
      case 'user': this.userMenuOpen.update(v => !v); break;
      case 'contact': this.contactMenuOpen.update(v => !v); break;
      case 'product': this.productMenuOpen.update(v => !v); break;
      case 'purchase': this.purchaseMenuOpen.update(v => !v); break;
      case 'sell': this.sellMenuOpen.update(v => !v); break;
      case 'stock': this.stockMenuOpen.update(v => !v); break;
      case 'stockAdj': this.stockAdjMenuOpen.update(v => !v); break;
      case 'reports': this.reportsMenuOpen.update(v => !v); break;
      case 'business': this.businessMenuOpen.update(v => !v); break;
    }
  }
}