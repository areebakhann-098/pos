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
  sidebarOpen = signal(true);    
  toggleDropdown = false;         

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }
}
