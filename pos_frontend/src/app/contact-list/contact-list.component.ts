import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ContactService } from '../core/services/contact/contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent {
  contacts: any[] = [];

  constructor(private contactService: ContactService, private router: Router) {}

  ngOnInit(): void {
    this.getAllContacts();
  }

  getAllContacts() {
    this.contactService.getContacts().subscribe({
      next: (res: any) => {
        this.contacts = Array.isArray(res) ? res : res?.data || [];
      },
      error: (err) => console.error(' Error fetching contacts:', err)
    });
  }

  // Edit Contact
  onEdit(contact: any) {
this.router.navigate(['/home/add-contact/edit', contact.id]);
  }


  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          alert('🗑️ Contact deleted successfully!');
          this.getAllContacts();
        },
        error: (err) => {
          console.error(' Error deleting contact:', err);
          alert('Failed to delete contact!');
        }
      });
    }
  }
}
