import { Component, OnInit, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './navbar/navbar.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { AddProductComponent } from './add-product/add-product.component';
import { VariationsComponent } from './variations/variations.component';
import { BrandsComponent } from './brands/brands.component';
import { UnitsComponent } from './units/units.component';
import { CategoriesComponent } from './categories/categories.component';
import { WarrantiesComponent } from './warranties/warranties.component';
import { ExpiryComponent } from './expiry/expiry.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    
    RouterLink,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'pos-frontend';

  // Signal to toggle AddContact form
  showAddContactForm = signal(false);

  ngOnInit(): void {
    initFlowbite();
  }

  openAddContactForm() {
    this.showAddContactForm.set(true);
  }

  closeAddContactForm() {
    this.showAddContactForm.set(false);
  }
}
