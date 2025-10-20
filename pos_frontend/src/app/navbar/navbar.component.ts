import { Component, signal } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CalculatorComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidebarOpen = signal(true);    // sidebar toggle
  toggleDropdown = false;        // profile dropdown toggle

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
