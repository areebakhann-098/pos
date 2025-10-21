import { Component, signal } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CalculatorComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidebarOpen = signal(true);     // Sidebar toggle
  toggleDropdown = false;         // Profile dropdown toggle

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  // ✅ Logout function
  logout() {
    // Remove token & user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page (root '/')
    this.router.navigate(['/']);
  }
}
