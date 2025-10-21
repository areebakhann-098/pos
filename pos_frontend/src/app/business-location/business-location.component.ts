import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-business-location',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-location.component.html',
  styleUrls: ['./business-location.component.css']
})
export class BusinessLocationComponent implements OnInit {
  location = {
    name: '',
    city: '',
    zip_code: '',
    country: '',
    email: '',
        mobile: '', // ✅ Added mobile here

    state: '',
    landmark: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(
    private locationService: BusinessLocationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLocation(+id);
    }
  }

  loadLocation(id: number) {
    this.isEditMode = true;
    this.editId = id;

    this.locationService.getLocationById(id).subscribe({
      next: (res: any) => {
       this.location = {
                  mobile: res.message.mobile, 
  name: res.message.name,
  city: res.message.city,
  zip_code: res.message.zip_code,
  country: res.message.country,
  email: res.message.email,
  state: res.message.state,
  landmark: res.message.landmark
};

      },
      error: (err) => console.error('Error loading location:', err)
    });
  }

  onSubmit() {
    if (!this.location.name.trim() || !this.location.city.trim()) {
      alert('⚠️ Please fill required fields!');
      return;
    }

    if (this.isEditMode && this.editId) {
      this.locationService.updateLocation(this.editId, this.location).subscribe({
        next: () => {
          alert('✅ Location updated successfully!');
          this.router.navigate(['/home/location_list']); // redirect back to list
        },
        error: (err) => console.error('Error updating location:', err)
      });
    } else {
      this.locationService.createLocation(this.location).subscribe({
        next: () => {
          alert('✅ Location added successfully!');
          this.resetForm();
        },
        error: (err) => console.error('Error adding location:', err)
      });
    }
  }

  resetForm() {
    this.location = {
      name: '',
      city: '',
      zip_code: '',
      country: '',
      email: '',
      state: '',
      landmark: '',
       mobile: '',
    };
    this.isEditMode = false;
    this.editId = null;
  }
}
