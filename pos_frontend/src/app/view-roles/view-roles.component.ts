import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../core/services/role-services/role.service';
import { Role } from '../core/interfaces/role';

@Component({
  selector: 'app-view-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.css'],
})
export class ViewRolesComponent implements OnInit {
  roles: Role[] = [];
  loading = false;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (data) => {
        console.log('🔥 Roles Response:', data);
        this.roles = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error loading roles:', err);
        this.toastr.error('Failed to load roles', 'Error');
      },
    });
  }

  // ✅ Delete Role
  deleteRole(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.toastr.success('Role deleted successfully!', 'Deleted');
          this.loadRoles();
        },
        error: (err) => {
          console.error('❌ Error deleting role:', err);
          this.toastr.error('Failed to delete role', 'Error');
        },
      });
    }
  }


}
