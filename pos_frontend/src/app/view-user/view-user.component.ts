import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ For toast messages
import { AddUserService } from '../core/services/add-user/add-user.service';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: AddUserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

getAllUsers(): void {
  this.userService.getUsers().subscribe({
    next: (res: any) => {
      console.log('✅ Users data:', res);
      // handle if API returns either an array or an object with data
      this.users = Array.isArray(res) ? res : res?.data || [];
    },
    error: (err) => {
      console.error('❌ Error fetching users:', err);
      this.toastr.error('Failed to fetch users', 'Error');
    },
  });
}


  // ✅ Navigate to Edit
  onEdit(user: any): void {
    this.router.navigate(['/home/add-user/edit/:id'], {
      queryParams: { id: user.id, name: user.name, email: user.email },
    });
  }
getRoleNames(user: any): string {
  if (user.roles && user.roles.length) {
    return user.roles.map((r: any) => r.name).join(', ');
  }
  return '—';
}
  // ✅ Delete user
  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('User deleted successfully!', 'Deleted');
          this.getAllUsers();
        },
        error: (err) => {
          console.error('❌ Error deleting user:', err);
          this.toastr.error('Failed to delete user', 'Error');
        },
      });
    }
  }
}
