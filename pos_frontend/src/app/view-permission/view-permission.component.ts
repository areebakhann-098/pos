import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PermissionService } from '../core/services/permission-services/permmission.service';
import { Permission } from '../core/interfaces/role';
@Component({
  selector: 'app-view-permission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-permission.component.html',
  styleUrls: ['./view-permission.component.css']
})
export class ViewPermissionComponent implements OnInit {
  permissions: Permission[] = [];

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (err) => {
        console.error('Error fetching permissions:', err);
      },
    });
  }

  deletePermission(id: number | undefined): void {
    if (!id) return;

    const confirmed = confirm('Are you sure you want to delete this permission?');
    if (confirmed) {
      this.permissionService.deletePermission(id).subscribe({
        next: () => {
          this.loadPermissions(); 
        },
        error: (err) => {
          console.error('Error deleting permission:', err);
        },
      });
    }
  }

  editPermission(permission: Permission): void {
    this.router.navigate(['/dashboard/add-permission'], {
      queryParams: { id: permission.id },
    });
  }
}
