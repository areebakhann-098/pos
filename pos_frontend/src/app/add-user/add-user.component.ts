import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AddUserService } from '../core/services/add-user/add-user.service';
import { RoleService } from '../core/services/role-services/role.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  registerForm!: FormGroup;
  roles: string[] = [];
  isEditMode = false;
  editUserId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: AddUserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      access: [false]
    });

    this.loadRoles();

    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      const name = params['name'];
      const email = params['email'];
      const access = params['access'] === 'true';
      const role = params['role'];

      if (id && name && email) {
        this.isEditMode = true;
        this.editUserId = id;
        this.registerForm.patchValue({ name, email, access, role });
        this.registerForm.get('password')?.clearValidators();
        this.registerForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles: any[]) => {
        this.roles = roles.map(role => role.name);
      },
      error: (err) => {
        console.error('Role load error:', err);
        alert('❌ Failed to load roles. Please try again later.');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      alert('⚠️ Please fill all required fields correctly.');
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    if (this.isEditMode) {
      const updatedUser = {
        id: this.editUserId,
        name: formData.name,
        email: formData.email,
        access: formData.access,
        role: formData.role
      };

      this.userService.updateUser(this.editUserId, updatedUser).subscribe({
        next: () => {
          alert('✅ User updated successfully!');
          this.router.navigate(['/home/userList']);
        },
        error: (err) => {
          console.error('Update error:', err);
          if (err.status === 401) {
            alert('❌ Unauthorized! Please login again.');
          } else if (err.status === 404) {
            alert('❌ User not found.');
          } else {
            alert('❌ Failed to update user. Please try again.');
          }
        }
      });
    } else {
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        access: formData.access,
        role: formData.role
      };

      this.userService.createUser(newUser).subscribe({
        next: (res: any) => {
          alert('✅ User added successfully!');
          this.router.navigate(['/home/userList']);
        },
        error: (err) => {
          console.error('Create user error:', err);

          // ✅ Handle specific error codes & messages
          if (err.status === 401) {
            alert('❌ Unauthorized! No token provided. Please login again.');
          } 
          else if (err.status === 400) {
            alert('⚠️ Invalid data! Please check your inputs.');
          } 
          else if (err.status === 409) { // ✅ Email already exists
            alert(`⚠️ ${err.error?.message || 'User already exists with this email!'}`);
          } 
          else if (err.status === 403) {
            alert('❌ Access denied! You are not authorized to add users.');
          }
          else if (err.error?.message?.includes('role')) {
            alert('⚠️ Invalid role selected.');
          } 
          else {
            alert('❌ Failed to add user! Please try again later.');
          }
        }
      });
    }
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
