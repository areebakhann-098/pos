import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../core/services/permission-services/permmission.service';
import { Permission } from '../core/interfaces/role'; 

@Component({
  selector: 'app-add-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-permission.component.html',
  styleUrl: './add-permission.component.css'
})
export class AddPermissionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private permissionService = inject(PermissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  permissionForm!: FormGroup;
  isEditMode = false;
  permissionId: number | null = null;

  ngOnInit(): void {
    this.permissionForm = this.fb.group({
      resource: ['', Validators.required],
      action: ['', Validators.required],
      possession: ['', Validators.required],
      attributes: ['']
    });

    //  Check edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.permissionId = +id;
      this.loadPermissionData(this.permissionId);
    }
  }

  //  Load existing permission data
  loadPermissionData(id: number): void {
    this.permissionService.getPermissionById(id).subscribe({
      next: (data: Permission) => {
        this.permissionForm.patchValue({
          resource: data.resource,
          action: data.action,
          possession: data.possession,
          attributes: (data.attributes || []).join(', ')
        });
      },
      error: (err) => console.error('Failed to load permission:', err)
    });
  }

 onSubmit(): void {
  if (this.permissionForm.invalid) return;

  //  Convert all input values to lowercase before saving
  const payload: Permission = {
    resource: this.permissionForm.value.resource.toLowerCase(),
    action: this.permissionForm.value.action.toLowerCase(),
    possession: this.permissionForm.value.possession.toLowerCase(),
    attributes: this.permissionForm.value.attributes
      ? this.permissionForm.value.attributes
          .split(',')
          .map((a: string) => a.trim().toLowerCase()) // lowercase each attribute
      : []
  };

  if (this.isEditMode && this.permissionId) {
    this.permissionService.updatePermission(this.permissionId, payload).subscribe({
      next: () => {
        alert(' Permission updated successfully!');
        this.router.navigate(['/home/permi1ssionList']);
      },
      error: (err) => console.error('Failed to update permission:', err)
    });
  } else {
    this.permissionService.createPermission(payload).subscribe({
      next: () => {
        alert(' Permission created successfully!');
        this.permissionForm.reset();
        this.router.navigate(['/home/permissionList']);
      },
      error: (err) => console.error('Failed to create permission:', err)
    });
  }
}

}
