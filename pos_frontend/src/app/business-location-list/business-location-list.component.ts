import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessLocationService } from '../core/services/business_location/business-location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-location-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-location-list.component.html',
  styleUrls: ['./business-location-list.component.css']
})
export class BusinessLocationListComponent implements OnInit {
  locations: any[] = [];

  constructor(
    private locationService: BusinessLocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res: any) => {
        this.locations = res.locations || [];
        console.log("location", this.locations)
      },
      error: (err) => console.error('❌ Error fetching locations:', err)
    });
  }

  deleteLocation(id: number) {
    if (confirm('🗑️ Are you sure you want to delete this location?')) {
      this.locationService.deleteLocation(id).subscribe({
        next: () => {
          alert('✅ Location deleted successfully!');
          this.getAllLocations();
        },
        error: (err) => console.error('Error deleting location:', err)
      });
    }
  }

  editLocation(loc: any) {
    // Navigate to the form with the location ID
    this.router.navigate(['/businessLocation/edit', loc.id]);
  }
}
