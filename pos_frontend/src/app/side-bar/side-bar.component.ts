import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  @Input() sidebarOpen = signal(true);
 
  // Submenu signals
  userMenuOpen = signal(false);
  contactMenuOpen = signal(false);
  productMenuOpen = signal(false);
  purchaseMenuOpen = signal(false);
  sellMenuOpen = signal(false);
  stockMenuOpen = signal(false);
  stockAdjMenuOpen = signal(false);
  reportsMenuOpen = signal(false);
  businessMenuOpen = signal(false);
userRole: string | null = null;
 
constructor() {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    this.userRole = user.role;
  }
}
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
 