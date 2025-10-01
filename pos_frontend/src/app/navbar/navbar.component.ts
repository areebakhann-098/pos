import { Component, OnInit} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CalculatorComponent } from '../calculator/calculator.component';


@Component({
  selector: 'app-navbar',
  imports: [CalculatorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
