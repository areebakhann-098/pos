import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../core/services/role-services/role.service';
import { Role } from '../core/interfaces/role';
import { Permission } from '../core/interfaces/permission';
import { PermissionService } from '../core/services/permission-services/permmission.service';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-role.component.html',
})
export class AddRoleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);
  private router = inject(Router);

  roleForm!: FormGroup;
  permissions: Permission[] = [];

  ngOnInit(): void {
    // ✅ Initialize form
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: [[]],
    });

    // ✅ Load all permissions
    this.loadPermissions();
  }

  // ✅ Load all permissions from backend
  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (err) => console.error('❌ Failed to load permissions:', err),
    });
  }

  // ✅ Checkbox change handler
  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selected: number[] = this.roleForm.get('permissions')?.value || [];

    if (checkbox.checked) {
      if (!selected.includes(+checkbox.value)) {
        selected.push(+checkbox.value);
      }
    } else {
      const index = selected.indexOf(+checkbox.value);
      if (index > -1) selected.splice(index, 1);
    }

    this.roleForm.get('permissions')?.setValue([...selected]);
  }

  // ✅ Submit form (Add new role)
  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const { roleName, permissions } = this.roleForm.value;
    const lowerCaseRoleName = roleName.toLowerCase(); // Convert role name to lowercase

    console.log('📤 Submitting Role Form:', {
      name: lowerCaseRoleName,
      permissions,
    });

    const newRoleData = { name: lowerCaseRoleName, permissionIds: permissions };

    // 🟢 Create new role
    this.roleService.createRole(newRoleData).subscribe({
      next: (res) => {
        // Assign permissions after role is created
        this.assignPermissions(res.id, permissions);
        alert('✅ Role created successfully!');
        this.router.navigate(['/home/roleList']);
      },
      error: (err) => console.error('❌ Failed to create role:', err),
    });
  }

  // ✅ Assign selected permissions to role
  private assignPermissions(roleId: number, permissionIds: number[]): void {
    if (!permissionIds || permissionIds.length === 0) return;
    console.log(`🔗 Assigning ${permissionIds.length} permissions to role #${roleId}`);

    permissionIds.forEach((pid) => {
      this.roleService.assignPermissionToRole({ roleId, permissionId: pid }).subscribe({
        next: () => console.log(`✅ Permission #${pid} assigned to role #${roleId}`),
        error: (err) => console.error('❌ Failed to assign permission:', err),
      });
    });
  }
}