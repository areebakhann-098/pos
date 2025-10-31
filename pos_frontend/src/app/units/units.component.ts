import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../core/services/unit/unit.service';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  units: any[] = [];
  unit = {
    name: '',
    short_name: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private unitService: UnitService) {}

  ngOnInit(): void {
    this.getAllUnits();
  }

  getAllUnits() {
    this.unitService.getAllUnits().subscribe({
      next: (res) => {
        this.units = Array.isArray(res) ? res : res.data || [];
      },
      error: (err) => console.error('Error fetching units:', err)
    });
  }

  addUnit() {
    if (!this.unit.name.trim() || !this.unit.short_name.trim()) {
      alert('Please fill all fields!');
      return;
    }

    this.unitService.createUnit(this.unit).subscribe({
      next: () => {
        alert(' Unit added successfully!');
        this.unit = { name: '', short_name: '' };
        this.getAllUnits();
      },
      error: (err) => console.error('Error adding unit:', err)
    });
  }

  editUnit(u: any) {
    this.isEditMode = true;
    this.editId = u.id;
    this.unit = { name: u.name, short_name: u.short_name };
  }

  updateUnit() {
    if (!this.editId) return;

    this.unitService.updateUnit(this.editId, this.unit).subscribe({
      next: () => {
        alert(' Unit updated successfully!');
        this.cancelEdit();
        this.getAllUnits();
      },
      error: (err) => console.error('Error updating unit:', err)
    });
  }

  deleteUnit(id: number) {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.unitService.deleteUnit(id).subscribe({
        next: () => {
          alert(' Unit deleted!');
          this.getAllUnits();
        },
        error: (err) => console.error('Error deleting unit:', err)
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editId = null;
    this.unit = { name: '', short_name: '' };
  }
}
