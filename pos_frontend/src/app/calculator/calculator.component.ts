import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-calculator',
  imports: [CommonModule,  FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
showCalculator = false;
  display: string = '';

  toggleCalculator() {
    this.showCalculator = !this.showCalculator;
  }

  append(value: string) {
    this.display += value;
  }

  clearAll() {
    this.display = '';
  }

  clearEntry() {
    this.display = this.display.slice(0, -1);
  }

  calculate() {
    try {
      this.display = eval(this.display).toString();
    } catch {
      this.display = 'Error';
    }
  }
}

