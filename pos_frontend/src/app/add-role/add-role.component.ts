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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  roleForm!: FormGroup;
  isEditMode = false;
  roleId: number | null = null;
  permissions: Permission[] = [];

  ngOnInit(): void {
    // ✅ Initialize form
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: [[]],
    });

    // ✅ Step 1: Load all permissions
    this.loadPermissions();

    // ✅ Step 2: Check route params
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('🆔 Extracted ID from Route Params:', id);

      if (id) {
        this.roleId = +id;
        this.isEditMode = true;
        console.log(`✏️ Edit Mode Enabled for Role ID: ${this.roleId}`);
        this.loadRoleData(this.roleId);
      } else {
        console.log('⚠️ No ID found in route params. Running in ADD mode.');
      }
    });
  }

  // ✅ Load all permissions from backend
  loadPermissions(): void {
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        console.log('✅ Permissions loaded:', data);
        this.permissions = data;
      },
      error: (err) => console.error('❌ Failed to load permissions:', err),
    });
  }

  // ✅ Load role details (for edit)
  loadRoleData(id: number): void {
    console.log(`📡 Fetching role data for ID: ${id}`);
    this.roleService.getRoleById(id).subscribe({
      next: (role: Role) => {
        console.log('📄 Loaded role data:', role);

        // Wait for permissions to load before patching
        setTimeout(() => {
          this.roleForm.patchValue({
            roleName: role.name,
            permissions: role.permissions?.map((p) => p.id) || [],
          });
          console.log('✅ Form patched with role data:', this.roleForm.value);
        }, 300);
      },
      error: (err) => console.error('❌ Failed to load role data:', err),
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
    console.log('📋 Selected permissions:', selected);
  }

onSubmit(): void {
  if (this.roleForm.invalid) return;

  const { roleName, permissions } = this.roleForm.value;
  const lowerCaseRoleName = roleName.toLowerCase(); // 👈 convert to lowercase

  console.log('📤 Submitting Role Form:', {
    name: lowerCaseRoleName,
    permissions,
  });

  if (this.isEditMode && this.roleId) {
    // 🟠 Update existing role
    this.roleService.updateRole(this.roleId, { name: lowerCaseRoleName }).subscribe({
      next: () => {
        this.assignPermissions(this.roleId!, permissions);
        alert('✅ Role updated successfully!');
        this.router.navigate(['/home/roleList']);
      },
      error: (err) => console.error('❌ Failed to update role:', err),
    });
  } else {
    // 🟢 Create new role
    const newRoleData = { name: lowerCaseRoleName, permissionIds: permissions };
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
}


  // ✅ Assign selected permissions to role (for update)
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
