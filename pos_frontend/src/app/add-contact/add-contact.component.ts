import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../core/services/contact/contact.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent {
  contactForm!: FormGroup;
  contactId!: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      supplier_business_name: ['', Validators.required],
      contact_type: ['', Validators.required],
      prefix: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      city: [''],
      state: [''],
      country: [''],
      zip_code: [''],
      dob: [''],
      landline: [''],
      mobile: [''],
      alternate_number: ['']
    });

    // Check if we are in edit mode
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.contactId = +id;
        this.loadContactData(this.contactId);
      }
    });
  }

loadContactData(id: number) {
  this.contactService.getContactById(id).subscribe({
    next: (res) => {
      const contactData = res?.data || res;

      // Normalize values
      contactData.contact_type =
        contactData.contact_type?.charAt(0).toUpperCase() +
        contactData.contact_type?.slice(1).toLowerCase();

      // Remove period in prefix if present
      if (contactData.prefix?.endsWith('.')) {
        contactData.prefix = contactData.prefix.replace('.', '');
      }

      this.contactForm.patchValue(contactData);
    },
    error: (err) => {
      console.error(' Error loading contact:', err);
      alert('Failed to load contact data!');
    },
  });
}


  //  Submit — Add or Update
  onSubmit() {
    if (this.contactForm.invalid) return;

    if (this.isEditMode) {
      //  Update existing contact
      this.contactService.updateContact(this.contactId, this.contactForm.value).subscribe({
        next: () => {
          alert(' Contact updated successfully!');
          this.router.navigate(['/home/contact_list']);
        },
        error: (err) => {
          console.error(' Error updating contact:', err);
          alert('Failed to update contact');
        }
      });
    } else {
      // ➕ Create new contact
      this.contactService.createContact(this.contactForm.value).subscribe({
        next: () => {
          alert(' Contact added successfully!');
          this.contactForm.reset();
          this.router.navigate(['/home/contact_list']);
        },
        error: (err) => {
          console.error(' Error adding contact:', err);
          alert('Failed to add contact');
        }
      });
    }
  }
}
